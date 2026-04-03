import { useBookingStore } from "../store/useBookingStore";
import { SeatCell } from "./SeatCell";
import { getSeatsInRow, getRowsGroupedByTier } from "../lib/seat-generator";
import { TIER_CONFIGS } from "../constants";

export function SeatMap() {
  const seats = useBookingStore((s) => s.seats);
  const tierGroups = getRowsGroupedByTier();

  const tierAvailability = TIER_CONFIGS.map((config) => {
    let available = 0;
    let total = 0;
    seats.forEach((seat) => {
      if (seat.tier === config.tier) {
        total++;
        if (seat.status === "available") available++;
      }
    });
    return { tier: config.tier, label: config.label, available, total };
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-lg mx-auto mb-2">
        <div
          className="relative h-10 rounded-b-[50%] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.05) 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderTop: "2px solid rgba(99,102,241,0.6)",
          }}
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-300">
            Stage
          </span>
        </div>
        <div
          className="h-8 w-full"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="flex flex-col gap-4 w-full items-center">
        {tierGroups.map((group) => (
          <div
            key={group.tier}
            className="flex flex-col gap-1.5 items-center w-full"
          >
            {group.rows.map((row) => {
              const rowSeats = getSeatsInRow(seats, row);
              return (
                <div key={row} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-5 text-right text-[10px] font-semibold text-slate-500 select-none">
                    {row}
                  </span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {rowSeats.map((seat) => (
                      <SeatCell key={seat.id} seat={seat} />
                    ))}
                  </div>
                  <span className="w-5 text-left text-[10px] font-semibold text-slate-500 select-none">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
        {tierAvailability.map(({ tier, label, available, total }) => {
          const config = TIER_CONFIGS.find((c) => c.tier === tier);
          return (
            <div key={tier} className="flex items-center gap-2 text-xs">
              <div
                className="w-3.5 h-3.5 rounded-sm border"
                style={{
                  backgroundColor: `${config?.color}40`,
                  borderColor: `${config?.color}90`,
                }}
              />
              <span className="text-slate-400">
                {label} · ₹{config?.price} ·{" "}
                <span className="text-slate-300 font-medium">{available}</span>/
                {total}
              </span>
            </div>
          );
        })}

        <div className="flex items-center gap-2 text-xs">
          <div className="w-3.5 h-3.5 rounded-sm bg-indigo-500 border border-indigo-400" />
          <span className="text-slate-400">Selected</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="w-3.5 h-3.5 rounded-sm bg-slate-700/40 border border-slate-600/30 opacity-50" />
          <span className="text-slate-400">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
