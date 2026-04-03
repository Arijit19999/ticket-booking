export type SeatStatus = "available" | "selected" | "unavailable";

export type SeatTier = "vip" | "premium" | "general";

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
}

export interface BookingState {
  seats: Map<string, Seat>;
  selectedSeatIds: string[];
  reservationExpiry: number | null;
  isCheckingOut: boolean;
  bookingConfirmed: boolean;

  selectSeat: (seatId: string) => boolean;
  deselectSeat: (seatId: string) => void;
  markUnavailable: (seatIds: string[]) => string[];
  clearCart: () => void;
  checkout: () => Promise<boolean>;
  resetBooking: () => void;
}

export interface TierConfig {
  tier: SeatTier;
  label: string;
  price: number;
  color: string;
  bgColor: string;
  rows: string[];
  seatsPerRow: number;
}
