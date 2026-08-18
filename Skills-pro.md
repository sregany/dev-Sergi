# Skill: Equipo Antigravity Pro (Multi-Agente v3)

Esta skill coordina un equipo de agentes IA especializados trabajando en paralelo
sobre el mismo proyecto SaaS, con orquestación avanzada, sprints, control de
calidad estricto y pipeline de entrega automatizado.

---

## Estructura de Carpetas

```
.antigravity/
└── team/
    ├── tasks.json          # Tareas maestras: estado, dependencias, historial
    ├── sprint.json         # Sprint activo: objetivos, fechas, velocidad
    ├── broadcast.msg       # Canal global de anuncios para todo el equipo
    ├── context.json        # Stack, nombre del proyecto, config global
    ├── mailbox/            # Bandeja de entrada por agente (.msg)
    ├── locks/              # Semáforos con timestamp para evitar conflictos
    ├── logs/               # Historial detallado de acciones por agente
    ├── reviews/            # Feedback del Revisor por tarea
    └── metrics.json        # KPIs del equipo: velocidad, rechazos, tiempo
```

---

## Roles del Equipo

| Rol                      | Responsabilidad                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| **Reganybot** (Director) | Divide el trabajo, asigna roles, aprueba planes, desbloquea dependencias, gestiona sprints         |
| **Arquitecto**           | Define estructura de carpetas, stack, patrones, convenciones y contratos de API antes de codificar |
| **Frontend**             | Componentes React/Next.js, responsive, animaciones, UI/UX, accesibilidad                           |
| **Backend**              | APIs REST/tRPC, lógica de negocio, autenticación, integraciones externas                           |
| **DB Engineer**          | Esquema de base de datos, migraciones, índices, seeds, queries optimizadas                         |
| **Auth Specialist**      | Login, registro, OAuth, roles, permisos, JWT/sesiones                                              |
| **Marketer**             | Copywriting, headlines, CTAs, textos SEO, paleta de marca, microcopy                               |
| **Investigador**         | Análisis de competencia, keywords, tendencias, benchmarks de UX                                    |
| **Revisor**              | Bugs, responsive, seguridad, accesibilidad, performance, code review                               |
| **DevOps**               | Vercel/Railway config, CI/CD, variables de entorno, dominio, monitoreo                             |
| **QA Tester**            | Checklist completo antes de entregar: funcional, visual, edge cases                                |
| **Security**             | OWASP top 10, rate limiting, sanitización de inputs, headers seguros                               |

---

## Protocolo de Orquestación

### Ciclo de vida de una tarea

```
PENDING → IN_PROGRESS → REVIEW → COMPLETED
                ↑            ↓
                └── REJECTED ←┘  (vuelve a IN_PROGRESS con motivo)
                    (máx 3 reintentos, luego ESCALATED → Reganybot)
```

### Reglas Críticas (todos los agentes deben cumplirlas)

1. **NUNCA** editar un archivo si existe un `.lock` activo (verificar primero)
2. Los locks tienen **timeout de 30 minutos** — después se consideran stale y se liberan
3. **NUNCA** iniciar una tarea sin que sus dependencias estén en `COMPLETED`
4. Todo cambio de arquitectura requiere **plan aprobado por Reganybot** antes de código
5. Al completar, liberar locks y notificar al Revisor con descripción del trabajo
6. El Revisor tiene **máximo 3 revisiones** por tarea antes de escalar al Director
7. Los agentes **registran su log** al iniciar y terminar cada acción

### Flujo detallado

```
1. Reganybot → divide problema en tareas atómicas → tasks.json (PENDING)
2. Arquitecto → define contratos, estructura, convenciones → plan aprobado
3. Agente adquiere lock(s) → estado IN_PROGRESS → registra en logs/
4. Agente trabaja → puede pedir info a otros vía mailbox
5. Agente completa → libera locks → estado REVIEW → notifica Revisor
6. Revisor evalúa según checklist → APPROVE o REJECT con motivo detallado
7. Si COMPLETED → _check_unblocked_tasks() desbloquea dependientes
8. Sprint cerrado → metrics.json actualizado → Reganybot genera reporte
```

