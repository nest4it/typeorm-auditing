import type { AuditOptions } from '../types';
import { createHistoryEntity } from '../utils/entity';

export const createOpts = (options: Partial<AuditOptions>, target: Function): AuditOptions & { isEntitySpecific: boolean } => ({
  primaryIdType: options.primaryIdType ?? ('bigint' as const),
  jsonColumnType: options.jsonColumnType ?? 'jsonb',
  tableName: options.tableName ?? `${target.name}_audit`,
  isEntitySpecific: options.tableName === undefined,
  primaryIdColumn: options.primaryIdColumn ?? 'id',
})

export const createEntityOpts = (target: Function, options = {}) => {
  const opts = createOpts(options, target);

  return {
    target,
    historyTarget: createHistoryEntity(opts),
    opts,
  }
}
