import { DataSource, type DataSourceOptions, type EntityMetadata } from 'typeorm';
import { getMetaData } from './reflect';
import { AuditSubscriber } from '../subscribers/audit.subscriber';

export const getAuditEntity = (entityMetadata: EntityMetadata) => {
  const meta = getMetaData(entityMetadata.target);

  if (!meta) {
    return undefined;
  }

  return meta.historyEntity;
};

export const getAuditOptions = async (options: DataSourceOptions) => {
  const originDataSource = await new DataSource({
    ...options,
    logger: undefined,
    synchronize: false,
  }).initialize();

  const allMetaData = originDataSource.entityMetadatas
    .map(getAuditEntity)
    .filter(Boolean);

  let originalEntities = originDataSource.options.entities || [];
  let originalSubscribers = originDataSource.options.subscribers || [];

  if (!Array.isArray(originalEntities)) {
    originalEntities = Object.values(originalEntities);
  }

  if (!Array.isArray(originalSubscribers)) {
    originalSubscribers = Object.values(originalSubscribers);
  }

  const combinedEntities = [...originalEntities, ...allMetaData];
  const combinedSubscribers = [...originalSubscribers, AuditSubscriber];

  await originDataSource.destroy();

  return {
    ...options,
    entities: combinedEntities,
    subscribers: combinedSubscribers,
  };
};

export const withAuditDataSource = async (dataSource: DataSource) => {
  const newOptions = await getAuditOptions(dataSource.options);
  return new DataSource(newOptions);
};
