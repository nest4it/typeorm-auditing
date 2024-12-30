import { getMetadataArgsStorage } from 'typeorm';
import { AuditSubscriber } from '../subscribers/audit.subscriber';
import type { AuditEntityOptions } from '@/types';
import { createHistoryEntity } from '@/entity';
import { TableMetadataArgs } from 'typeorm/metadata-args/TableMetadataArgs';

export function AuditEntity(options: AuditEntityOptions = {
    versionType: 'bigint',
    historyTableName: 'entity_history',
}) {
    return (target: Function) => {
        const metadataStorage = getMetadataArgsStorage();

        const HistoryEntity = createHistoryEntity({
            name: options.historyTableName || `${target.name}_history`,
            versionType: options.versionType,
        });

        const tableMetadata: TableMetadataArgs = {
            target: HistoryEntity,
            name: options.historyTableName || `${target.name}_history`,
            type: "regular",
        };

        metadataStorage.tables.push(tableMetadata);

        AuditSubscriber.Subscribe(target, HistoryEntity);
    };
}
