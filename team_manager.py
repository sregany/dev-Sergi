#!/usr/bin/env python3
"""
Antigravity Team Manager v3
Orquestador multi-agente para proyectos SaaS con IA
"""

import json
import os
import sys
import argparse
import time
from datetime import datetime, timedelta
from pathlib import Path

TEAM_DIR = Path(".antigravity/team")
TASKS_FILE = TEAM_DIR / "tasks.json"
SPRINT_FILE = TEAM_DIR / "sprint.json"
CONTEXT_FILE = TEAM_DIR / "context.json"
METRICS_FILE = TEAM_DIR / "metrics.json"
BROADCAST_FILE = TEAM_DIR / "broadcast.msg"
LOCK_TIMEOUT_MINUTES = 30

# ─── Colores ANSI ────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
MAGENTA= "\033[95m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"

STATUS_COLOR = {
    "PENDING":    YELLOW,
    "IN_PROGRESS":CYAN,
    "REVIEW":     MAGENTA,
    "COMPLETED":  GREEN,
    "REJECTED":   RED,
    "ESCALATED":  BOLD + RED,
    "BLOCKED":    RED,
}

PRIORITY_ICON = {"CRITICAL": "[!!!]", "HIGH": "[!!]", "MEDIUM": "[!]", "LOW": "[-]"}

# ─── Utilidades ──────────────────────────────────────────────────────────────

def ts():
    return datetime.now().strftime("%H:%M:%S")

def log(msg: str, color: str = GREEN, agent: str = "system"):
    # Limpiamos todos los caracteres no-ASCII para la terminal de Windows
    safe_msg = "".join([c if ord(c) < 128 else "?" for c in msg])
    print(f"{color}[{ts()}] {safe_msg}{RESET}")
    _write_log(agent, msg)

# ... (continuing edits for other specific lines) ...

def _write_log(agent: str, msg: str):
    log_dir = TEAM_DIR / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    entry = f"[{datetime.now().isoformat()}] {msg}\n"
    (log_dir / f"{agent}.log").open("a", encoding="utf-8").write(entry)

def _load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))

def _save_json(path: Path, data: dict):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def _now_iso() -> str:
    return datetime.now().isoformat()


# ─── Inicialización ──────────────────────────────────────────────────────────

def init_team(project_name: str = "Mi SaaS", stack: str = "Next.js 14 + TypeScript + Tailwind + Prisma"):
    for sub in ["mailbox", "locks", "logs", "reviews"]:
        (TEAM_DIR / sub).mkdir(parents=True, exist_ok=True)

    if not TASKS_FILE.exists():
        _save_json(TASKS_FILE, {"tasks": [], "next_id": 1})

    _save_json(CONTEXT_FILE, {
        "project_name": project_name,
        "stack": stack,
        "created_at": _now_iso(),
        "status": "ACTIVE",
        "version": "3.0"
    })

    _save_json(METRICS_FILE, {
        "total_tasks": 0,
        "completed": 0,
        "rejected": 0,
        "avg_review_cycles": 0,
        "sprints": []
    })

    BROADCAST_FILE.touch()
    log(f"* Equipo Antigravity Pro inicializado: '{project_name}'", BOLD, "Reganybot")
    log(f"  Stack: {stack}", DIM, "Reganybot")
    status()


# ─── Gestión de Sprints ──────────────────────────────────────────────────────

def start_sprint(name: str, goal: str, days: int = 7):
    sprint = {
        "name": name,
        "goal": goal,
        "started_at": _now_iso(),
        "ends_at": (datetime.now() + timedelta(days=days)).isoformat(),
        "days": days,
        "task_ids": [],
        "status": "ACTIVE"
    }
    _save_json(SPRINT_FILE, sprint)
    log(f"Sprint '{name}' iniciado -- {days} dias. Meta: {goal}", CYAN, "Reganybot")

def close_sprint():
    sprint = _load_json(SPRINT_FILE)
    if not sprint:
        log("No hay sprint activo.", YELLOW)
        return
    data = _load_json(TASKS_FILE)
    tasks = data.get("tasks", [])
    sprint_tasks = [t for t in tasks if t["id"] in sprint.get("task_ids", [])]
    done = sum(1 for t in sprint_tasks if t["status"] == "COMPLETED")
    total = len(sprint_tasks)
    sprint["status"] = "CLOSED"
    sprint["closed_at"] = _now_iso()
    sprint["velocity"] = done
    _save_json(SPRINT_FILE, sprint)

    metrics = _load_json(METRICS_FILE)
    metrics["sprints"].append({"name": sprint["name"], "velocity": done, "total": total})
    _save_json(METRICS_FILE, metrics)
    log(f"* Sprint '{sprint['name']}' cerrado -- Velocidad: {done}/{total} tareas", BOLD, "Reganybot")


