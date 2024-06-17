import { compose, curry, intersection, isEmpty, not } from 'ramda';

/**
 * Returns `true` if any of the items from first array are in the second array.
 *
 * @func
 * @category List
 *
 * @param {Array} List
 * @param {Array} List
 * @return {Boolean} If any of the items from first array are in the second array.
 *
 * @example
 *
 *    R_.containsAny(['a', 'e'], ['a', 'b', 'c']) // true
 *    R_.containsAny(['e', 'f'], ['a', 'b', 'c']) // false
 *
 * @sig [a] -> [a] -> Boolean
 *
 */
export const containsAny = curry(compose(not, isEmpty, intersection));

/**
 * See if an number (`val`) is within an array of two numbers ('list').
 *
 * @func
 * @category Type
 * @param {Number} a Starting value
 * @param {Number} b Ending value
 * @param {Number} val The value to test
 * @return {Boolean}
 * @example
 *
 *      R_.between(1, 5, 4); //=> true
 *      R_.between(3, 8, 2.1); //=> false
 *      R_.between(100.1, 102, 100.1); //=> true
 */
export const between = curry((min, max, val) => {
  return val >= min && val <= max;
});
