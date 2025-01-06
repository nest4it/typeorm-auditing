import { DataSource, EntitySchema, MixedList } from 'typeorm';
import { Case1 } from './mocks/case1';
import { Case2 } from './mocks/case2';
import { withAuditDataSource } from '../src';
import { Case3, Case4 } from './mocks/case3';

const initializeDataSource = (entities: MixedList<string | Function | EntitySchema<any>>) => 
    withAuditDataSource(new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: 'all',
        entities,
    }));

jest.setTimeout(60000);

describe("DataSource Manager", () => {
    it("should add to datasource manager", async () => {
        const dataSource = await (await initializeDataSource([Case1])).initialize();

        const entity = await dataSource.manager.save(
            Case1.create({
                firstName: 'Timber',
                lastName: 'Saw',
                age: 25,
            })
        );

        entity.age++;
        await entity.save();
        await entity.remove();

        expect(await dataSource.manager.find("case1_audit")).toEqual([
            expect.objectContaining({
                action: 'CREATE',
                id: 1,
                entityId: "1",
            }),
            expect.objectContaining({
                action: 'UPDATE',
                id: 2,
                entityId: "1",
            }),
            expect.objectContaining({
                action: 'DELETE',
                id: 3,
                entityId: "1",
            }),
        ])
    });

    it("should set user id", async () => {
        const dataSource = await (await initializeDataSource([Case2])).initialize();

        const entity = await dataSource.manager.save(
            Case2.create({
                lastName: 'Saw',
                age: 25,
            })
        );

        entity.age++;
        await entity.save();
        await entity.remove();

        expect(await dataSource.manager.find("case2_audit")).toEqual([
            expect.objectContaining({
                action: 'CREATE',
                id: 1,
                entityId: "1",
                modifiedBy: '1',
            }),
            expect.objectContaining({
                action: 'UPDATE',
                id: 2,
                entityId: "1",
                modifiedBy: "1",
            }),
            expect.objectContaining({
                action: 'DELETE',
                id: 3,
                entityId: "1",
                modifiedBy: "1",
            }),
        ])
    });

    it("should use the same audit table for multiple entities", async () => {
        const dataSource = await (await initializeDataSource([Case3, Case4])).initialize();

        const entity3 = await dataSource.manager.save(
            Case3.create({
                lastName: 'Saw',
                age: 25,
            })
        );

        entity3.age++;
        await entity3.save();
        await entity3.remove();

        const entity4 = await dataSource.manager.save(
            Case4.create({
                lastName: 'Saw',
                age: 25,
            })
        );

        entity4.age++;
        await entity4.save();
        await entity4.remove();

        expect(await dataSource.manager.find("audit")).toEqual([
            expect.objectContaining({
                action: 'CREATE',
                entityType: 'Case3',
            }),
            expect.objectContaining({
                action: 'UPDATE',
                entityType: 'Case3',
            }),
            expect.objectContaining({
                action: 'DELETE',
                entityType: 'Case3',
            }),

            expect.objectContaining({
                action: 'CREATE',
                entityType: 'Case4',
            }),
            expect.objectContaining({
                action: 'UPDATE',
                entityType: 'Case4',
            }),
            expect.objectContaining({
                action: 'DELETE',
                entityType: 'Case4',
            }),
        ])
    });
});
