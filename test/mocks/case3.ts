import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

@Entity()
export class Case3Parent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}

export class Case3Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne('Case3Parent', 'id')
    @JoinColumn({ name: 'parent_id' })
    parent!: Case3Parent;
}

@Audit({
    tableName: 'case3_audit',
})
@Entity()
export class Case3 extends Case3Base {
    @Column({ name: 'first_name' })
    @Index({ unique: true })
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    age!: number;
}
