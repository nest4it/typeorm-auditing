import { BaseEntity, getMetadataArgsStorage } from 'typeorm';
import type { TableMetadataArgs } from 'typeorm/metadata-args/TableMetadataArgs';

import { AuditSubscriber } from '../subscribers/audit.subscriber';
import type { AuditSubscriberOptions } from '../types';
import { MetadataUtils } from 'typeorm/metadata-builder/MetadataUtils';

export const addToMigrations = (auditOptions: AuditSubscriberOptions) => {
  let historyEntityOpts = AuditSubscriber.auditMap.get(auditOptions.target);

  if (!historyEntityOpts) {
    const tableMetadata: TableMetadataArgs = {
      ...auditOptions.opts,
      target: auditOptions.target,
      name: auditOptions.opts.tableName,
      type: "regular",
    };

    getMetadataArgsStorage().tables.push(tableMetadata);
  }
}

export const isEntityInstanceOfBaseEntity = (entity: Function) => 
  MetadataUtils.getInheritanceTree(entity).includes(BaseEntity);