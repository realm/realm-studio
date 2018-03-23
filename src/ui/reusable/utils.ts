export const getRange = (number1: number, number2: number): number[] => {
  const start = Math.min(number1, number2);
  const end = Math.max(number1, number2);
  return Array.from({ length: 1 + end - start }, (v, k) => k + start);
};
