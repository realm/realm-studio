export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve();
    }, ms);
  });
};
