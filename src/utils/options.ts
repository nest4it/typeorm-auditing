import type { AuditOptions } from '../types';

export const createOpts = (
  options: Partial<AuditOptions>,
  target: any,
): AuditOptions => ({
  ...options,
  primaryIdType: options.primaryIdType ?? ('int' as const),
  jsonColumnType: options.jsonColumnType ?? 'jsonb',
  tableName: options.tableName?.toLowerCase() ?? `${target.name}_audit`.toLowerCase(),
  saveEntityType: options.saveEntityType ?? false,
  primaryIdColumn: options.primaryIdColumn ?? 'id',
  modifiedByColumnType: 'varchar',
});

export const createEntityOpts = (target: any, options = {}) => {
  const opts = createOpts(options, target);

  return {
    target,
    opts,
  };
};
