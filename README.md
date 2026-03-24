# 🚗 3D Portfolio Experience

An interactive 3D web game portfolio inspired by Bruno Simon, built with React Three Fiber, Rapier physics, Tailwind CSS, and GSAP.

## ✨ Features

| Feature | Details |
|---|---|
| **3D World** | Drive a physics-based car through a stylised open world |
| **Portfolio Zones** | 4 interactive buildings: Projects, About, Skills, Contact |
| **Achievements** | 5 unlockable achievements as you explore |
| **Easter Eggs** | 3 hidden glowing orbs scattered around the map |
| **Post-Processing** | Bloom + Chromatic Aberration via `@react-three/postprocessing` |
| **Ambient Particles** | 300 floating instanced particles for atmosphere |
| **Background Music** | Toggleable ambient soundtrack |
| **Mouse Look** | Click canvas to lock pointer and rotate camera |

## 🎮 Controls

| Key | Action |
|---|---|
| `W / ↑` | Accelerate |
| `S / ↓` | Reverse |
| `A / ←` | Turn Left |
| `D / →` | Turn Right |
| `Space` | Brake |
| `E` | Interact with zone |
| `Mouse` | Rotate camera (click canvas first) |

## 🛠 Tech Stack

- **React + Vite + TypeScript**
- **Three.js** — 3D Rendering
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Useful helpers (KeyboardControls, Text, etc.)
- **@react-three/rapier** — Physics engine (Rapier WASM)
- **@react-three/postprocessing** — Bloom + ChromaticAberration
- **Tailwind CSS v4** — UI overlay
- **GSAP** — UI animations (loading screen, modals)
- **Zustand** — Global state (game state, achievements, music)

## 📁 Folder Structure

```
src/
├── assets/              # (place audio / textures here)
├── components/
│   ├── effects/
│   │   ├── Particles.tsx      # Ambient floating particles
│   │   └── PostProcessing.tsx # Bloom + ChromaticAberration
│   ├── player/
│   │   └── Player.tsx         # Vehicle rigid-body + camera + controls
│   ├── ui/
│   │   ├── AchievementToast.tsx
│   │   ├── HUD.tsx
│   │   ├── Instructions.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── SectionModal.tsx
│   ├── world/
│   │   └── WorldEnvironment.tsx  # All 3D world objects
│   └── Experience.tsx            # Scene root (Canvas children)
├── store/
│   └── useGameStore.ts    # Zustand store
├── App.tsx                # Root (Canvas + UI overlay)
└── main.tsx
```

## 🚀 Getting Started

```bash
# 1. Clone / enter the project
cd "c:/Users/HP/VirtualBox VMs/hacker/new portfolio"

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

## 🌐 Deploying to Vercel

```bash
# 1. Build
npm run build

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel

# Follow prompts. Point root to dist/ and set framework to Vite.
```

Or simply drag the `dist/` folder to **Netlify Drop** at https://app.netlify.com/drop.

## 🌐 Deploying to Netlify

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder into the browser window.
4. Done – your site is live!

Alternatively, add a `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🥚 Easter Eggs

There are 3 glowing golden orbs hidden around the map – drive into them to collect them all!
