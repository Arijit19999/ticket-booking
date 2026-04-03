import type { Seat } from "./types";
import { TIER_CONFIGS } from "../constants";

export function generateSeats(): Map<string, Seat> {
  const seats = new Map<string, Seat>();

  for (const config of TIER_CONFIGS) {
    for (const row of config.rows) {
      for (let num = 1; num <= config.seatsPerRow; num++) {
        const id = `${row}-${num}`;
        seats.set(id, {
          id,
          row,
          number: num,
          tier: config.tier,
          price: config.price,
          status: "available",
        });
      }
    }
  }

  return seats;
}

export function getRowsGroupedByTier(): {
  tier: string;
  label: string;
  rows: string[];
}[] {
  return TIER_CONFIGS.map((config) => ({
    tier: config.tier,
    label: config.label,
    rows: config.rows,
  }));
}

export function getSeatsInRow(seats: Map<string, Seat>, row: string): Seat[] {
  const rowSeats: Seat[] = [];
  seats.forEach((seat) => {
    if (seat.row === row) {
      rowSeats.push(seat);
    }
  });
  return rowSeats.sort((a, b) => a.number - b.number);
}
