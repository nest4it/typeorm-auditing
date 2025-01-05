<div align="center">
  <h1>Audit (@n4it/typeorm-audit)</h1>
</div>
<div align="center">
  <strong>For storing history on entities.</strong>
</div>
<br/>
<div align="center">
  <img src="https://gravatar.com/avatar/c27e8ebbf92f687180aa0f13dab9a0b1?size=256" alt="Logo n4it" style="border-radius:100%"/>
</div>

<br />

<div align="center">
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

## Install
```shell
$ npm install @n4it/typeorm-audit --save
```

```shell
$ yarn add @n4it/typeorm-audit
```

----

## Usage

```typescript
import { Audit } from "@n4it/typeorm-audit"

@Audit() // mark your entity as auditable
@Entity()
export class User {
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  age: number;
}
```

Once you've enhanced entities with the `Audit` decorator, you need to use the `withAuditDataSource` dataSource wrapper in order to let the changes to have effect:

```typescript
import { withAuditDataSource } from  "@n4it/typeorm-audit";
import { DataSource } from "typeorm";

const dataSource = await withAuditDataSource(
  new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: 'all',
    entities: [User],
  })

await dataSource.initialize();
)
```

The `withAuditDataSource` basically extracts the meta data from the TypeORM entities and make sure the entites with `Audit` metadata are recognised.

## Support

Any support is welcome. At least you can give us a star.

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

### Financial Contributors

#### Organizations

Currently this project is sponsored and maintained by N4IT. Get in touch if you want to become a sponsor.

## License

[GPL-3.0](LICENSE)