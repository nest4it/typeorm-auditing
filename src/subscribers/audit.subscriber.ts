import { createHistoryEntity } from '@/entity';
import { AuditAction } from '@/types';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    SoftRemoveEvent,
    UpdateEvent,
    EntityManager,
    BaseEntity,
} from 'typeorm';
import { MetadataUtils } from 'typeorm/metadata-builder/MetadataUtils';

type ClassType = { new (): any };

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
    static historyMap = new Map<Function, ReturnType<typeof createHistoryEntity>>();

    static Subscribe(entity: Function, historyEntity: ReturnType<typeof createHistoryEntity>) {
        AuditSubscriber.historyMap.set(entity, historyEntity);
    }

    private async saveHistory(entityType: Function | string, manager: EntityManager, entity: any, action: AuditAction) {
        const target = AuditSubscriber.historyMap.get(entityType as Function);
        
        if (!target || typeof target !== 'function') {
            return;
        }

        // If target(audit entity) is a class that inherits from BaseEntity, instantiate it.
        // Without this process, listeners such as @BeforeInsert do not work.
        if (MetadataUtils.getInheritanceTree(target).includes(BaseEntity)) {
            return manager.save((target as typeof BaseEntity).create({ ...entity, action }));
        } 
        
        const replica = new (target as any as ClassType)();
        Object.assign(replica, { ...entity, action });
        await manager.save(target, replica);
    }

    async afterInsert<T>(event: InsertEvent<T>) {
        return this.saveHistory(event.metadata.target, event.manager, event.entity, AuditAction.Create);
    }

    async afterUpdate<T>(event: UpdateEvent<T>) {
        return this.saveHistory(event.metadata.target, event.manager, event.entity, AuditAction.Update);
    }

    async afterRemove<T>(event: RemoveEvent<T>) {
        return this.saveHistory(event.metadata.target, event.manager, event.databaseEntity, AuditAction.Delete);
    }

    async afterSoftRemove<T>(event: SoftRemoveEvent<T>) {
        return this.afterRemove(event);
    }
}
