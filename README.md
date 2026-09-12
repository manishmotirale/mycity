<div align="center">

# 🏙️ MyCity

### **Report. Engage. Improve.**
#### A gamified civic issue tracking platform that turns everyday citizens into active city contributors.

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui"/>
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Active-10B981?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Theme-Light%20%2B%20Dark-38BDF8?style=flat-square" alt="Theme"/>
  <img src="https://img.shields.io/badge/Focus-Civic%20Tech-0EA5E9?style=flat-square" alt="Civic Tech"/>
</p>

<br/>

> **MyCity connects citizens, authorities, and administrators through one transparent civic platform — making it easier to report problems, track progress, and reward participation.**

</div>

---

## ✨ Why MyCity?

Cities generate thousands of everyday problems — potholes, broken streetlights, overflowing garbage, damaged roads, water issues, and more.

The challenge isn't always identifying the problem.  
It's creating a **simple, transparent, and engaging way to move from complaint → action → resolution.**

**MyCity bridges that gap.**

```text
        👤 CITIZEN
            │
            │  Report + Photo + Location
            ▼
     ┌─────────────────┐
     │     MYCITY      │
     │  Civic Platform │
     └────────┬────────┘
              │
       ┌──────┴───────┐
       ▼              ▼
  🏛️ AUTHORITY     🛡️ ADMIN
       │              │
       │ Resolve      │ Manage
       ▼              ▼
   ✅ STATUS       📊 OVERSIGHT
       │
       └──────────────► 👤 CITIZEN
                         Track + Engage
```

---

## 🚀 Core Features

### 👤 Citizen Experience

- 📝 **Report Civic Issues** with a guided multi-step reporting flow.
- 📍 **Location-Based Reports** using map integration.
- 📸 **Photo Evidence** to provide visual context.
- 👍 **Upvote Issues** to surface problems affecting more people.
- 🔎 **Track Resolution** from submission to completion.
- 🏆 **Earn Points & Badges** through meaningful civic participation.
- 🥇 **Leaderboard** to encourage positive community engagement.

### 🏛️ Authority Workflow

- 📋 View and manage reported civic issues.
- 🔄 Update issue status as work progresses.
- 📍 Understand issue locations through map-based information.
- ✅ Mark issues as resolved after action is completed.
- 📊 Monitor the civic workload and resolution flow.

### 🛡️ Administration

- 👥 Manage platform users and roles.
- 📊 Oversee civic activity.
- 🔐 Maintain platform-level control.
- 🧭 Monitor the overall reporting and resolution ecosystem.

---

## 🎮 Gamification

MyCity doesn't treat civic participation as just another complaint form.

It turns contribution into a **positive feedback loop**:

```text
      REPORT AN ISSUE
             │
             ▼
       + Earn Points
             │
             ▼
        Unlock Badge
             │
             ▼
       Climb Leaderboard
             │
             ▼
      Inspire Community
             │
             └──────────────► REPORT AGAIN
```

### 🏅 Engagement System

| Action | Outcome |
|:---|:---|
| 📝 Report an issue | Earn civic points |
| 👍 Support an issue | Increase community visibility |
| ✅ Contribute consistently | Unlock achievements |
| 🏆 Reach milestones | Earn badges |
| 🥇 Perform highly | Rise on leaderboard |

> **The goal isn't competition for its own sake — it's making civic participation visible, rewarding, and habitual.**

---

## 🧭 Issue Reporting Flow

The reporting experience is designed to minimize friction while collecting the information required for meaningful action.

```text
┌────────────┐
│  01 ISSUE  │
│  CATEGORY  │
└─────┬──────┘
      ▼
┌────────────┐
│  02 ISSUE  │
│  DETAILS   │
└─────┬──────┘
      ▼
┌────────────┐
│  03 PHOTO  │
│  EVIDENCE  │
└─────┬──────┘
      ▼
┌────────────┐
│  04 LOCATION│
│    📍      │
└─────┬──────┘
      ▼
┌────────────┐
│  05 REVIEW │
│  & SUBMIT  │
└─────┬──────┘
      ▼
   🎉 SUBMITTED
```

