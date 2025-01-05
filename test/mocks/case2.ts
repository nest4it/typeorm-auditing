import { AfterLoad, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../src/decorator/audit.decorator';

class MyBase1 {
    @PrimaryGeneratedColumn()
    id!: number;
}
@Audit({
    tableName: 'case2_audit',
})
@Entity()
export class Case2 extends MyBase1 {
    @Column()
    @Index()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    age!: number;

    @OneToMany(() => ChildCase2, (child) => child.id)
    children!: ChildCase2[];

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public FullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @AfterLoad()
    afterLoad() {
        console.log(this.age);
    }
}

@Entity()
export class ChildCase2 {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne((type) => Case2, (parent) => parent.children)
    case2!: Case2;
}
