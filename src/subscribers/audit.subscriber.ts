import {
  type EntitySubscriberInterface,
  EventSubscriber,
  type InsertEvent,
  type RemoveEvent,
  type SoftRemoveEvent,
  type UpdateEvent,
  type EntityManager,
  type DataSource,
  type EntityMetadata,
} from 'typeorm';
import { getMetaData } from '../utils/reflect';
import { AuditAction } from '../types';
import { createHistoryInstance, isFunction } from '../utils';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private async saveHistory(
    entityType: EntityMetadata['target'],
    manager: EntityManager,
    newEntity: any,
    connection: DataSource,
    action: AuditAction,
  ) {
    if (!isFunction(entityType)) {
      return;
    }

    const auditOpts = getMetaData(entityType);

    if (!auditOpts?.target || typeof auditOpts?.target !== 'function') {
      return;
    }

    const userId = await auditOpts.opts.getModifiedBy?.(connection, newEntity);

    await manager.save(
      auditOpts.opts.tableName,
      createHistoryInstance(auditOpts, newEntity, action, userId),
    );
  }

  async afterInsert(event: InsertEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.entity,
      event.connection,
      AuditAction.Create,
    );
  }

  async afterUpdate(event: UpdateEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.entity,
      event.connection,
      AuditAction.Update,
    );
  }

  async afterRemove(event: RemoveEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.databaseEntity,
      event.connection,
      AuditAction.Delete,
    );
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    return this.afterRemove(event);
  }
}
