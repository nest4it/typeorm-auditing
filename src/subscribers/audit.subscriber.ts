import {
  type EntitySubscriberInterface,
  EventSubscriber,
  type InsertEvent,
  type RemoveEvent,
  type SoftRemoveEvent,
  type UpdateEvent,
  type EntityManager,
} from 'typeorm';
import { getMetaData } from '../utils/reflect';
import { AuditAction } from '../types';
import { createHistoryInstance, isFunction } from '../utils';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private async saveHistory(
    entityType: Function | string,
    manager: EntityManager,
    newEntity: any,
    action: AuditAction,
  ) {
    if (!isFunction(entityType)) {
      return;
    }

    const auditOpts = getMetaData(entityType);

    if (!auditOpts?.target || typeof auditOpts?.target !== 'function') {
      return;
    }

    await manager.save(
      auditOpts.opts.tableName,
      createHistoryInstance(auditOpts, newEntity, action),
    );
  }

  async afterInsert(event: InsertEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.entity,
      AuditAction.Create,
    );
  }

  async afterUpdate(event: UpdateEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.entity,
      AuditAction.Update,
    );
  }

  async afterRemove(event: RemoveEvent<any>) {
    return this.saveHistory(
      event.metadata.target,
      event.manager,
      event.databaseEntity,
      AuditAction.Delete,
    );
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    return this.afterRemove(event);
  }
}
