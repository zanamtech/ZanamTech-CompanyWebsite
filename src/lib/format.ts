/** Two-digit display number: 1 -> "01" (catalogue numbers, phases, steps, table-of-contents entries). */
export const pad2 = (n: number) => String(n).padStart(2, '0');
