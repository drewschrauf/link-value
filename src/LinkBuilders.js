import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import set from 'lodash/fp/set';
import extend from 'lodash/fp/extend';

// automatically unbox synthetic events to raw values
function unboxValue(e) {
  return getOr(e, 'target.value', e);
}

// automatically unbox synthetic checked events to raw values
function unboxChecked(e) {
  return getOr(e, 'target.checked', e);
}

// replace the value with the new value
export function makeLink(value, onChange, ...path) {
  if (!path.length) {
    return {
      value,
      onChange: newVal => onChange(unboxValue(newVal)),
    };
  }
  return {
    value: get(path, value),
    onChange: newVal => onChange(set(path, unboxValue(newVal), value)),
  };
}

// merge the new value into the existing value
export function makeMergeLink(value, onChange, ...path) {
  if (!path.length) {
    return {
      value,
      onChange: newVal => onChange(extend(value, unboxValue(newVal))),
    };
  }

  return {
    value: get(path, value),
    onChange: (newVal) => onChange(
      set(path, extend(get(path, value), unboxValue(newVal)), value)
    ),
  };
}

export function makeCheckedLink(value, onChange, ...path) {
  const link = makeLink(value, onChange, ...path);
  return {
    checked: link.value,
    onChange: newVal => link.onChange(unboxChecked(newVal)),
  };
}
