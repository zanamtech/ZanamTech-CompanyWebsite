/** Two-digit display number: 1 -> "01" (catalog numbers, phases, steps, table-of-contents entries). */
export const pad2 = (n: number) => String(n).padStart(2, '0');
