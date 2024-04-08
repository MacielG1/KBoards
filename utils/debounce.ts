export function debounce(func: Function, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function debounced(this: any, ...args: any[]) {
    const later = () => {
      clearTimeout(timeoutId);
      func.apply(this, args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}
