import { useEffect, useState, useRef } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { toast } from "sonner";

export function useReservationTimer() {
  const reservationExpiry = useBookingStore((s) => s.reservationExpiry);
  const isCheckingOut = useBookingStore((s) => s.isCheckingOut);
  const clearCart = useBookingStore((s) => s.clearCart);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!reservationExpiry) {
      setTimeLeft(null);
      warnedRef.current = false;
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, reservationExpiry - Date.now());
      setTimeLeft(remaining);

      if (remaining <= 60_000 && remaining > 0 && !warnedRef.current) {
        warnedRef.current = true;
        toast.warning("Less than 1 minute left!", {
          description: "Complete your booking before time runs out.",
          duration: 5000,
        });
      }

      if (remaining <= 0 && !isCheckingOut) {
        clearCart();
        toast.info("Reservation expired", {
          description: "Your seats have been released back to the pool.",
          duration: 5000,
        });
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservationExpiry, isCheckingOut, clearCart]);

  return timeLeft;
}
