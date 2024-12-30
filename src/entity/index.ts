import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { AuditAction, AuditEntityOptions } from '@/types';

export const createHistoryEntity = (opts: AuditEntityOptions) => {

  @Entity({ name: opts.name + '_history' })
  class HistoryEntity {
    @PrimaryGeneratedColumn({ type: opts.versionType ?? 'bigint' })
    id: string;

    @Column({
      type: opts.versionType ?? 'bigint',
      default: 1,
    })
    version: number;

    @Column()
    entityType: string;

    @Column()
    entityId: string;

    @Column('json')
    data: any;

    @Column()
    action: AuditAction;

    @CreateDateColumn()
    modifiedAt: Date;
  }

  return HistoryEntity;
}