# ─── Gestión de Tareas ───────────────────────────────────────────────────────

def assign_task(
    title: str,
    assigned_to: str,
    priority: str = "MEDIUM",
    deps: list = None,
    description: str = "",
    sprint_add: bool = True
):
    deps = deps or []
    data = _load_json(TASKS_FILE)
    tasks = data.get("tasks", [])
    next_id = data.get("next_id", len(tasks) + 1)

    task = {
        "id": next_id,
        "title": title,
        "description": description,
        "status": "PENDING",
        "priority": priority,
        "plan_approved": False,
        "assigned_to": assigned_to,
        "dependencies": [int(d) for d in deps],
        "created_at": _now_iso(),
        "started_at": None,
        "completed_at": None,
        "review_cycles": 0,
        "rejection_reason": None,
        "retries": 0,
    }
    tasks.append(task)
    data["tasks"] = tasks
    data["next_id"] = next_id + 1
    _save_json(TASKS_FILE, data)

    # Añadir al sprint activo
    if sprint_add:
        sprint = _load_json(SPRINT_FILE)
        if sprint.get("status") == "ACTIVE":
            sprint.setdefault("task_ids", []).append(next_id)
            _save_json(SPRINT_FILE, sprint)

    icon = PRIORITY_ICON.get(priority, "⚪")
    log(f"{icon} Tarea #{next_id} '{title}' → {assigned_to}", CYAN, "Reganybot")
    if deps:
        log(f"   Depende de: {deps}", DIM, "Reganybot")
    return next_id

def start_task(task_id: int, agent: str):
    data = _load_json(TASKS_FILE)
    for t in data["tasks"]:
        if t["id"] == task_id:
            completed = {x["id"] for x in data["tasks"] if x["status"] == "COMPLETED"}
            blocked = [d for d in t["dependencies"] if d not in completed]
            if blocked:
                log(f"✗ Tarea #{task_id} bloqueada. Pendientes: {blocked}", RED, agent)
                return False
            t["status"] = "IN_PROGRESS"
            t["started_at"] = _now_iso()
            break
    _save_json(TASKS_FILE, data)
    log(f"-> Tarea #{task_id} iniciada por {agent}", CYAN, agent)
    return True

def complete_task(task_id: int, agent: str, summary: str = ""):
    data = _load_json(TASKS_FILE)
    for t in data["tasks"]:
        if t["id"] == task_id:
            t["status"] = "REVIEW"
            t["completed_at"] = _now_iso()
            t["completion_summary"] = summary
            t["review_cycles"] += 1
            break
    _save_json(TASKS_FILE, data)
    _release_agent_locks(agent)
    send_message(agent, "Revisor",
        f"Tarea #{task_id} lista para revisión. Resumen: {summary or 'ver código'}")
    log(f"[OK] Tarea #{task_id} enviada a revision por {agent}", YELLOW, agent)

def approve_task(task_id: int, reviewer: str = "Revisor", notes: str = ""):
    data = _load_json(TASKS_FILE)
    for t in data["tasks"]:
        if t["id"] == task_id and t["status"] == "REVIEW":
            t["status"] = "COMPLETED"
            t["approved_at"] = _now_iso()
            t["review_notes"] = notes
            break
    _save_json(TASKS_FILE, data)
    _save_review(task_id, reviewer, "APPROVED", notes)
    _update_metrics("completed")
    log(f"* Tarea #{task_id} APROBADA por {reviewer}", GREEN, reviewer)
    _check_unblocked_tasks()

def reject_task(task_id: int, reviewer: str = "Revisor", reason: str = ""):
    data = _load_json(TASKS_FILE)
    for t in data["tasks"]:
        if t["id"] == task_id:
            t["retries"] = t.get("retries", 0) + 1
            if t["retries"] >= 3:
                t["status"] = "ESCALATED"
                send_message(reviewer, "Reganybot",
                    f"⚠️ Tarea #{task_id} escalada tras 3 rechazos: {reason}")
                log(f"⚠️ Tarea #{task_id} ESCALADA a Reganybot (3 rechazos)", BOLD + RED, reviewer)
            else:
                t["status"] = "IN_PROGRESS"
                t["rejection_reason"] = reason
                send_message(reviewer, t["assigned_to"],
                    f"Tarea #{task_id} rechazada (intento {t['retries']}/3): {reason}")
                log(f"✗ Tarea #{task_id} RECHAZADA ({t['retries']}/3): {reason}", RED, reviewer)
            break
    _save_json(TASKS_FILE, data)
    _save_review(task_id, reviewer, "REJECTED", reason)
    _update_metrics("rejected")