---

## Script de Orquestación (team_manager.py)

Guarda como `team_manager.py` en la raíz del proyecto:

```python
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

PRIORITY_ICON = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢"}


# ─── Utilidades ──────────────────────────────────────────────────────────────

def ts():
    return datetime.now().strftime("%H:%M:%S")

def log(msg: str, color: str = GREEN, agent: str = "system"):
    print(f"{color}[{ts()}] {msg}{RESET}")
    _write_log(agent, msg)

def _write_log(agent: str, msg: str):
    log_dir = TEAM_DIR / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    entry = f"[{datetime.now().isoformat()}] {msg}\n"
    (log_dir / f"{agent}.log").open("a").write(entry)

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
    log(f"✦ Equipo Antigravity Pro inicializado: '{project_name}'", BOLD, "Reganybot")
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
    log(f"🏃 Sprint '{name}' iniciado — {days} días. Meta: {goal}", CYAN, "Reganybot")

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
    log(f"✦ Sprint '{sprint['name']}' cerrado — Velocidad: {done}/{total} tareas", BOLD, "Reganybot")


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
    log(f"▶ Tarea #{task_id} iniciada por {agent}", CYAN, agent)
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
    log(f"✔ Tarea #{task_id} enviada a revisión por {agent}", YELLOW, agent)

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
    log(f"✦ Tarea #{task_id} APROBADA por {reviewer}", GREEN, reviewer)
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

    print(f"\n{BOLD}{'═'*55}")
    print(f"  📊 MÉTRICAS DEL EQUIPO ANTIGRAVITY")
    print(f"{'═'*55}{RESET}")
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

    print(f"\n{BOLD}╔{'═'*60}╗")
    print(f"║  🚀 EQUIPO ANTIGRAVITY — {project:<34}║")
    print(f"║  {DIM}{stack:<58}{BOLD}║")
    if sprint.get("status") == "ACTIVE":
        print(f"║  🏃 Sprint: {sprint['name']:<47}║")
    print(f"╚{'═'*60}╝{RESET}\n")

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
                print(f"    {color}[{t['status']:12}]{RESET} #{t['id']:>3} {t['title']:<38} → {t['assigned_to']}{deps}{retries}{cycles}")

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
```

---

## Comandos de uso rápido

```bash
# ── Configuración inicial ──────────────────────────────────────────────────
python team_manager.py init "MiApp SaaS" "Next.js 14 + TypeScript + Tailwind + Prisma + Supabase"

# ── Sprints ───────────────────────────────────────────────────────────────
python team_manager.py sprint "Sprint 1" "MVP funcional con auth y dashboard" 7
python team_manager.py close-sprint

# ── Dashboard y métricas ──────────────────────────────────────────────────
python team_manager.py status
python team_manager.py metrics

# ── Asignar tareas con dependencias ──────────────────────────────────────
python team_manager.py assign "Definir schema DB" DB_Engineer CRITICAL
python team_manager.py assign "Configurar Auth (NextAuth)" Auth_Specialist HIGH --deps 1
python team_manager.py assign "Hero Section + Layout" Frontend HIGH
python team_manager.py assign "API /users CRUD" Backend HIGH --deps 1
python team_manager.py assign "Copywriting landing" Marketer MEDIUM
python team_manager.py assign "Deploy Vercel + env vars" DevOps MEDIUM --deps 3 4
python team_manager.py assign "Audit OWASP Top 10" Security HIGH --deps 4

# ── Ciclo de vida de una tarea ────────────────────────────────────────────
python team_manager.py start 3 Frontend
python team_manager.py lock Frontend "components/Hero.tsx"
# ... agente trabaja ...
python team_manager.py unlock Frontend "components/Hero.tsx"
python team_manager.py complete 3 Frontend --summary "Hero con animaciones, responsive 320px-1920px"

# ── Revisión ──────────────────────────────────────────────────────────────
python team_manager.py approve 3 --reviewer Revisor --notes "Perfecto, animaciones fluidas"
python team_manager.py reject 3 "Falta aria-label en botón CTA" --reviewer Revisor

# ── Mensajería ────────────────────────────────────────────────────────────
python team_manager.py msg Frontend Revisor "Hero listo, revisa mobile 375px"
python team_manager.py inbox Revisor
python team_manager.py broadcast Reganybot "Cambio de paleta a terracota #c2410c — actualizar tokens"
```

