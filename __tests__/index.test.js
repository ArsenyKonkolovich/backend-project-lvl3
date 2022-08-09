/* eslint-disable no-undef */
import multiply from '../src/index.js';

test('Multiply', () => {
  const actual = multiply(2, 2);
  expect(actual).toBe(4);
});
