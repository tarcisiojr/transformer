const getValue = (path, value) => {
  const _getValue = ([prop, ...rest], currValue, prevNav) => {
    if (prop === '$parent') {
      const newPath = prevNav.slice(0, prevNav.length-1).concat(rest);

      return _getValue(newPath, value, []);
    }

    if (currValue === undefined || currValue === null || currValue[prop] == undefined || currValue[prop] === null) {
      return null;
    }

    if (rest.length === 0) {
      return currValue[prop];
    }

    return _getValue(rest, currValue[prop], [...prevNav, prop]);
  };

  return _getValue(path.split('.'), value, []);
};

const transformArray = ([prop, elemSchema]) => (data) => {
  const arrValue = getValue(prop, data);

  return arrValue.map(ele => transform(elemSchema)(Object.assign({}, data, {[prop]: ele})));
};

const transform = (schema) => (data) => {
  if (Array.isArray(data)) {
    return data.reduce((prev, curr) => prev.concat(transform(schema)(curr)), []);
  }

  if (typeof schema === 'string') {
    return getValue(schema, data);
  }

  if (Array.isArray(schema)) {
    return transformArray(schema)(data);
  }

  return Object.keys(schema).reduce((prev, key) => {
    prev[key] = transform(schema[key])(data);

    return prev;
  }, {});
};

if (module !== undefined && module.exports !== undefined) {
  module.exports = { getValue, transform };
} else {
  window._transform = { getValue, transform };
}