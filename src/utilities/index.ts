export * from './env';
export * from './constants';
export * from './ramdaExtension';

export function randomDigit(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getLimit(page: string, size: string) {
  return { from: (Number(page) - 1) * Number(size), size };
}

export function convertType(value: string) {
  const maps: { [index: string]: any } = { NaN, null: null, undefined, Infinity, '-Infinity': -Infinity };
  return value in maps ? maps[value] : value;
}
