const areConsecutiveDays = (
  date1: Date | undefined | null,
  date2: Date | undefined | null
): boolean => {
  if (!date1 || !date2) return false;

  const copy1 = new Date(date1.getTime());
  const copy2 = new Date(date2.getTime());

  copy1.setHours(0, 0, 0, 0);
  copy2.setHours(0, 0, 0, 0);

  const diff = copy2.getTime() - copy1.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  return diffDays === 1;
};

export { areConsecutiveDays };
