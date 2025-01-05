import { EntitySchema, MixedList } from 'typeorm';
import { Case1 } from './mocks/case1';
import { initializeDataSourceWithAudit } from '../src';

const initializeDataSource = (entities: MixedList<string | Function | EntitySchema<any>>) => initializeDataSourceWithAudit({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: 'all',
    entities,
});

jest.setTimeout(60000);

describe("DataSource Manager", () => {
    it("should add to datasource manager", async () => {
        const dataSource = await initializeDataSource([Case1]);

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
});
