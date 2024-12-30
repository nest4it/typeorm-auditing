import type { EntityOptions } from 'typeorm/decorator/options/EntityOptions';
import type { PrimaryGeneratedColumnType } from 'typeorm/driver/types/ColumnTypes';

export enum AuditAction {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}

export interface AuditEntityOptions extends EntityOptions {
  /**
   * The type of *version* column can be specified.
   */
  versionType?: PrimaryGeneratedColumnType;
  historyTableName?: string;
}
