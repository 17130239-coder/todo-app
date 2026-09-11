# Focus — Mindful Task & Flow Manager

A serene, mindful task and flow management application designed for calm intentionality, deep work, and balanced daily rhythm. Built according to the **Focus App Design System** (`design.md`).

![Focus Preview](/focus-icon.svg)

---

## 🌿 Key Features

### 1. Today / Deep Focus View
- **Mindful Greeting & Cadence**: Soft aesthetic with dynamic date headers, morning cadence badges, and intention quotes.
- **Daily Flow State Widget**: Live circular progress ring calculating completion percentages (`X of Y completed`), remaining calm tasks, and time estimates.
- **In Deep Focus Section**: Prioritized cards for high-leverage deep work tasks with duration estimates, category badges, and quick completion checkmarks.
- **Later Today Section**: Clean, softly separated actionable tasks with scheduled times (e.g. `2:00 PM`, `3:30 PM`, `4:45 PM`).
- **Completed Today Accordion**: Collapsible list with strikethrough styling and one-tap restore.
- **Mindful Pause Interlude**: Visual texture card that opens an interactive **4-7-8 Box Breathing Exercise** with expanding visual guide and meditation bowl chimes.

### 2. Lists, Spaces & Smart Views
- **Omni Search & Filter**: Real-time search across task titles, notes, spaces, and tags.
- **Smart Views 2×2 Bento Grid**:
  - **Today**: Due now and pending count.
  - **Scheduled**: Next 7 days queued count.
  - **All Tasks**: Master task count.
  - **Archive**: Historical completed milestones.
- **Spaces & Projects**:
  - *Product & Design*, *Personal Growth*, *Health & Mind*, *Home & Errands*, and custom user-created spaces.
  - Live progress bars and task counts.
  - Filter tasks instantly by space.
- **Create New Space Dialog**: Custom space name, icon picker (10+ icons), and calm palette themes (Slate, Sage, Terracotta).
- **Tags & Context Cloud**: Interactive tags (`#deepwork`, `#quickwin`, `#reading`, `#wellness`, `#finance`, `#urgent`) with instant filtering and custom tag creation.

### 3. Insights, Rhythm & Focus Session
- **14-Day Mindful Streak Banner**: 7-day dot tracker with interactive day toggles and streak level badges.
- **Today's Focus Time**: Real-time focus minutes accumulator (`2h 45m`, `+18m vs avg`, peak focus hours detection).
- **Weekly Completion Bar Chart**: Mon–Sun dynamic bar chart visualizing milestones completed.
- **Mindful Habits Tracker**: Daily habits with consistency percentage and one-tap toggles, plus custom habit creation.
- **Interactive Pomodoro Focus Session**:
  - SVG circular dial with animated sweep.
  - Presets for 15 min, 25 min, and 45 min deep work blocks.
  - **Offline Ambient Sound Engine**: Built-in Web Audio API synthesizers for *Rain & Lo-Fi*, *Forest Calm*, and *Zen Meditation Bell*.
  - Celebratory chime and gentle confetti upon session completion.

### 4. Task Details & Deliverables
- Detailed scope notes and context textarea with auto-save.
- Metadata attributes: due date, priority switcher, tags, and duration.
- Key Deliverables / Subtask Checklist with progress tracking (`X of Y completed`), inline subtask creation, and deletion.
- Embedded Pomodoro cycle directly inside the task details.
- Primary bottom actions to mark complete or delete with confirmation.

### 5. Floating Add Task Drawer
- Accessible via the center `+` button in the navigation bar.
- Rapidly configure title, context, space, priority, duration, time, tags, and initial subtasks.

### 6. Persistence & Audio
- Automatic `localStorage` persistence for all tasks, spaces, habits, tags, and focus session stats.
- Built-in reset option in Profile modal to return to pristine demo state at any time.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS 3** (Configured with custom design system tokens)
- **Google Fonts** (*Plus Jakarta Sans*) & **Material Symbols Outlined**
- **HTML5 Web Audio API** (Pure synthesized ambient audio without external audio files)
- **Canvas Confetti**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone or open the repository
cd /Users/andynguyen/workspace/todo-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Design System Tokens

- **Primary**: `#181f21`
- **Secondary (Sage)**: `#4b6456`
- **Tertiary (Terracotta)**: `#381304`
- **Surface / Linen White**: `#faf9f7`
- **Typography**: Plus Jakarta Sans
