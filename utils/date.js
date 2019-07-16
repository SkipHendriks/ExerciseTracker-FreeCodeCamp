// only checks format, not posibility. 1991-02-31 will be correct

const checkDateFormat = date => /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(date);

const equalDate = (dateBefore, dateAfter) => dateBefore.getTime() === dateAfter.getTime();

export { checkDateFormat, equalDate };
