import { DataSource, EntitySchema, MixedList } from 'typeorm';
import { Case1 } from './mocks/case1';
import { Case2 } from './mocks/case2';
import { withAuditDataSource } from '../src';

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
});
