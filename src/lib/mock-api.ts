import { API_DELAY_MS, API_FAILURE_RATE } from "../constants";

export async function bookSeats(
  _seatIds: string[],
): Promise<{ success: boolean; bookingId: string }> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

  if (Math.random() < API_FAILURE_RATE) {
    throw new Error("Booking failed due to a server error. Please try again.");
  }

  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
  return { success: true, bookingId };
}
