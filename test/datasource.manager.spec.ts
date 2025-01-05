import { DataSource, EntitySchema, MixedList } from 'typeorm';
import { Case1 } from './mocks/case1';
import { AuditSubscriber } from '../src/subscribers/audit.subscriber';

const initializeDataSource = (entities: MixedList<string | Function | EntitySchema<any>>) => new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: 'all',
    entities,
    subscribers: [AuditSubscriber],
}).initialize()

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

        expect(await dataSource.manager.find("case1_audit")).toMatchSnapshot();
    });
});
