# CASE: 017 — The Vanishing Hour
### An Interactive Noir Forensic Detective Mystery Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-lightgrey.svg)](https://sqlite.org/)

---

## 🔍 Case Overview

**Incident Time:** Friday, November 14, 2026 — 11:47 PM  
**Crime Scene:** The Meridian Court Residences, Penthouse 4B  
**Subject:** Timothy C. Vance (Senior Forensic Comptroller, Oberlin-Vane Trust)  
**Status:** Presumed Abducted / Missing  

At 11:47 PM, a silent panic signal pinged the Meridian Court security desk from Penthouse 4B. Responding officers and building staff found the reinforced oak entry door **deadbolted from the inside**. When the door was forced open 18 minutes later, the apartment was completely empty. 

The kitchen window—four stories above a concrete alleyway—was locked from the inside with undisturbed dust along the sill. A crystal tumbler of scotch was half-empty on the coffee table, a laptop remained open to a sensitive financial audit, and the victim's wallet, coat, and smartphone were untouched. 

Four individuals with keycard access were on the premises. Some tell the truth. Some tell partial truths. Some weave carefully disguised lies. 

The detective must **scour 6 explorable scenes**, **expose sworn contradictions**, **reconstruct the true timeline**, **unravel the physical mechanics of the locked room**, and **formulate an airtight indictment**.

---

## 🎮 Core Game Mechanics

1. **Explorable 2D Crime Scenes**:
   - 6 explorable environments: *Penthouse Apartment 4B*, *4th Floor Corridor*, *Main Lobby & Reception*, *Building Security & Surveillance Room*, *Rooftop Terrace*, and *Subterranean Parking & Loading Bay*.
   - Interactive hotspot pins positioned across scene schematics with forensic magnification and laboratory analysis.
   - Genuine clues alongside deceptive red herrings.

2. **Sworn Interrogation & Contradiction System**:
   - 4 distinct persons of interest:
     - **Gregory Vance** (Superintendent & Master Locksmith)
     - **Corinne Blake** (Asset Allocation VP & Business Colleague)
     - **Toby Ray** (Neighbor & Sound Technician in 4A)
     - **Dr. Eleanor Sterling** (Chief Physician & Personal Doctor)
   - Dynamic dialogue branches that unlock when corresponding physical clues are found.
   - **Contradiction Challenge Engine**: Confront suspect alibis with physical evidence, access logs, or chemical forensics to shatter false claims, trigger dramatic confessions, and catalog unlocked testimony.

3. **Interactive Chronological Timeline**:
   - Reconstruct the critical hour (10:15 PM – 12:15 AM).
   - Dynamic states: *Confirmed*, *Decoy/Contradicted*, and *Hidden Intervals*.
   - Uncover the truth: The 11:47 PM panic alarm was a programmed decoy timer set at 11:41 PM!

4. **Visual Investigation Corkboard**:
   - Pin suspects and evidence cards across an interactive board.
   - Draw red string/yarn connections with custom reasoning labels (*"Alibi Contradiction"*, *"Sedative Instrument"*, *"Access Card Match"*, *"Embezzlement Motive"*).

5. **Detective's Field Notebook**:
   - Categorized leather journal for theories, timeline notes, and evidence observations.
   - Automatically synchronizes with the backend SQLite database and offline browser storage.

6. **The Final Indictment & Multiple Endings**:
   - Comprehensive multi-dimensional accusation:
     - *Who is responsible?*
     - *What happened?*
     - *How was the locked-room illusion achieved?*
     - *What was the underlying motive?*
     - *Which corroborating evidence proves the case?*
   - Evaluated by the scoring engine against forensic truth:
     - **Grade S (90-100 pts)**: *The Airtight Indictment (Perfect Resolution)*
     - **Grade B (70-89 pts)**: *A Conviction on Technicalities (Mostly Correct)*
     - **Grade C (50-69 pts)**: *The Hung Jury (Partially Correct)*
     - **Grade D (35-49 pts)**: *The Shadow of Reasonable Doubt (Missed Critical Evidence)*
     - **Grade F (0-34 pts)**: *The Miscarriage of Justice (Wrong Accusation)*

