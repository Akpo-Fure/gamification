const areConsecutiveDays = (
  date1: Date | undefined | null,
  date2: Date | undefined | null
): boolean => {
  if (!date1 || !date2) return false;
  console.log({ day1: date1.getTime(), day2: date2.getTime() });

  const diff = Math.abs(date1.getTime() - date2.getTime());

  console.log({ diff });

  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  console.log({ diffDays });

  return diffDays === 1;
};

export { areConsecutiveDays };
