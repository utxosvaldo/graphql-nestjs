// edge.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { Edge } from './entities/edge.entity';

@Resolver(() => Edge)
export class EdgeResolver {
  constructor(private edgeService: EdgeService) { }

  @Query(() => [Edge], { name: 'edges' })
  async getEdges(): Promise<Edge[]> {
    return this.edgeService.findAll();
  }
}
