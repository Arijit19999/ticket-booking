import { memo, useCallback } from "react";
import type { Seat } from "../lib/types";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "sonner";

interface SeatCellProps {
  seat: Seat;
}

const tierStyles = {
  vip: {
    available:
      "bg-amber-500/30 border-amber-500/60 hover:bg-amber-500/50 hover:border-amber-400 hover:scale-110",
    selected:
      "bg-indigo-500 border-indigo-400 animate-pulse-ring hover:bg-indigo-400 hover:scale-110",
    unavailable:
      "bg-slate-700/40 border-slate-600/30 cursor-not-allowed opacity-40",
  },
  premium: {
    available:
      "bg-blue-500/30 border-blue-500/60 hover:bg-blue-500/50 hover:border-blue-400 hover:scale-110",
    selected:
      "bg-indigo-500 border-indigo-400 animate-pulse-ring hover:bg-indigo-400 hover:scale-110",
    unavailable:
      "bg-slate-700/40 border-slate-600/30 cursor-not-allowed opacity-40",
  },
  general: {
    available:
      "bg-emerald-500/30 border-emerald-500/60 hover:bg-emerald-500/50 hover:border-emerald-400 hover:scale-110",
    selected:
      "bg-indigo-500 border-indigo-400 animate-pulse-ring hover:bg-indigo-400 hover:scale-110",
    unavailable:
      "bg-slate-700/40 border-slate-600/30 cursor-not-allowed opacity-40",
  },
};

export const SeatCell = memo(function SeatCell({ seat }: SeatCellProps) {
  const selectSeat = useBookingStore((s) => s.selectSeat);
  const deselectSeat = useBookingStore((s) => s.deselectSeat);

  const handleClick = useCallback(() => {
    if (seat.status === "unavailable") {
      toast.error(`Seat ${seat.id} is no longer available!`, {
        duration: 2500,
      });
      return;
    }

    if (seat.status === "selected") {
      deselectSeat(seat.id);
      return;
    }

    const success = selectSeat(seat.id);
    if (!success) {
      toast.error(`Seat ${seat.id} was just taken!`, {
        description: "Someone else grabbed it before you.",
        duration: 3000,
      });
    }
  }, [seat.id, seat.status, selectSeat, deselectSeat]);

  const style = tierStyles[seat.tier][seat.status];

  return (
    <button
      onClick={handleClick}
      disabled={seat.status === "unavailable"}
      title={`Row ${seat.row}, Seat ${seat.number} · ${seat.tier.toUpperCase()} · ₹${seat.price}`}
      className={`
        relative w-7 h-7 sm:w-8 sm:h-8 rounded-md border transition-all duration-200
        flex items-center justify-center text-[9px] sm:text-[10px] font-medium
        ${style}
        ${seat.status !== "unavailable" ? "cursor-pointer" : ""}
      `}
    >
      {seat.status === "unavailable" ? (
        <span className="text-slate-500">×</span>
      ) : (
        <span
          className={
            seat.status === "selected"
              ? "text-white font-semibold"
              : "text-slate-300"
          }
        >
          {seat.number}
        </span>
      )}
    </button>
  );
});
