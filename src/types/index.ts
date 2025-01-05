import type { DataSource } from 'typeorm';
import type { EntityOptions } from 'typeorm/decorator/options/EntityOptions';
import type {
  ColumnType,
  PrimaryGeneratedColumnType,
} from 'typeorm/driver/types/ColumnTypes';

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
  getModifiedBy?: (
    connection: DataSource,
    newEntity: any,
  ) => Promise<number | string | null | undefined>;
  modifiedByColumnType?: ColumnType;
}

export interface AuditSubscriberOptions {
  opts: AuditOptions & { isEntitySpecific: boolean };
  target: any;
}