def _save_review(task_id: int, reviewer: str, verdict: str, notes: str):
    reviews_dir = TEAM_DIR / "reviews"
    reviews_dir.mkdir(exist_ok=True)
    entry = {
        "task_id": task_id, "reviewer": reviewer,
        "verdict": verdict, "notes": notes, "at": _now_iso()
    }
    path = reviews_dir / f"task_{task_id}.json"
    history = []
    if path.exists():
        history = json.loads(path.read_text())
    history.append(entry)
    path.write_text(json.dumps(history, indent=2))


# ─── Sistema de Locks ────────────────────────────────────────────────────────

def acquire_lock(agent: str, filename: str) -> bool:
    locks_dir = TEAM_DIR / "locks"
    locks_dir.mkdir(exist_ok=True)
    safe_name = filename.replace("/", "_").replace("\\", "_")
    lock_path = locks_dir / f"{safe_name}.lock"

    if lock_path.exists():
        info = json.loads(lock_path.read_text())
        acquired = datetime.fromisoformat(info["acquired_at"])
        age_min = (datetime.now() - acquired).seconds / 60
        if age_min > LOCK_TIMEOUT_MINUTES:
            log(f"⚠ Lock stale de {info['agent']} ({age_min:.0f}m) — liberando automáticamente", YELLOW)
            lock_path.unlink()
        else:
            log(f"✗ '{filename}' bloqueado por {info['agent']} (hace {age_min:.0f}m). Espera.", RED, agent)
            return False

    lock_path.write_text(json.dumps({
        "agent": agent, "file": filename, "acquired_at": _now_iso()
    }))
    log(f"🔒 Lock: '{filename}' → {agent}", YELLOW, agent)
    return True

def release_lock(agent: str, filename: str):
    safe_name = filename.replace("/", "_").replace("\\", "_")
    lock_path = TEAM_DIR / "locks" / f"{safe_name}.lock"
    if lock_path.exists():
        lock_path.unlink()
        log(f"🔓 Lock liberado: '{filename}' por {agent}", GREEN, agent)

def _release_agent_locks(agent: str):
    locks_dir = TEAM_DIR / "locks"
    if not locks_dir.exists():
        return
    for lock_file in locks_dir.glob("*.lock"):
        info = json.loads(lock_file.read_text())
        if info.get("agent") == agent:
            lock_file.unlink()
            log(f"🔓 Lock auto-liberado: '{info['file']}' al completar tarea", DIM, agent)


# ─── Mensajería ──────────────────────────────────────────────────────────────

def send_message(sender: str, receiver: str, text: str, msg_type: str = "DIRECT"):
    mailbox_dir = TEAM_DIR / "mailbox"
    mailbox_dir.mkdir(exist_ok=True)
    msg = {"de": sender, "tipo": msg_type, "mensaje": text, "timestamp": _now_iso(), "leido": False}
    path = mailbox_dir / f"{receiver}.msg"
    with path.open("a") as f:
        f.write(json.dumps(msg, ensure_ascii=False) + "\n")
    log(f"✉ {sender} → {receiver}: {text[:70]}", CYAN, sender)

def broadcast(sender: str, text: str):
    msg = {"de": sender, "tipo": "BROADCAST", "mensaje": text, "timestamp": _now_iso()}
    with BROADCAST_FILE.open("a") as f:
        f.write(json.dumps(msg, ensure_ascii=False) + "\n")
    log(f"📢 BROADCAST [{sender}]: {text[:70]}", BOLD, sender)

def read_messages(agent: str, mark_read: bool = True):
    path = TEAM_DIR / "mailbox" / f"{agent}.msg"
    if not path.exists():
        log(f"Bandeja vacía para {agent}", YELLOW)
        return
    lines = path.read_text().strip().splitlines()
    unread = [json.loads(l) for l in lines if not json.loads(l).get("leido", False)]
    print(f"\n{CYAN}📬 Mensajes para {agent} ({len(unread)} sin leer / {len(lines)} total):{RESET}")
    for msg in lines[-20:]:
        m = json.loads(msg)
        icon = "●" if not m.get("leido") else "○"
        print(f"  {icon} [{m['timestamp'][11:16]}] {m['de']}: {m['mensaje']}")
    if mark_read:
        updated = [json.loads(l) for l in lines]
        for m in updated:
            m["leido"] = True
        path.write_text("\n".join(json.dumps(m) for m in updated) + "\n")


