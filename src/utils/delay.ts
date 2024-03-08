export const asyncDelay = async (delayMs: number) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, delayMs)
  );
};
