export const timeout = <Result>(
  ms: number,
  err: Error,
  wrappedPromise: Promise<Result>,
): Promise<Result> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(err);
    }, ms);
    // Resolve or reject this promise from the wrappedPromise
    wrappedPromise.then(
      result => {
        clearTimeout(timer);
        resolve(result);
      },
      wrappedError => {
        clearTimeout(timer);
        reject(wrappedError);
      },
    );
  });
};
