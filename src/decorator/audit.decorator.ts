import { AuditSubscriber } from '@/subscribers/audit.subscriber';
import type { AuditOptions } from '@/types';
import { addToMigrations, createEntityOpts } from '@/utils';

export const Audit = (options?: Partial<AuditOptions>) => (target: Function) => {
    const auditOptions = createEntityOpts(target, options);

    addToMigrations(auditOptions);

    AuditSubscriber.subscribe(auditOptions);
};
