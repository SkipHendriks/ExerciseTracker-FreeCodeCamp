// date to string json replacer for express
function dateReplacer(key, value) {
  let newValue = value;
  if (this[key] instanceof Date) {
    newValue = this[key].toDateString();
  }
  return newValue;
}

export default dateReplacer;
