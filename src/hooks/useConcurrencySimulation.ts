import { useEffect, useRef } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "sonner";
import { CONCURRENCY_INTERVAL_MS } from "../constants";

export function useConcurrencySimulation() {
  const isCheckingOut = useBookingStore((s) => s.isCheckingOut);
  const isCheckingOutRef = useRef(isCheckingOut);

  useEffect(() => {
    isCheckingOutRef.current = isCheckingOut;
  }, [isCheckingOut]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCheckingOutRef.current) return;

      const { seats, markUnavailable } = useBookingStore.getState();
      const available: string[] = [];

      seats.forEach((seat) => {
        if (seat.status === "available") {
          available.push(seat.id);
        }
      });

      if (available.length === 0) return;

      const count = Math.random() > 0.5 ? 2 : 1;
      const shuffled = available.sort(() => Math.random() - 0.5);
      const toTake = shuffled.slice(0, Math.min(count, shuffled.length));

      const conflicted = markUnavailable(toTake);

      for (const seatId of conflicted) {
        toast.error(`Seat ${seatId} was just taken by another user!`, {
          description: "It has been removed from your cart.",
          duration: 4000,
        });
      }
    }, CONCURRENCY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
}
