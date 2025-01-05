import { AUDIT_METADATA_KEY } from '../constants';
import type { AuditSubscriberOptions } from '../types';

export const setMetaData = (
  metadataValue: AuditSubscriberOptions & { historyEntity: Function },
  target: Object,
  propertyKey: string | symbol = undefined,
) => {
  if (propertyKey) {
    Reflect.defineMetadata(AUDIT_METADATA_KEY, metadataValue, target, propertyKey);
  } else {
    Reflect.defineMetadata(AUDIT_METADATA_KEY, metadataValue, target);
  }
};

export const getMetaData = (
  target: Object,
  propertyKey: string | symbol = undefined,
): AuditSubscriberOptions & { historyEntity: Function } => {
  return propertyKey
    ? Reflect.getMetadata(AUDIT_METADATA_KEY, target, propertyKey)
    : Reflect.getMetadata(AUDIT_METADATA_KEY, target);
};