---

## Ejemplo: Flujo completo de un SaaS desde cero

```bash
# 1. Init + Sprint
python team_manager.py init "Piedra & Obra" "Next.js 14 + Prisma + Supabase"
python team_manager.py sprint "Sprint 1" "Landing + Auth + Dashboard base" 7

# 2. Tareas de arquitectura (primero siempre)
python team_manager.py assign "Definir estructura carpetas y contratos API" Arquitecto CRITICAL
python team_manager.py assign "Schema Prisma (users, projects, invoices)" DB_Engineer CRITICAL --deps 1

# 3. Core features en paralelo (tras aprobar arquitectura)
python team_manager.py assign "Auth NextAuth + middleware" Auth_Specialist HIGH --deps 1 2
python team_manager.py assign "Landing page completa" Frontend HIGH --deps 1
python team_manager.py assign "Copywriting landing + SEO meta" Marketer MEDIUM
python team_manager.py assign "API REST /projects /invoices" Backend HIGH --deps 2
python team_manager.py assign "Dashboard cliente (UI)" Frontend HIGH --deps 3

# 4. Calidad y entrega
python team_manager.py assign "Audit seguridad OWASP" Security HIGH --deps 3 6
python team_manager.py assign "QA checklist completo" QA MEDIUM --deps 4 5 6 7
python team_manager.py assign "Deploy Vercel prod + dominio" DevOps MEDIUM --deps 8 9
```

---

## Cómo activarlo en Cursor / Claude Code

1. Guarda este archivo como `.cursor/skills/equipo-antigravity.md`
2. Guarda `team_manager.py` en la raíz del proyecto
3. Di en el chat:

> _"Usa la skill Equipo Antigravity Pro para construir este proyecto SaaS: [descripción]"_

4. **Reganybot** inicializará el equipo, creará el sprint y repartirá tareas automáticamente
5. Cada agente trabaja en su rama de responsabilidad respetando locks y dependencias

---

## Checklist del Revisor (por tipo de tarea)

### Frontend

- [ ] Responsive: 320px / 375px / 768px / 1280px / 1920px
- [ ] Accesibilidad: aria-labels, contraste WCAG AA, focus visible
- [ ] Performance: imágenes optimizadas, lazy loading, CLS < 0.1
- [ ] Animaciones: respeta `prefers-reduced-motion`
- [ ] Cross-browser: Chrome, Firefox, Safari

### Backend / API

- [ ] Validación de inputs (Zod o similar)
- [ ] Manejo de errores con códigos HTTP correctos
- [ ] Rate limiting en endpoints públicos
- [ ] Tests unitarios en lógica crítica
- [ ] Sin secrets hardcodeados

### Base de Datos

- [ ] Índices en campos de búsqueda frecuente
- [ ] Migraciones reversibles
- [ ] Sin N+1 queries
- [ ] Soft deletes donde corresponde

### Seguridad

- [ ] OWASP Top 10 revisado
- [ ] Headers de seguridad (CSP, HSTS, X-Frame-Options)
- [ ] Sanitización de inputs
- [ ] Auth protege todas las rutas privadas