---

## 🔄 Civic Issue Lifecycle

Every issue follows a clear status journey:

```text
📝 REPORTED
     │
     ▼
🔍 REVIEWING
     │
     ▼
🛠️ IN PROGRESS
     │
     ▼
✅ RESOLVED
```

This creates a simple shared understanding between the person who reported the issue and the authority responsible for addressing it.

---

## 🗺️ Location Intelligence

MyCity uses **Leaflet-based mapping** to connect civic issues with real-world locations.

Mapping helps users:

- 📍 Identify where an issue exists.
- 🧭 Provide accurate location context.
- 👀 Understand nearby civic problems.
- 🏙️ Visualize issues geographically.

---

# 🎨 Design System

MyCity follows a modern civic-tech visual language built around **clarity, trust, energy, and progress**.

The interface combines:

- 🌌 Deep blue civic-tech surfaces
- ☁️ Clean light-mode backgrounds
- 💠 Sky-blue interaction states
- 🌱 Emerald progress accents
- 🪟 Glass-inspired surfaces
- ✨ Motion-driven feedback
- 🎮 Gamification-focused visual emphasis

---

## 🎨 Color Architecture

The UI uses semantic CSS variables with HSL-based theme tokens, allowing the same components to adapt between light and dark modes.

### ☀️ Light Theme

| Token | HSL | Purpose |
|:---|:---|:---|
| `background` | `210 40% 98%` | Main application background |
| `foreground` | `222 47% 11%` | Primary text |
| `primary` | `217 85% 42%` | Primary actions & links |
| `secondary` | `210 40% 96%` | Secondary UI |
| `accent` | `210 40% 94%` | Highlights |
| `muted` | `210 40% 94%` | Supporting content |
| `border` | `214 32% 88%` | Component boundaries |
| `destructive` | `0 72% 45%` | Destructive actions |

### 🌙 Dark Theme

| Token | HSL | Purpose |
|:---|:---|:---|
| `background` | `222 47% 5%` | Deep application background |
| `foreground` | `213 31% 91%` | Primary text |
| `primary` | `199 89% 60%` | Primary actions & links |
| `secondary` | `222 47% 12%` | Secondary surfaces |
| `accent` | `222 47% 14%` | Highlights |
| `muted` | `222 47% 12%` | Supporting content |
| `border` | `222 47% 14%` | Component boundaries |
| `destructive` | `0 84% 60%` | Destructive actions |

### 🌈 Brand Accent Palette

| Color | Hex | Visual Role |
|:---|:---:|:---|
| Sky 400 | `#38BDF8` | Bright brand highlights |
| Sky 500 | `#0EA5E9` | Primary brand accent |
| Sky 600 | `#0284C7` | Strong brand emphasis |
| Emerald 400 | `#34D399` | Positive/progress accent |
| Emerald 500 | `#10B981` | Success states |
| Emerald 600 | `#059669` | Strong success emphasis |

---

## ✨ Motion & Animation Language

Motion is used to communicate **state, hierarchy, feedback, and personality** rather than decoration alone.

### ⚡ Interface Motion

- `fade-in` → Smooth content entrance
- `accordion-down` / `accordion-up` → Expandable UI transitions
- `pulse-slow` → Subtle attention states

### 🌊 Loading & Status Motion

- `ripple` → Interactive/loading feedback
- `orbit` → Circular activity motion
- `sweep` → Progress or highlight movement
- `hop` → Lightweight playful motion

### 🏙️ Page-Level Motion

- `drift` → Ambient movement
- `drop-in` → Entrance animation for special states

### 🪪 Gamification Motion

- `badge-halo` → Reward emphasis
- `badge-glare` → Highlight sweep
- `badge-pop` → Achievement reveal
- `badge-twinkle` → Celebration detail

### 💎 Brand Motion

- `wordmark-pan` → Animated brand gradient movement

> **Design principle:** motion should make the interface feel alive while remaining fast, readable, and purposeful.

