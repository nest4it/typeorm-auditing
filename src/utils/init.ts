import { DataSource, DataSourceOptions } from "typeorm";
import { getMetaData } from "./reflect";
import { AuditSubscriber } from "../subscribers/audit.subscriber";

export const initializeDataSourceWithAudit = async (options: DataSourceOptions) => {
  const originDataSource = await new DataSource({
    ...options,
    logger: undefined,
    synchronize: false,
  }).initialize();

  const allMetaData = originDataSource.entityMetadatas.map(entityMetadata => {
    const meta = getMetaData(entityMetadata.target);
    
    if (!meta) {
      return undefined;
    }

      return meta.historyEntity
  }).filter(Boolean);

  // Extract original entities
  let originalEntities = options.entities || [];
  let originalSubscribers = options.subscribers || [];

  // Normalize entities into an array if not already
  if (!Array.isArray(originalEntities)) {
    originalEntities = Object.values(originalEntities);
  }

  // Normalize subscribers into an array if not already
  if (!Array.isArray(originalSubscribers)) {
    originalSubscribers = Object.values(originalSubscribers);
  }

  // Combine original and audit entities
  const combinedEntities = [...originalEntities, ...allMetaData];
  const combinedSubscribers = [...originalSubscribers, AuditSubscriber];

  await originDataSource.destroy();

  // Create a new DataSource with enriched entities
  return new DataSource({
    ...options,
    entities: combinedEntities,
    subscribers: combinedSubscribers,
  }).initialize();
}