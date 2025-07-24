// edge.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Edge } from './edge.entity';
import { EdgeService } from './edge.service';

@Resolver(() => Edge)
export class EdgeResolver {
  constructor(private edgeService: EdgeService) { }

  @Query(() => [Edge], { name: 'edges' })
  async getEdges(): Promise<Edge[]> {
    return this.edgeService.findAll();
  }
}
