import { getMetadataArgsStorage } from 'typeorm';
import type { TableMetadataArgs } from 'typeorm/metadata-args/TableMetadataArgs';

import { AuditSubscriber } from '../subscribers/audit.subscriber';
import { AuditAction, type AuditSubscriberOptions } from '../types';
import { PrimaryGeneratedColumnType } from 'typeorm/driver/types/ColumnTypes';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

export const createEntityMetadata = (auditOptions: AuditSubscriberOptions): ColumnMetadataArgs[] => [
  { target: auditOptions.opts.tableName, propertyName: 'id', mode: 'regular', options: { type: auditOptions.opts.primaryIdType as PrimaryGeneratedColumnType } },
  { target: auditOptions.opts.tableName, propertyName: 'version', mode: 'regular', options: { type: 'int' } },
  { target: auditOptions.opts.tableName, propertyName: 'entityId', mode: 'regular', options: { type: 'varchar' } },
  { target: auditOptions.opts.tableName, propertyName: 'data', mode: 'regular', options: { type: auditOptions.opts.jsonColumnType } },
  { target: auditOptions.opts.tableName, propertyName: 'action', mode: 'regular', options: { type: 'enum', enum: AuditAction } },
  { target: auditOptions.opts.tableName, propertyName: 'modifiedAt', mode: 'regular', options: { type: 'timestamp' } },
]

export const addToMigrations = (auditOptions: AuditSubscriberOptions) => {
  let historyEntityOpts = AuditSubscriber.auditMap.get(auditOptions.target);

  if (!historyEntityOpts) {
    const tableMetadata: TableMetadataArgs = {
      ...auditOptions.opts,
      target: auditOptions.historyTarget,
      name: auditOptions.opts.tableName,
      type: "regular",
    };

    getMetadataArgsStorage().tables.push(tableMetadata);
    createEntityMetadata(auditOptions).forEach((columnMetadata) => 
      getMetadataArgsStorage().columns.push(columnMetadata)
    );
  }
}
