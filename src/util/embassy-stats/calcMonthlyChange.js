export const getMonthlyChange = (stats = []) => {
  if (!stats || stats.length < 2) {
    return {
      changeText: "0%",
      trend: "neutral",
      rate: 0,
    };
  }

  const lastMonth = stats[stats.length - 1];
  const prevMonth = stats[stats.length - 2];

  const rate = lastMonth.changeRate ?? 0;

  return {
    changeText: `${rate > 0 ? "+" : ""}${rate}%`,
    trend: rate > 0 ? "up" : rate < 0 ? "down" : "neutral",
    rate,
  };
}