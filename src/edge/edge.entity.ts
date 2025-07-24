// edge.entity.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

@Entity()
@ObjectType()
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @Column()
  @Field(() => Int)
  capacity: number;

  @Column()
  @Field()
  node1_alias: string;

  @Column()
  @Field()
  node2_alias: string;

  @Field()
  get edge_peers(): string {
    return `${this.node1_alias}-${this.node2_alias}`;
  }
}
