import type { EntityOptions } from 'typeorm/decorator/options/EntityOptions';
import type { PrimaryGeneratedColumnType } from 'typeorm/driver/types/ColumnTypes';

export enum AuditAction {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}

export interface AuditOptions extends EntityOptions {
  /**
   * The type of *version* column can be specified.
   */
  primaryIdType: PrimaryGeneratedColumnType | 'uuid' | 'rowid' | 'identity' | 'increment';
  tableName: string;
  jsonColumnType: 'jsonb' | 'json' | 'simple-json' | 'text';
  primaryIdColumn: string;
}

export interface AuditSubscriberOptions {
  opts: AuditOptions & { isEntitySpecific: boolean };
  target: Function;
}
