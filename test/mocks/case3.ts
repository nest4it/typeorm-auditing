import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

@Audit({
    tableName: 'audit',
    jsonColumnType: 'text',
    saveEntityType: true,
})
@Entity()
export class Case3 extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column()
    lastName!: string;

    @Column()
    age!: number;
}

@Audit({
    tableName: 'audit',
    jsonColumnType: 'text',
    saveEntityType: true,
})
@Entity()
export class Case4 extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column()
    lastName!: string;

    @Column()
    age!: number;
}