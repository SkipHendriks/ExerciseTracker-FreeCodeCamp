export const checkDateFormat = (date) => {
  return /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(date);
};