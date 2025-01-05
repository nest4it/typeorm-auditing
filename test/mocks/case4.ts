import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

@Entity()
export class Case4Parent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}

export class Case4Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Case4Parent, (o) => o.id)
    @JoinColumn({ name: 'parent_id' })
    parent!: Case4Parent;
}

@Audit({
    tableName: 'case4_audit',
})
@Entity()
export class Case4 extends Case4Base {
    @Column({ name: 'first_name' })
    @Index({ unique: true })
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    age!: number;
}
