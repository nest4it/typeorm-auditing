import type { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
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
  primaryIdType: PrimaryGeneratedColumnType | Parameters<typeof PrimaryGeneratedColumn>[0];
  tableName: string;
  jsonColumnType: string;
  primaryIdColumn: string;
}

export interface AuditSubscriberOptions {
  opts: AuditOptions & { isEntitySpecific: boolean };
  historyTarget: Function;
  target: Function;
}

export type ClassType = { new(): any };
