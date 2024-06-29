const areConsecutiveDays = (
  date1: Date | undefined | null,
  date2: Date | undefined | null
): boolean => {
  if (!date1 || !date2) return false;
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

export { areConsecutiveDays };
