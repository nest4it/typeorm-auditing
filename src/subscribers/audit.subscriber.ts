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
import { AuditAction, type AuditSubscriberOptions } from '../types';
import { createHistoryInstance, isFunction } from '../utils';
import { GetModifiedByUserError } from '../errors';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private async getUserId(
    auditOptions: AuditSubscriberOptions,
    connection: DataSource,
    newEntity: any,
  ) {
    try {
      return await auditOptions.opts.getModifiedBy?.(connection, newEntity);
    } catch (error) {
      throw new GetModifiedByUserError(error);
    }
  }

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

    // newEntity is undefined when the entity is removed
    if (!newEntity) {
      return;
    }

    const auditOpts = getMetaData(entityType);

    if (!auditOpts?.target || typeof auditOpts?.target !== 'function') {
      return;
    }

    const userId = await this.getUserId(auditOpts, connection, newEntity);

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
      event.databaseEntity ?? event.entity,
      event.connection,
      AuditAction.Delete,
    );
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    return this.afterRemove(event);
  }

  async afterRecover(event: any) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.entity,
      event.connection,
      AuditAction.Recover,
    );
  }
}
