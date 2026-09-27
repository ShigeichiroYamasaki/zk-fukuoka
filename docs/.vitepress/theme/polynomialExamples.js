// Weighted Lagrange bases at x = 0, 1, 2 for values 1, 2, 5.
export const basis = [x => (x - 1) * (x - 2) / 2, x => -2 * x * (x - 2), x => 5 * x * (x - 1) / 2];
export const quadratic = x => x * x + 1;
export const difference = x => (x - 1) * (x - 3);
export const gridZeros = (x, y) => differenceGrid(x, y) === 0;
export const differenceGrid = (x, y) => (((x - 1) * (y - 3)) % 7 + 7) % 7;
