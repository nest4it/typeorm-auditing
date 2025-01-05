import { DataSource, type EntityMetadata } from "typeorm";
import { getMetaData } from "./reflect";
import { AuditSubscriber } from "../subscribers/audit.subscriber";

export const getAuditEntity = (entityMetadata: EntityMetadata) => {
  const meta = getMetaData(entityMetadata.target);

  if (!meta) {
    return undefined;
  }

  return meta.historyEntity
}

export const withAuditDataSource = async (dataSource: DataSource) => {
  const originDataSource = await new DataSource({
    ...dataSource.options,
    logger: undefined,
    synchronize: false,
  }).initialize();

  const allMetaData = originDataSource
    .entityMetadatas
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

  return new DataSource({
    ...dataSource.options,
    entities: combinedEntities,
    subscribers: combinedSubscribers,
  });
}