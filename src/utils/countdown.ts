import { wait } from './wait';

export const countdown = async (
  interval: number,
  start: number,
  onCount: (n: number) => void,
): Promise<void> => {
  for (let n = start; n >= 1; n--) {
    onCount(n);
    await wait(interval);
  }
};
