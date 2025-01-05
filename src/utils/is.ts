export const isStringVersionType = (
  value: any,
): value is 'uuid' | 'rowid' | 'identity' | 'increment' =>
  ['increment', 'uuid', 'rowid', 'identity'].includes(value);

export const isFunction = (value: any) => typeof value === 'function';