# ─── Métricas ────────────────────────────────────────────────────────────────

def _update_metrics(event: str):
    metrics = _load_json(METRICS_FILE)
    metrics[event] = metrics.get(event, 0) + 1
    metrics["total_tasks"] = metrics.get("total_tasks", 0)
    _save_json(METRICS_FILE, metrics)

def show_metrics():
    metrics = _load_json(METRICS_FILE)
    data = _load_json(TASKS_FILE)
    tasks = data.get("tasks", [])
    by_status = {}
    for t in tasks:
        by_status[t["status"]] = by_status.get(t["status"], 0) + 1

    print(f"\n{BOLD}/------------------------------------------------------\\")
    print(f"|    METRICAS DEL EQUIPO ANTIGRAVITY                    |")
    print(f"\\------------------------------------------------------/{RESET}")
    print(f"  Total tareas:   {len(tasks)}")
    print(f"  Completadas:    {GREEN}{by_status.get('COMPLETED', 0)}{RESET}")
    print(f"  En progreso:    {CYAN}{by_status.get('IN_PROGRESS', 0)}{RESET}")
    print(f"  En revisión:    {MAGENTA}{by_status.get('REVIEW', 0)}{RESET}")
    print(f"  Rechazadas:     {RED}{metrics.get('rejected', 0)}{RESET}")
    print(f"  Escaladas:      {RED}{by_status.get('ESCALATED', 0)}{RESET}")
    sprints = metrics.get("sprints", [])
    if sprints:
        print(f"\n  {BOLD}Historial de Sprints:{RESET}")
        for s in sprints:
            pct = int(s['velocity'] / s['total'] * 100) if s['total'] else 0
            print(f"    • {s['name']}: {s['velocity']}/{s['total']} ({pct}%)")
    print(f"{BOLD}{'═'*55}{RESET}\n")


# ─── Dashboard ───────────────────────────────────────────────────────────────

def status():
    data = _load_json(TASKS_FILE)
    tasks = data.get("tasks", [])
    ctx = _load_json(CONTEXT_FILE)
    sprint = _load_json(SPRINT_FILE)

    project = ctx.get("project_name", "Proyecto")
    stack = ctx.get("stack", "")

    print(f"\n{BOLD}+--------------------------------------------------------------+")
    print(f"|    EQUIPO ANTIGRAVITY -- {project:<36} |")
    print(f"|    {DIM}{stack:<58}{BOLD} |")
    if sprint.get("status") == "ACTIVE":
        print(f"|    Sprint: {sprint['name']:<49} |")
    print(f"+--------------------------------------------------------------+{RESET}\n")

    if not tasks:
        print(f"  {YELLOW}No hay tareas asignadas aún.{RESET}\n")
        return

    for priority in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
        priority_tasks = [t for t in tasks if t.get("priority") == priority]
        if priority_tasks:
            icon = PRIORITY_ICON.get(priority, "")
            print(f"  {BOLD}{icon} {priority}{RESET}")
            for t in priority_tasks:
                color = STATUS_COLOR.get(t["status"], RESET)
                deps = f" {DIM}[deps:{t['dependencies']}]{RESET}" if t["dependencies"] else ""
                retries = f" {RED}({t['retries']} reintentos){RESET}" if t.get("retries", 0) > 0 else ""
                cycles = f" {DIM}[rev:{t['review_cycles']}]{RESET}" if t.get("review_cycles", 0) > 0 else ""
                print(f"    {color}[{t['status']:12}]{RESET} #{t['id']:>3} {t['title']:<38} -> {t['assigned_to']}{deps}{retries}{cycles}")

    # Locks activos
    locks_dir = TEAM_DIR / "locks"
    if locks_dir.exists():
        active = list(locks_dir.glob("*.lock"))
        if active:
            print(f"\n  {YELLOW}🔒 Locks activos:{RESET}")
            for lf in active:
                info = json.loads(lf.read_text())
                age = (datetime.now() - datetime.fromisoformat(info["acquired_at"])).seconds // 60
                stale = f" {RED}(⚠ STALE){RESET}" if age > LOCK_TIMEOUT_MINUTES else ""
                print(f"    • {info['file']} → {info['agent']} ({age}m){stale}")
    print()