---

# 🧱 Technology Stack

| Layer | Technology |
|:---|:---|
| ⚛️ Framework | **Next.js** |
| 🟦 Language | **TypeScript** |
| 🎨 Styling | **Tailwind CSS** |
| 🧩 UI | **shadcn/ui** |
| 🔐 Authentication | **NextAuth.js** |
| 🗺️ Maps | **Leaflet** |
| 🧱 Architecture | **Next.js App Router** |
| 🎭 Theming | **CSS Variables + Tailwind** |

---

# 📁 Project Structure

```text
mycity/
│
├── app/
│   ├── pages & layouts
│   ├── application routes
│   └── API routes
│
├── components/
│   ├── reusable UI
│   ├── feature components
│   └── civic workflows
│
├── public/
│   ├── images
│   ├── icons
│   └── static assets
│
├── app/globals.css
├── tailwind.config.*
├── package.json
└── README.md
```

> The exact structure may evolve as new civic workflows and platform capabilities are added.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

- **Node.js** installed
- **npm** installed
- A configured `.env.local` file for required environment variables

## 1. Clone

```bash
git clone https://github.com/your-username/mycity.git
cd mycity
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Create:

```text
.env.local
```

Add the environment variables required by your authentication, database, maps, and other integrations.

> Never commit `.env.local` or other secrets to version control.

## 4. Start Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔐 Security Principles

MyCity is designed around responsible civic data handling.

- 🔑 Authentication protects user accounts.
- 🛡️ Role-based access separates citizen, authority, and admin workflows.
- 🌐 Environment variables keep sensitive configuration outside source code.
- 📍 Location information should be handled only as required for civic reporting.
- 🚫 Secrets and credentials should never be committed to Git.

---

# 🌱 Project Vision

MyCity aims to move civic participation from:

```text
"I reported it."
        ↓
"What happened?"
        ↓
"No idea."
```

to:

```text
"I reported it."
        ↓
"I can see it."
        ↓
"It's being handled."
        ↓
"It's resolved. ✅"
```

### The bigger idea

**A better city isn't created only by authorities.  
It is created when citizens can participate, authorities can respond, and everyone can see progress.**

---

# 🏆 What Makes MyCity Different?

| Traditional Complaint System | MyCity |
|:---|:---|
| 📄 Form-based | 🎮 Engagement-driven |
| 🔇 Limited visibility | 👀 Transparent tracking |
| 🧍 Individual complaints | 👥 Community-supported issues |
| 🕐 Status uncertainty | 🔄 Visible issue lifecycle |
| 😐 No incentive | 🏆 Points & badges |
| 📍 Basic reporting | 🗺️ Location-aware reporting |
| 🧩 Separate stakeholders | 🤝 Connected ecosystem |

---

# 🔮 Future Scope

Potential extensions include:

- 🤖 AI-assisted issue categorization
- 🧠 Duplicate issue detection
- 📊 Advanced civic analytics
- 🗺️ Heatmaps for high-density issue zones
- 🔔 Real-time notifications
- 📱 Progressive Web App / mobile experience
- 🏛️ Authority performance dashboards
- 📈 Resolution-time analytics
- 🌐 Multi-language civic reporting
- ♿ Improved accessibility tooling
- 🔗 Public civic-data APIs

---

# 🤝 Contributing

Contributions that improve civic usability, accessibility, reliability, and transparency are welcome.

```text
Fork
  ↓
Create a branch
  ↓
Make your change
  ↓
Test locally
  ↓
Open a Pull Request
```

Before submitting a contribution:

- Keep components reusable.
- Follow the existing design system.
- Preserve light/dark theme compatibility.
- Avoid exposing secrets.
- Test interactive and responsive states.
- Keep animations purposeful and accessible.

---

# 📜 License

Add the project's applicable license here.

---

<div align="center">

## 🏙️ Build Better Cities. Together.

**MyCity — turning civic problems into visible progress.**

<br/>

⭐ If you find the project useful, consider giving it a star.

</div>
