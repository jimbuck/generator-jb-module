import test from 'ava';
import calc from './';

test('add', t => {
  t.is(calc.add(1, 1), 2);
});

test('subtract', t => {
  t.is(calc.subtract(5, 3), 2);
});