7. **Procedural Web Audio Synthesizer**:
   - Atmospheric noir synth drone, tape/vinyl crackle, typewriter key strikes, and dramatic minor chord stings synthesized entirely in the browser via Web Audio API. Zero external audio file dependencies. Fully playable muted or with volume controls.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Lucide Icons, Custom Noir Theme & CRT Scanline CSS.
- **Backend**: Node.js, Express, SQLite (`better-sqlite3` with WAL mode).
- **Game Engine**: Decoupled state management, modular contradiction checker, timeline solver, and deduction scoring matrix.
- **Data Architecture**: Case-agnostic architecture where case assets are pure JSON (`case.json`, `suspects.json`, `locations.json`, `evidence.json`, `dialogue.json`, `timeline.json`, `solution.json`), enabling new cases (`case018`, `case019`) to be added without modifying game engine logic.

---

## 📁 Project Directory Structure

```text
case017-vanishing-hour/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Modular UI Views
│   │   │   ├── CaseBriefing.tsx
│   │   │   ├── CaseNotes.tsx
│   │   │   ├── CaseResolution.tsx
│   │   │   ├── ContradictionModal.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DeductionResolution.tsx
│   │   │   ├── EvidenceBoard.tsx
│   │   │   ├── EvidenceViewer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LocationViewer.tsx
│   │   │   ├── MainMenu.tsx
│   │   │   ├── SuspectInterrogation.tsx
│   │   │   └── TimelineView.tsx
│   │   ├── data/
│   │   │   ├── caseLoader.ts
│   │   │   └── cases/
│   │   │       └── case017/    # Decoupled Case Content
│   │   │           ├── case.json
│   │   │           ├── dialogue.json
│   │   │           ├── evidence.json
│   │   │           ├── locations.json
│   │   │           ├── solution.json
│   │   │           ├── suspects.json
│   │   │           └── timeline.json
│   │   ├── game/
│   │   │   ├── engine/
│   │   │   │   ├── ContradictionEngine.ts
│   │   │   │   ├── DeductionEngine.ts
│   │   │   │   └── TimelineEngine.ts
│   │   │   └── state/
│   │   │       ├── GameStateContext.tsx
│   │   │       └── types.ts
│   │   ├── services/
│   │   │   ├── apiService.ts
│   │   │   └── audioService.ts # Procedural Web Audio Synth
│   │   ├── styles/
│   │   │   ├── components.css
│   │   │   └── theme.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Express + SQLite Backend
│   ├── src/
│   │   ├── db.js               # SQLite DB Initialization
│   │   ├── index.js            # Express Entrypoint & Static Server
│   │   └── routes/
│   │       ├── cases.js
│   │       ├── notes.js
│   │       ├── saves.js
│   │       └── verify.js
│   └── package.json
├── tests/                      # Automated Test Suite (Node --test)
│   ├── contradiction.test.js
│   ├── deduction.test.js
│   ├── saveload.test.js
│   └── timeline.test.js
├── scripts/
│   └── dev.js                  # Concurrent Local Dev Spawner
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or v24+
- `npm` v9+

### 1. Clone & Install Dependencies

```bash
cd case017-vanishing-hour

# Install root, client, and server dependencies in one command:
npm run install:all
```

*(Or individually: `npm install`, `cd client && npm install`, `cd server && npm install`)*

---

## 🏃 Running the Application

### Option A: Complete Dev Mode (Concurrent Client & Server)

```bash
npm run dev
```
- Starts the Express backend on `http://localhost:3001`
- Starts the Vite React frontend on `http://localhost:5173`

### Option B: Production Build & Run

