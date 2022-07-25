import { AuditingAction, AuditingSubscriber } from '../decorator/auditing-entity.decorator';
import { DataSource } from 'typeorm';
import { Case1, Case1Audit } from './entity/case1';
import { Case2, Case2Audit } from './entity/case2';

describe('AuditingEntity - E2E', () => {
    it('Case1(Inheritance) - CUD', async () => {
        const dataSource = await new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: 'all',
            entities: [Case1, Case1Audit],
            subscribers: [AuditingSubscriber],
        }).initialize();

        const entity = await dataSource.manager.save(
            Case1.create({
                firstName: 'Timber',
                lastName: 'Saw',
                age: 25,
            })
        );
        expect(entity).toBeDefined();

        //Create
        const created = await dataSource.manager.find(Case1Audit);
        expect(created).toBeDefined();
        expect(created.length > 0).toBeDefined();
        expect(created[0]._action === AuditingAction.Create).toBeDefined();
        expect(created[0].id === entity.id).toBeDefined();

        //Update
        entity.age++;
        await entity.save();

        const updated = await dataSource.manager.find(Case1Audit, { where: { _action: AuditingAction.Update } });
        expect(updated).toBeDefined();
        expect(updated.length > 0).toBeDefined();
        expect(updated[0]._action === AuditingAction.Update).toBeDefined();
        expect(updated[0].id === entity.id).toBeDefined();

        //Delete
        await entity.remove();
        const deleted = await dataSource.manager.find(Case1Audit, { where: { _action: AuditingAction.Delete } });
        expect(deleted).toBeDefined();
        expect(deleted.length > 0).toBeDefined();
        expect(deleted[0]._action === AuditingAction.Update).toBeDefined();
        expect(deleted[0].id === entity.id).toBeDefined();
    });

    it('Case2(Not inherited + ObjectLiteral + Partial) - CUD', async () => {
        const dataSource = await new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: 'all',
            entities: [Case2, Case2Audit],
            subscribers: [AuditingSubscriber],
        }).initialize();

        const entity = new Case2();
        entity.firstName = 'Timber';
        entity.lastName = 'Saw';
        entity.age = 25;

        await dataSource.manager.save(entity);
        expect(entity).toBeDefined();

        //Create
        const created = await dataSource.manager.find(Case2Audit);
        expect(created).toBeDefined();
        expect(created.length > 0).toBeDefined();
        expect(created[0]._action === AuditingAction.Create).toBeDefined();
        expect(created[0].id === entity.id).toBeDefined();

        //Update
        entity.age++;
        await dataSource.manager.save(entity);

        const updated = await dataSource.manager.find(Case2Audit, { where: { _action: AuditingAction.Update } });
        expect(updated).toBeDefined();
        expect(updated.length > 0).toBeDefined();
        expect(updated[0]._action === AuditingAction.Update).toBeDefined();
        expect(updated[0].id === entity.id).toBeDefined();

        //Delete
        await dataSource.manager.remove(entity);
        const deleted = await dataSource.manager.find(Case2Audit, { where: { _action: AuditingAction.Delete } });
        expect(deleted).toBeDefined();
        expect(deleted.length > 0).toBeDefined();
        expect(deleted[0]._action === AuditingAction.Update).toBeDefined();
        expect(deleted[0].id === entity.id).toBeDefined();
    });

    it('Case3(Not inherited + ObjectLiteral + Partial) - ObjectLiteral', async () => {
        const dataSource = await new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: 'all',
            entities: [Case2, Case2Audit],
            subscribers: [AuditingSubscriber],
        }).initialize();

        const entities = await dataSource.getRepository(Case2).save([
            {
                firstName: 'Timber',
                lastName: 'Saw',
                age: 25,
            },
            {
                firstName: 'Timber',
                lastName: 'Saw',
                age: 26,
            },
            {
                firstName: 'Timber',
                lastName: 'Saw',
                age: 27,
            },
        ]);
        expect(entities).toBeDefined();
        console.log(entities);

        //Create
        const created = await dataSource.manager.find(Case2Audit);
        console.log(created);
        expect(created).toBeDefined();
        expect(created.length > 0).toBeDefined();
        expect(created[0]._action === AuditingAction.Create).toBeDefined();
        expect(created[0].id === entities[0].id).toBeDefined();
        expect(created[1].id === entities[1].id).toBeDefined();
        expect(created[2].id === entities[2].id).toBeDefined();
    });
});
