import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditAction, type AuditSubscriberOptions, type AuditOptions } from '../types';
import { isStringVersionType } from './is';

export const createHistoryEntity = (opts: AuditOptions & { isEntitySpecific: boolean }) => {
  @Entity({ name: opts.tableName })
  class HistoryEntity {
    // @ts-ignore
    @PrimaryGeneratedColumn(isStringVersionType(opts.primaryIdType) ? opts.primaryIdType : { type: opts.primaryIdType })
    id: string | number;

    @Column({
      nullable: true,
    })
    entityType: string;

    @Column()
    entityId: string;

    @Column(opts.jsonColumnType)
    data: Record<string, unknown> | string;

    @Column()
    action: AuditAction;

    @CreateDateColumn()
    modifiedAt: Date;
  }

  return HistoryEntity;
}

export const createHistoryInstance = (
  { opts, target }: AuditSubscriberOptions, 
  newEntity: Record<string, unknown>, 
  action: AuditAction
) => {
  // @ts-ignore
  const instance = new target(); // typeorm needs a new instance to save default values
  instance.data = opts.jsonColumnType.includes("json") ? newEntity : JSON.stringify(newEntity);
  instance.action = action;
  instance.entityId = newEntity[opts.primaryIdColumn];
  if (opts.isEntitySpecific) {
    instance.entityType = target.name;
  }

  return instance;
}
