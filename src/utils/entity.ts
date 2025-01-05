import { BaseEntity, Column, CreateDateColumn, type DeepPartial, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { AuditAction, type AuditSubscriberOptions, type ClassType, type AuditOptions } from '@/types';
import { isStringVersionType } from './is';
import { isEntityInstanceOfBaseEntity } from "./metadata"

export const createEntityHistory = (opts: AuditOptions, PrimaryKeyDecorator: PropertyDecorator) => {
  @Entity({ name: opts.tableName })
  class HistoryEntity {
    @PrimaryKeyDecorator
    id: string | number;

    @VersionColumn()
    version: number;

    @Column()
    entityId: string;

    @Column(opts.jsonColumnType)
    data: Record<string, unknown>;

    @Column({
      type: 'enum',
      enum: AuditAction,
    })
    action: AuditAction;

    @CreateDateColumn()
    modifiedAt: Date;
  }

  return HistoryEntity;
}

export const createGenericHistoryEntity = (opts: AuditOptions, PrimaryKeyDecorator: PropertyDecorator) => {
  @Entity({ name: opts.tableName })
  class HistoryEntity {
    @PrimaryKeyDecorator
    id: string | number;

    @VersionColumn()
    version: number;

    @Column()
    entityType: string;

    @Column()
    entityId: string;

    @Column(opts.jsonColumnType)
    data: unknown;

    @Column({
      type: 'enum',
      enum: AuditAction,
    })
    action: AuditAction;

    @CreateDateColumn()
    modifiedAt: Date;
  }

  return HistoryEntity;
}

export const createHistoryEntity = (opts: AuditOptions & { isEntitySpecific: boolean }) => {
  const PrimaryDecorator = isStringVersionType(opts.primaryIdType) ? 
    PrimaryGeneratedColumn(opts.primaryIdType) : 
    PrimaryGeneratedColumn({ type: opts.primaryIdType });

  if (opts.isEntitySpecific) {
    return createEntityHistory(opts, PrimaryDecorator);
  }

  return createGenericHistoryEntity(opts, PrimaryDecorator);
}

export const createHistory = (
  {opts, target }: AuditSubscriberOptions, 
  newEntity: Record<string, unknown>, 
  action: AuditAction
) => ({
  data: opts.jsonColumnType.includes("json") ? newEntity : JSON.stringify(newEntity),
  action: action,
  entityId: newEntity[opts.primaryIdColumn],
  modifiedAt: new Date(),
  ...(opts.isEntitySpecific ? { entityType: target.name } : {}),
})

export const createHistoryInstance = (
  auditOptions: AuditSubscriberOptions, 
  newEntity: Record<string, unknown>, 
  action: AuditAction
) => {

  // If the entity is an instance of BaseEntity, we can use the create method
  if (isEntityInstanceOfBaseEntity(auditOptions.target)) {
    return (auditOptions.target as typeof BaseEntity).create(
      createHistory(auditOptions, newEntity, action) as DeepPartial<BaseEntity>,
    );
  } 
  
  const replica = new (auditOptions.target as ClassType)();
  
  return Object.assign(replica, createHistory(auditOptions, newEntity, action));
}