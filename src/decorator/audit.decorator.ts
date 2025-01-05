import type { AuditOptions } from '../types';
import { createEntityOpts, createHistoryEntity } from '../utils';
import { setMetaData } from "../utils/reflect";

export const Audit = (options?: Partial<AuditOptions>) => (target: Function) => {
    const auditOptions = createEntityOpts(target, options);
    const historyTarget = createHistoryEntity(auditOptions.opts);

    setMetaData({
        ...auditOptions,
        historyEntity: historyTarget,
    }, target);
};
