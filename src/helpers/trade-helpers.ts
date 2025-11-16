
  export const calculatePips = (entry: number, exit: number, pair: string): number => {
    const diff = (exit - entry) * 10000;
    return Math.round(diff);
  };
