import { AUDIT_METADATA_KEY } from '../constants';
import type { AuditSubscriberOptions } from '../types';

export const setMetaData = (
  metadataValue: AuditSubscriberOptions & { historyEntity: Function },
  target: Object,
) => {
  Reflect.defineMetadata(AUDIT_METADATA_KEY, metadataValue, target);
};

export const getMetaData = (
  target: Object,
): AuditSubscriberOptions & { historyEntity: Function } => {
  if (Reflect.hasMetadata(AUDIT_METADATA_KEY, target)) {
    return Reflect.getMetadata(AUDIT_METADATA_KEY, target);
  }

  return null;
};
