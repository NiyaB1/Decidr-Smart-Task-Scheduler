# Decidr - Decision making meets responsibilty
## ⭐ A decision fatigue reducer tool for smart task scheduling

A minimalist web application that eliminates decision fatigue by intelligently suggesting what task to do next based on your available time, priorities, and deadlines. No choice paralysis. No endless lists. Just clarity.

## 🧠 The Problem

Modern work is drowning in decisions:
- "What should I work on right now?"
- "I have 30 minutes—which task fits?"
- "Which task should I prioritize?"
- "Will I finish this before the deadline?"

Decision fatigue paralyzes productivity. You waste time deciding what to do instead of actually doing it.

## ✨ The Solution

Decision Fatigue Reducer removes the choice:

1. **Create your task list** — Add tasks with time estimates, priority levels, and deadlines
2. **Tell the app your available time** — "I have 30 minutes"
3. **Get one suggestion** — The app intelligently picks the best task
4. **Execute or track remaining time** — Mark done or move to the next task

No lists to scroll. No options to debate. Just one clear action.

### Example Flow:
```
Add Tasks:
├─ Finish report (45 min) [HIGH] [Due in 2hrs]
├─ Email client (15 min) [MEDIUM]
└─ Take a break (10 min) [LOW]

User: "I have 30 minutes"
App: → Email client (15 min) [MEDIUM priority, fits perfectly]

User marks finished or says "I have 15 min left"
App: → Take a break (10 min)
```

## 🎯 Why This Works

- **Reduces cognitive load** — The app chooses for you based on priority and deadlines, not your overwhelmed brain
- **Respects urgency** — Tasks with deadlines and HIGH priority get suggested first
- **Time-aware** — Only suggests tasks that fit your available time window
- **Adaptive** — As you complete tasks, the app continuously recalculates the best next action
- **Psychological science** — Constraints (available time) + single output (one suggestion) = clarity, not paralysis

## 🛠️ Tech Stack

- **HTML** — Semantic structure with form inputs and task list
- **CSS** — Responsive, clean, minimal design (no frameworks)
- **JavaScript** — Smart suggestion algorithm with priority/deadline logic

No frameworks. No bloat. Pure frontend. ~500 lines of code.

**Future phases:**
- Phase 2: Mobile app (React Native / Flutter)
- Phase 3: Backend + cloud sync
- Phase 4: Collaboration features

## 🚀 Quick Start

1. Clone this repository
2. Open `index.html` in your browser
3. Add tasks with priorities and deadlines
4. Enter available time
5. Get a smart suggestion
6. Complete and move to the next task

That's it.

## 📋 Features

- ✅ **Task Management** — Add, delete, and view all tasks easily
- ✅ **Priority Levels** — Mark tasks as HIGH, MEDIUM, or LOW priority
- ✅ **Deadline Tracking** — Set deadlines for urgent tasks
- ✅ **Smart Suggestion Engine** — Recommends task based on:
  - Available time
  - Priority level (HIGH → MEDIUM → LOW)
  - Deadline urgency
  - Task duration fit
- ✅ **Task Completion** — Mark tasks done or track remaining time
- ✅ **Continuous Optimization** — As you complete tasks, app recalculates best next action
- ✅ **Mobile Responsive** — Works on desktop and mobile (Phase 2: React Native / Flutter app)
- ✅ **Zero Dependencies** — Pure HTML, CSS, JavaScript
- ✅ **Persistent Storage** — Saves tasks to browser (localStorage)

## 🎤 For Recruiters

*"I built a smart task scheduler that eliminates decision fatigue in the workplace. The app combines cognitive psychology principles with algorithmic decision-making: it respects user constraints (available time + deadline urgency), applies priority logic, and delivers one actionable suggestion instead of overwhelming users with options. This demonstrates full-stack thinking: UX psychology + algorithm design + clean code architecture."*

**Technical highlights:**
- Task priority and deadline-based algorithm
- Event-driven JavaScript with DOM manipulation
- State management without frameworks
- localStorage for data persistence
- Responsive mobile-first design
- Clean separation of concerns (HTML structure, CSS styling, JS logic)

## 📜 License
This project is licensed under the **MIT License**.

---

**Stop thinking. Start acting.**
