// edge.resolver.ts
import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

@Resolver(() => Edge)
export class EdgeResolver {
  constructor(private edgeService: EdgeService) { }

  @Query(() => [Edge], { name: 'getEdges' })
  async getEdges(): Promise<Edge[]> {
    return this.edgeService.findAll();
  }

  @Query(() => Edge, { name: 'getEdge' })
  async getEdge(@Args('id', { type: () => ID }) id: string): Promise<Edge> {
    return this.edgeService.findOne(id);
  }

  @Mutation(() => Edge)
  createEdge(@Args('createEdgeInput') createEdgeInput: CreateEdgeInput) {
    return this.edgeService.create(createEdgeInput);
  }
}
