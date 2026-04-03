import { SeatMap } from "./components/SeatMap";
import { CartPanel } from "./components/CartPanel";
import { BookingConfirmed } from "./components/BookingConfirmed";
import { LiveIndicator } from "./components/LiveIndicator";
import { useConcurrencySimulation } from "./hooks/useConcurrencySimulation";

export default function App() {
  useConcurrencySimulation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12l5 5L22 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                EventSeat
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">
                Live Ticket Booking
              </p>
            </div>
          </div>
          <LiveIndicator />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-x-auto">
            <SeatMap />
          </div>

          <div className="lg:sticky lg:top-20 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden min-h-[400px]">
            <CartPanel />
          </div>
        </div>
      </main>

      <BookingConfirmed />
    </div>
  );
}
