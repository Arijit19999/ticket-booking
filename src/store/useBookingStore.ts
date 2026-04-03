import { create } from "zustand";
import type { BookingState } from "../lib/types";
import { generateSeats } from "../lib/seat-generator";
import { bookSeats } from "../lib/mock-api";
import { RESERVATION_DURATION_MS } from "../constants";

export const useBookingStore = create<BookingState>((set, get) => ({
  seats: generateSeats(),
  selectedSeatIds: [],
  reservationExpiry: null,
  isCheckingOut: false,
  bookingConfirmed: false,

  selectSeat: (seatId: string): boolean => {
    const { seats, selectedSeatIds } = get();
    const seat = seats.get(seatId);

    if (!seat || seat.status !== "available") {
      return false;
    }

    const updatedSeats = new Map(seats);
    updatedSeats.set(seatId, { ...seat, status: "selected" });

    const newSelectedIds = [...selectedSeatIds, seatId];
    const expiry = Date.now() + RESERVATION_DURATION_MS;

    set({
      seats: updatedSeats,
      selectedSeatIds: newSelectedIds,
      reservationExpiry: expiry,
    });

    return true;
  },

  deselectSeat: (seatId: string) => {
    const { seats, selectedSeatIds } = get();
    const seat = seats.get(seatId);

    if (!seat) return;

    const updatedSeats = new Map(seats);
    updatedSeats.set(seatId, { ...seat, status: "available" });

    const newSelectedIds = selectedSeatIds.filter((id) => id !== seatId);

    set({
      seats: updatedSeats,
      selectedSeatIds: newSelectedIds,
      reservationExpiry:
        newSelectedIds.length > 0 ? get().reservationExpiry : null,
    });
  },

  markUnavailable: (seatIds: string[]): string[] => {
    const { seats, selectedSeatIds } = get();
    const updatedSeats = new Map(seats);
    const conflictedIds: string[] = [];

    for (const seatId of seatIds) {
      const seat = updatedSeats.get(seatId);
      if (!seat) continue;

      if (seat.status === "unavailable") continue;

      if (selectedSeatIds.includes(seatId)) {
        conflictedIds.push(seatId);
      }

      updatedSeats.set(seatId, { ...seat, status: "unavailable" });
    }

    const newSelectedIds = selectedSeatIds.filter(
      (id) => !conflictedIds.includes(id),
    );

    set({
      seats: updatedSeats,
      selectedSeatIds: newSelectedIds,
      reservationExpiry:
        newSelectedIds.length > 0 ? get().reservationExpiry : null,
    });

    return conflictedIds;
  },

  clearCart: () => {
    const { seats, selectedSeatIds } = get();
    const updatedSeats = new Map(seats);

    for (const seatId of selectedSeatIds) {
      const seat = updatedSeats.get(seatId);
      if (seat) {
        updatedSeats.set(seatId, { ...seat, status: "available" });
      }
    }

    set({
      seats: updatedSeats,
      selectedSeatIds: [],
      reservationExpiry: null,
    });
  },

  checkout: async (): Promise<boolean> => {
    const { selectedSeatIds } = get();
    if (selectedSeatIds.length === 0) return false;

    set({ isCheckingOut: true });

    try {
      await bookSeats(selectedSeatIds);

      const { seats } = get();
      const updatedSeats = new Map(seats);

      for (const seatId of selectedSeatIds) {
        const seat = updatedSeats.get(seatId);
        if (seat) {
          updatedSeats.set(seatId, { ...seat, status: "unavailable" });
        }
      }

      set({
        seats: updatedSeats,
        selectedSeatIds: [],
        reservationExpiry: null,
        isCheckingOut: false,
        bookingConfirmed: true,
      });

      return true;
    } catch {
      set({ isCheckingOut: false });
      return false;
    }
  },

  resetBooking: () => {
    set({
      seats: generateSeats(),
      selectedSeatIds: [],
      reservationExpiry: null,
      isCheckingOut: false,
      bookingConfirmed: false,
    });
  },
}));
