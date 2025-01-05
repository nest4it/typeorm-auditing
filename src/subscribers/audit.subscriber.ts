import { AuditAction, type AuditSubscriberOptions } from '../types';
import { createHistoryInstance, isFunction } from '../utils';
import {
    type EntitySubscriberInterface,
    EventSubscriber,
    type InsertEvent,
    type RemoveEvent,
    type SoftRemoveEvent,
    type UpdateEvent,
    type EntityManager,
} from 'typeorm';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
    static auditMap = new Map<Function, AuditSubscriberOptions>();

    static subscribe(opts: AuditSubscriberOptions) {
        AuditSubscriber.auditMap.set(opts.target, opts);
    }

    private async saveHistory(entityType: Function | string, manager: EntityManager, newEntity: any, action: AuditAction) {
        if (!isFunction(entityType)) {
            return;
        }

        const auditOpts = AuditSubscriber.auditMap.get(entityType);
        
        if (!auditOpts?.target || typeof auditOpts?.target !== 'function') {
            return;
        }

        await manager.save(auditOpts.target, createHistoryInstance(auditOpts, newEntity, action));
    }

    async afterInsert(event: InsertEvent<any>) {
        return this.saveHistory(event.metadata.target, event.manager, event.entity, AuditAction.Create);
    }

    async afterUpdate(event: UpdateEvent<any>) {
        return this.saveHistory(event.metadata.target, event.manager, event.entity, AuditAction.Update);
    }

    async afterRemove(event: RemoveEvent<any>) {
        return this.saveHistory(event.metadata.target, event.manager, event.databaseEntity, AuditAction.Delete);
    }

    async afterSoftRemove(event: SoftRemoveEvent<any>) {
        return this.afterRemove(event);
    }
}
