export const getDate = item => {
  const displayDate = item.updatedAt ? item.updatedAt : item.createdAt;
  return new Date(displayDate);
};

// sort reviews by date, in decreasing order
export const sortByDate = (a, b) => (
  getDate(a) > getDate(b) ? -1 : 1
);
