import { DataSource, DataSourceOptions } from "typeorm";
import { getMetaData } from "./reflect";

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

  // Normalize entities into an array if not already
  if (!Array.isArray(originalEntities)) {
    originalEntities = Object.values(originalEntities);
  }

  // Combine original and audit entities
  const combinedEntities = [...originalEntities, ...allMetaData];

  await originDataSource.destroy();

  // Create a new DataSource with enriched entities
  return new DataSource({
    ...options,
    entities: combinedEntities,
  }).initialize();
}