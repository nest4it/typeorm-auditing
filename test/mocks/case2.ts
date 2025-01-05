import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

@Audit({
    jsonColumnType: 'text',
    getModifiedBy: async (connection, entity) => {
        return '1';
    }
})
@Entity()
export class Case2 extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

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
}