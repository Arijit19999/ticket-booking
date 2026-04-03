# 🎫 EventSeat — High-Concurrency Event Ticket Booking

A real-time seat selection interface for live event ticket booking, built to handle simulated concurrency, temporary seat holds, and conflict resolution — all with a polished, responsive UI.

> **Assignment:** Option 3 — High-Concurrency Event Ticket Booking  
> **Stack:** React · TypeScript · Zustand · Tailwind CSS · Vite

---

## 🔗 Links

| Resource        | URL                                                                                     |
| --------------- | --------------------------------------------------------------------------------------- |
| **Live Demo**   | [ticket-booking.vercel.app](https://ticket-booking-gray-zeta.vercel.app)                |
| **Source Code** | [github.com/username/ticket-booking](https://github.com/Arijit19999/ticket-booking.git) |

---

## ✨ Features

### Venue Layout & Seat Map

- **121 seats** across 10 rows, organized into 3 pricing tiers
- Color-coded visual grid — VIP (gold), Premium (blue), General (green)
- Row labels, stage indicator, and real-time availability counters per tier
- Hover tooltips showing seat details (row, number, tier, price)

### Concurrency Simulation

- Background interval fires **every 5 seconds**, randomly marking 1–2 available seats as unavailable
- Simulates real-world behavior of other users purchasing tickets simultaneously
- Pauses automatically during checkout to prevent mid-transaction conflicts

### Reservation Timer

- **5-minute countdown** begins when the first seat is selected
- Circular SVG progress ring with color transitions:
  - 🟣 Indigo → normal
  - 🟡 Amber → under 2 minutes
  - 🔴 Red + pulse animation → under 1 minute
- Auto-releases all held seats back to the pool when timer expires

### Conflict Resolution

Three conflict scenarios handled:

| Scenario                             | Behavior                                                             |
| ------------------------------------ | -------------------------------------------------------------------- |
| Click on an already-taken seat       | Rejected immediately with toast notification                         |
| Interval takes a seat you selected   | Removed from cart + error toast                                      |
| Click at exact moment interval fires | JS single-threaded guarantee — guard checks status at execution time |

### Checkout Flow

- Mock API with **1.5 second** simulated network delay
- **20% random failure rate** to simulate server errors
- On success → confirmation modal with booking ID
- On failure → error toast, seats remain selected for retry
- Loading spinner on button during processing

### UI/UX Polish

- Dark theme with glassmorphism-inspired surfaces
- Smooth CSS transitions on all seat state changes
- Animated cart items (fade-in-up on add)
- Responsive layout — two-column on desktop, stacked on mobile
- Toast notifications for every user-facing event (Sonner)
- Sticky cart sidebar and header

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── SeatMap.tsx            # Full venue grid with tier grouping
│   ├── SeatCell.tsx           # Individual seat (memoized)
│   ├── CartPanel.tsx          # Selected seats, total, checkout
│   ├── CountdownTimer.tsx     # SVG circular progress ring
│   ├── BookingConfirmed.tsx   # Success overlay modal
│   └── LiveIndicator.tsx      # Pulsing "Live" badge
├── store/
│   └── useBookingStore.ts     # Zustand — single source of truth
├── hooks/
│   ├── useConcurrencySimulation.ts  # 5s interval logic
│   └── useReservationTimer.ts       # 5m countdown logic
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── seat-generator.ts      # Venue layout factory
│   └── mock-api.ts            # Simulated API (delay + failures)
├── constants/
│   └── index.ts               # Tier configs, timing, colors
├── App.tsx                    # Root layout
├── main.tsx                   # Entry point + Toaster
└── index.css                  # Tailwind + custom animations
```

---

## 🧠 Key Design Decisions

### Why Zustand over Redux/Context?

Zustand provides a minimal API with built-in selector-based re-rendering. Since this app has **high-frequency state updates** (timer ticking every second, interval every 5 seconds, seat clicks), Zustand's granular subscriptions prevent unnecessary re-renders. Components only re-render when their specific slice of state changes.

### Why `Map<string, Seat>` over an Array?

Seat lookups happen on every click and every interval tick. A `Map` gives **O(1)** access by seat ID, which is critical for conflict resolution — we need to check a seat's current status _at the exact moment_ of interaction, not after iterating through an array.

### How Conflict Resolution Works

JavaScript is single-threaded. The concurrency interval and user clicks both modify the same Zustand store synchronously. When a user clicks a seat:

```
1. selectSeat(seatId) is called
2. It reads seat.status from the Map RIGHT NOW
3. If status !== "available" → return false (conflict!)
4. If status === "available" → proceed with selection
```

This **guard-first pattern** ensures that even if the interval marked the seat unavailable one millisecond before the click handler executed, the click will see the updated status and reject gracefully.

### Why `useRef` for Checkout Flag?

The concurrency interval runs in a `useEffect` closure. To read the latest `isCheckingOut` value without re-creating the interval, we sync it to a ref. This avoids clearing and re-setting the interval on every checkout state change.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/Arijit19999/ticket-booking.git
cd ticket-booking
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

---

## 📦 Tech Stack

| Tool                                          | Purpose                               |
| --------------------------------------------- | ------------------------------------- |
| [Vite](https://vitejs.dev/)                   | Build tool — instant HMR, fast builds |
| [React 18](https://react.dev/)                | UI library with hooks                 |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across the codebase       |
| [Zustand](https://zustand-demo.pmnd.rs/)      | Lightweight state management          |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first styling                 |
| [Sonner](https://sonner.emilkowal.ski/)       | Toast notification system             |
| [Vercel](https://vercel.com/)                 | Deployment platform                   |

---

## 🧪 Testing Scenarios

Use these to manually verify all requirements:

| #   | Test                                          | Expected Result                                     |
| --- | --------------------------------------------- | --------------------------------------------------- |
| 1   | Click an available seat                       | Seat turns indigo, appears in cart, timer starts    |
| 2   | Click a selected seat                         | Seat reverts to tier color, removed from cart       |
| 3   | Wait 5 seconds                                | 1–2 random seats turn gray (concurrency simulation) |
| 4   | Wait for interval to take your selected seat  | Toast: "Seat X was just taken!", removed from cart  |
| 5   | Click a gray/unavailable seat                 | Toast: "Seat X is no longer available!"             |
| 6   | Select seats → wait 5 minutes                 | Timer expires, all seats released, cart cleared     |
| 7   | Select seats → click Checkout → success (80%) | Confirmation modal with booking ID                  |
| 8   | Select seats → click Checkout → failure (20%) | Error toast, seats remain selected for retry        |
| 9   | Resize to mobile                              | Layout stacks vertically, seats remain clickable    |
| 10  | Rapid double-click same seat                  | No duplicate entries in cart                        |

---

## 📱 Responsive Breakpoints

| Viewport        | Layout                                        |
| --------------- | --------------------------------------------- |
| `≥ 1024px` (lg) | Two-column — seat map left, sticky cart right |
| `< 1024px`      | Single column — seat map stacked above cart   |
| `< 640px` (sm)  | Compact seat cells (28px), tighter gaps       |

---

## 🔮 Future Improvements

- [ ] WebSocket integration for real multi-user concurrency
- [ ] Seat category filters (show only VIP, hide sold out)
- [ ] Keyboard navigation (arrow keys to traverse grid, Enter to select)
- [ ] Accessibility audit (ARIA labels, screen reader support)
- [ ] Unit tests with Vitest + React Testing Library
- [ ] Animated seat transitions using Framer Motion
- [ ] Persistent cart state via localStorage

---

## Author

**Arijit Dutta**
[GitHub](https://github.com/Arijit19999)
