<div align="center">
  <h1>TypeORM Audit (@n4it/typeorm-audit)</h1>
  <strong>Efficient entity history tracking for TypeORM.</strong>
  <br/><br/>
  <img src="https://gravatar.com/avatar/c27e8ebbf92f687180aa0f13dab9a0b1?size=256" alt="N4IT Logo" style="border-radius:50%"/>
  <br/><br/>
  <a href="https://github.com/nest4it/typeorm-auditing/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nest4it/typeorm-auditing.svg" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/@n4it/typeorm-audit">
    <img src="https://img.shields.io/npm/v/@n4it/typeorm-audit.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/org/n4it">
    <img src="https://img.shields.io/npm/dm/@n4it/typeorm-audit.svg" alt="npm downloads" />
  </a>
  <a href="https://renovatebot.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="Renovate" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome" />
  </a>
</div>

## Installation

To install the latest version:

```shell
npm install @n4it/typeorm-audit --save
```

Or using Yarn:

```shell
$ yarn add @n4it/typeorm-audit
```

<hr/>

## Usage
To enable auditing, decorate your entities with `@Audit()`:
```typescript
import { Audit } from "@n4it/typeorm-audit";
import { Entity, Column } from "typeorm";

@Audit() // Enable auditing for this entity
@Entity()
export class User {
  @Column() firstName: string;
  @Column() lastName: string;
  @Column() age: number;
}
```

Integrate with your `DataSource`:

```typescript
import { withAuditDataSource } from "@n4it/typeorm-audit";
import { DataSource } from "typeorm";

const dataSource = await withAuditDataSource(
  new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: 'all',
    entities: [User],
  })
);

await dataSource.initialize();
```

Or using `getAuditOptions`:

```typescript
import { getAuditOptions } from "@n4it/typeorm-audit";
import { DataSource } from "typeorm";

const dataSource = new DataSource(
  await getAuditOptions({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: 'all',
    entities: [User],
  })
);

await dataSource.initialize();
```

## Advanced Features
Specify Modified By:

```typescript
@Audit({
    getModifiedBy: async (connection, newEntity) => {
      // Use the connection to query the database
      return newEntity.lastModifiedBy ?? 1;
    }
})
@Entity()
export class User {
  @Column() firstName: string;
  @Column() lastName: string;
  @Column() age: number;
}
```

Use a single `audit` table:

```typescript
@Audit({ tableName: "audit", saveEntityType: true })
@Entity()
export class User {
  @Column() firstName: string;
  @Column() lastName: string;
  @Column() age: number;
}

@Audit({ tableName: "audit", saveEntityType: true })
@Entity()
export class Company {
  @Column() name: string;
}
```

## Migrations
Enhance your `DataSource` with auditing capabilities:

```typescript
import { DataSource } from "typeorm";
import { join } from "path";
import { withAuditDataSource } from "@n4it/typeorm-audit";

export default withAuditDataSource(
  new DataSource({
    type: "postgres",
    useUTC: true,
    host: process.env.host,
    port: process.env.port,
    username: process.env.user,
    password: process.env.password,
    database: process.env.name,
    synchronize: false,
    entities: [`${join(process.cwd(), "src", "entities")}/*`],
    migrations: [`${join(__dirname, "migrations")}/*`],
    migrationsTableName: "migrations",
    logging: true,
  }),
);
```

## Support
We welcome contributions of all forms. Please feel free to submit a pull request or open an issue. Star us on GitHub!

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute.

### Financial Contributors

#### Organizations

Currently this project is sponsored and maintained by [N4IT](https://n4it.nl). Get in touch if you want to become a sponsor.

## License

[GPL-3.0](LICENSE)