# ─── Comprobación de dependencias ────────────────────────────────────────────

def _check_unblocked_tasks():
    data = _load_json(TASKS_FILE)
    completed = {t["id"] for t in data["tasks"] if t["status"] == "COMPLETED"}
    for t in data["tasks"]:
        if t["status"] == "PENDING" and all(d in completed for d in t["dependencies"]):
            send_message("Reganybot", t["assigned_to"],
                f"✅ Tarea #{t['id']} '{t['title']}' DESBLOQUEADA. Puedes empezar.")


# ─── CLI ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        prog="team_manager",
        description="Antigravity Team Manager v3 — Orquestador Multi-Agente"
    )
    sub = parser.add_subparsers(dest="cmd")

    # init
    p = sub.add_parser("init", help="Inicializar el equipo")
    p.add_argument("name", nargs="?", default="Mi SaaS")
    p.add_argument("stack", nargs="?", default="Next.js 14 + TypeScript + Tailwind + Prisma")

    # sprint
    p = sub.add_parser("sprint", help="Iniciar sprint")
    p.add_argument("name"); p.add_argument("goal"); p.add_argument("days", nargs="?", type=int, default=7)

    # close-sprint
    sub.add_parser("close-sprint", help="Cerrar sprint activo")

    # assign
    p = sub.add_parser("assign", help="Asignar tarea")
    p.add_argument("title"); p.add_argument("agent"); p.add_argument("priority", nargs="?", default="MEDIUM")
    p.add_argument("--deps", nargs="*", type=int, default=[])
    p.add_argument("--desc", default="")

    # start
    p = sub.add_parser("start", help="Iniciar tarea")
    p.add_argument("task_id", type=int); p.add_argument("agent")

    # complete
    p = sub.add_parser("complete", help="Completar tarea (enviar a revisión)")
    p.add_argument("task_id", type=int); p.add_argument("agent")
    p.add_argument("--summary", default="")

    # approve
    p = sub.add_parser("approve", help="Aprobar tarea")
    p.add_argument("task_id", type=int)
    p.add_argument("--reviewer", default="Revisor"); p.add_argument("--notes", default="")

    # reject
    p = sub.add_parser("reject", help="Rechazar tarea")
    p.add_argument("task_id", type=int); p.add_argument("reason")
    p.add_argument("--reviewer", default="Revisor")

    # lock / unlock
    p = sub.add_parser("lock", help="Adquirir lock sobre archivo")
    p.add_argument("agent"); p.add_argument("file")
    p = sub.add_parser("unlock", help="Liberar lock")
    p.add_argument("agent"); p.add_argument("file")

    # msg / broadcast / inbox
    p = sub.add_parser("msg", help="Enviar mensaje directo")
    p.add_argument("sender"); p.add_argument("receiver"); p.add_argument("text")
    p = sub.add_parser("broadcast", help="Mensaje a todo el equipo")
    p.add_argument("sender"); p.add_argument("text")
    p = sub.add_parser("inbox", help="Leer mensajes de un agente")
    p.add_argument("agent")

    # status / metrics
    sub.add_parser("status", help="Ver dashboard del equipo")
    sub.add_parser("metrics", help="Ver métricas y velocidad")

    args = parser.parse_args()

    dispatch = {
        "init":        lambda: init_team(args.name, args.stack),
        "sprint":      lambda: start_sprint(args.name, args.goal, args.days),
        "close-sprint":lambda: close_sprint(),
        "assign":      lambda: assign_task(args.title, args.agent, args.priority, args.deps, args.desc),
        "start":       lambda: start_task(args.task_id, args.agent),
        "complete":    lambda: complete_task(args.task_id, args.agent, args.summary),
        "approve":     lambda: approve_task(args.task_id, args.reviewer, args.notes),
        "reject":      lambda: reject_task(args.task_id, args.reviewer, args.reason),
        "lock":        lambda: acquire_lock(args.agent, args.file),
        "unlock":      lambda: release_lock(args.agent, args.file),
        "msg":         lambda: send_message(args.sender, args.receiver, args.text),
        "broadcast":   lambda: broadcast(args.sender, args.text),
        "inbox":       lambda: read_messages(args.agent),
        "status":      lambda: status(),
        "metrics":     lambda: show_metrics(),
    }

    if not args.cmd:
        status()
    elif args.cmd in dispatch:
        dispatch[args.cmd]()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
