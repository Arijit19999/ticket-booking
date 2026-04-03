import { useBookingStore } from "../store/useBookingStore";
import { useEffect, useMemo, useState } from "react";

export function BookingConfirmed() {
  const bookingConfirmed = useBookingStore((s) => s.bookingConfirmed);
  const resetBooking = useBookingStore((s) => s.resetBooking);
  const [show, setShow] = useState(false);

  const bookingId = useMemo(
    () => `BK-${Date.now().toString(36).toUpperCase().slice(0, 8)}`,
    [],
  );

  useEffect(() => {
    if (bookingConfirmed) {
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
    }
  }, [bookingConfirmed]);

  if (!bookingConfirmed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-5 transition-all duration-500 ${
        show ? "bg-black/80 backdrop-blur-xl" : "bg-black/0 backdrop-blur-0"
      }`}
    >
      <div
        className={`relative w-full max-w-[560px] overflow-hidden rounded-[36px] border border-white/[0.06] transition-all duration-500 ${
          show
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-[0.985] opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at top, rgba(99,102,241,0.14), transparent 32%), linear-gradient(180deg, #111527 0%, #090D18 100%)",
          boxShadow:
            "0 24px 100px -28px rgba(79,70,229,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 px-7 sm:px-8 pt-12 sm:pt-14 pb-8 sm:pb-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-7 sm:mb-8">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/25 bg-[#09111E] shadow-[0_0_40px_-12px_rgba(16,185,129,0.45)]">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-emerald-400"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="max-w-[430px] sm:mb-9">
              <h2 className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.03em] text-white leading-none mb-4">
                Booking Confirmed!
              </h2>

              <p className="text-[15px] sm:text-base leading-7 text-slate-400 font-medium">
                Your tickets are reserved. Check your{" "}
                <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-400/30">
                  email
                </span>{" "}
                for details.
              </p>
            </div>

            <div className="w-full max-w-[520px] flex flex-col gap-4 pb-4">
              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] px-6 sm:px-8 pt-4 pb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-violet-500/[0.05]" />
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500 font-extrabold mb-2">
                    Reservation ID
                  </span>
                  <span className="font-mono text-[2rem] sm:text-[2.35rem] leading-none tracking-[0.06em] font-bold text-white">
                    {bookingId}
                  </span>
                </div>
              </div>

              <button
                onClick={resetBooking}
                className="w-full rounded-full bg-indigo-600 px-6 py-4 text-white text-lg font-bold tracking-[-0.01em] shadow-[0_14px_40px_-14px_rgba(79,70,229,0.85)] transition-all duration-200 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0"
              >
                Book Another Experience
              </button>

              <p className="text-center text-sm text-slate-500 font-medium mb-6">
                Thank you for choosing EventSeat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
