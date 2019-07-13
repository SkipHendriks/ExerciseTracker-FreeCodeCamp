const isEmptyObject = (obj) => {
  let isEmpty;
  // typeof null == 'object'; true
  if (obj && typeof obj == 'object') {
    isEmpty = obj.constructor === Object && Object.entries(obj).length === 0;
  } else {
    isEmpty = false;
  }
  return isEmpty;
};

export {isEmptyObject};