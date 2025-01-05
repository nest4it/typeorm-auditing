import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

class MyBase1 extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;
}

class MyBase2 extends MyBase1 {
    @Column()
    @Index()
    firstName!: string;
}

@Audit({
    tableName: 'case1_audit',
})
@Entity()
export class Case1 extends MyBase2 {
    @Column()
    lastName!: string;

    @Column()
    age!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public FullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}