```bash
# 1. Build the production client bundle:
npm run build

# 2. Start the unified production server:
npm start
```
Open **`http://localhost:3001`** in any browser. The Express server serves both the SQLite API and the production React client.

---

## 🧪 Running Automated Tests

Run the built-in automated test suite covering Contradiction detection, Timeline unlocking, Deduction evaluation, and SQLite database storage:

```bash
npm test
```

Expected output:
```text
✔ Contradiction Engine - Gregory Vance Access Card contradiction
✔ Contradiction Engine - Corinne Blake Volvo parking ticket contradiction
✔ Contradiction Engine - Dr. Eleanor Sterling Midazolam ampoule contradiction
✔ Contradiction Engine - Irrelevant evidence returns non-contradiction
✔ Deduction Engine - Perfect Indictment yields Grade S & Perfect Resolution
✔ Deduction Engine - Correct Suspect but Wrong Method yields Grade B
✔ Deduction Engine - Correct Suspect with Missing Evidence yields Grade C
✔ Deduction Engine - Wrong Accusation yields Grade F & Miscarriage of Justice
✔ SQLite Database - Save & Load Engine Integration
✔ Timeline Engine - Events are strictly ordered chronologically
✔ Timeline Engine - Hidden intervals unlock when corroborating clue discovered
✔ Timeline Engine - Completeness increases with evidence discoveries
ℹ pass 12 | fail 0
```

---

## 🧩 How to Add Another Mystery Case (e.g., Case 018)

The application separates game-engine logic from case data:

1. Duplicate `client/src/data/cases/case017` to `client/src/data/cases/case018`.
2. Update the JSON files:
   - `case.json`: Briefing, incident details, victim dossier.
   - `suspects.json`: Suspects, alibis, and contradiction mappings.
   - `locations.json`: Explorable scenes and inspectable object coordinates (`x, y` %).
   - `evidence.json`: Clues, importance, categories, and tags.
   - `dialogue.json`: Dialogue trees and conditional unlock requirements.
   - `timeline.json`: Events and timestamps.
   - `solution.json`: Correct culprit, method, motive, essential evidence, and endings.
3. Register `case018` in `client/src/data/caseLoader.ts`. The UI and engines will automatically render and process the new mystery without changing a single React component!

---

## 🕵️ Case 017 Solution (Spoilers for Players)

<details>
<summary><strong>Click to expand the Case 017 Mystery Solution</strong></summary>

### The Mastermind:
**Dr. Eleanor Sterling** (with coerced/bribed assistance from Superintendent Gregory Vance).

### The Motive:
Timothy Vance was preparing to submit a forensic audit to the United States Attorney's Office on Monday morning, exposing **$2,420,000 in laundered funds** funneled through Dr. Sterling's private surgical clinic.

### The True Method & The Locked-Room Trick:
1. **The Sedation:** Dr. Sterling entered at 11:24 PM under the alias *"Dr. V. Martin"*. At 11:32 PM, she poisoned Timothy's scotch with 45mg of clinical Midazolam. Timothy collapsed at 11:38 PM.
2. **The Staged Alarm:** To create a false time of disappearance and manufacture an alibi, she programmed a **delayed test alert on the Honeywell keypad at 11:41 PM**, set to fire 6 minutes later at 11:47 PM.
3. **The Transport:** Having bribed Gregory Vance to disable Camera 03 and hold the freight lift, they loaded Timothy into an industrial canvas laundry hamper at 11:44 PM and took him down to the basement.
4. **The Locked Door:** Before entering the lift, they used a **180-lb neodymium cylinder magnet** pressed against the outside of the wooden door to rotate the internal brass thumbturn shut from the exterior corridor!
5. **The Escape:** At 11:58 PM, Timothy was loaded into an unmarked private ambulance van in the loading bay and driven to an off-grid recovery retreat in the Catskills. When police breached the door at 12:05 AM, they assumed he vanished at 11:47 PM from a locked room, completely unaware he was already miles away.
</details>

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
