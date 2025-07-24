// edge.resolver.ts
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

@Resolver(() => Edge)
export class EdgeResolver {
  constructor(private edgeService: EdgeService) { }

  @Query(() => [Edge], { name: 'edges' })
  async getEdges(): Promise<Edge[]> {
    return this.edgeService.findAll();
  }

  @Mutation(() => Edge)
  createEdge(@Args('createEdgeInput') createEdgeInput: CreateEdgeInput) {
    return this.edgeService.create(createEdgeInput);
  }
}
