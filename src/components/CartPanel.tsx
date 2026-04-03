import { useBookingStore } from "../store/useBookingStore";
import { useReservationTimer } from "../hooks/useReservationTimer";
import { CountdownTimer } from "./CountdownTimer";
import { TIER_COLOR_MAP } from "../constants";
import { toast } from "sonner";

export function CartPanel() {
  const seats = useBookingStore((s) => s.seats);
  const selectedSeatIds = useBookingStore((s) => s.selectedSeatIds);
  const isCheckingOut = useBookingStore((s) => s.isCheckingOut);
  const deselectSeat = useBookingStore((s) => s.deselectSeat);
  const clearCart = useBookingStore((s) => s.clearCart);
  const checkout = useBookingStore((s) => s.checkout);
  const timeLeft = useReservationTimer();

  const selectedSeats = selectedSeatIds
    .map((id) => seats.get(id))
    .filter(Boolean);

  const total = selectedSeats.reduce(
    (sum, seat) => sum + (seat?.price ?? 0),
    0,
  );

  const handleCheckout = async () => {
    const success = await checkout();
    if (success) {
      toast.success("Booking confirmed!", {
        description: "Your tickets have been reserved successfully.",
        duration: 5000,
      });
    } else {
      toast.error("Booking failed!", {
        description:
          "Server error occurred. Your seats are still held — please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-400"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Your Cart
          {selectedSeats.length > 0 && (
            <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}
            </span>
          )}
        </h2>
      </div>

      <CountdownTimer timeLeft={timeLeft} />

      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {selectedSeats.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-slate-500"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No seats selected</p>
            <p className="text-xs text-slate-600 mt-1">
              Click on available seats to add them
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedSeats.map((seat) => {
              if (!seat) return null;
              const colors = TIER_COLOR_MAP[seat.tier];
              return (
                <div
                  key={seat.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 animate-fade-in-up"
                >
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}/30`}
                  >
                    {seat.row}
                    {seat.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">
                      Row {seat.row}, Seat {seat.number}
                    </p>
                    <p className={`text-xs ${colors.text}`}>
                      {seat.tier.toUpperCase()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-200 tabular-nums">
                    ₹{seat.price}
                  </span>
                  <button
                    onClick={() => deselectSeat(seat.id)}
                    className="p-1 rounded hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-300"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedSeats.length > 0 && (
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total</span>
            <span className="text-xl font-bold text-white tabular-nums">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCheckingOut ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>Checkout · ₹{total.toLocaleString("en-IN")}</>
            )}
          </button>

          <button
            onClick={clearCart}
            disabled={isCheckingOut}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40"
          >
            Clear all seats
          </button>
        </div>
      )}
    </div>
  );
}
