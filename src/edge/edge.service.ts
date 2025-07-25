// edge.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
    @Inject('RABBITMQ_SERVICE')
    private client: ClientProxy,
  ) { }

  async findAll(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }

  async findOne(id: string): Promise<Edge> {
    const edge = await this.edgeRepository.findOne({ where: { id } });
    if (!edge) {
      throw new NotFoundException(`Edge with ID ${id} not found`)
    }

    return edge;
  }

  async create(createEdgeInput: CreateEdgeInput): Promise<Edge> {
    // Generate random capacity between 10,000 and 1,000,000 as per requirements
    const capacity = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;

    const edge = this.edgeRepository.create({
      ...createEdgeInput,
      capacity,
    });

    const savedEdge = await this.edgeRepository.save(edge);
    // console.log(`Edge created: ${JSON.stringify(savedEdge, null, 2)}`);

    this.client.emit('edge.created', savedEdge);


    return savedEdge;
  }

  async updateAliases(id: string, updateData: { node1_alias: string, node2_alias: string }): Promise<void> {
    console.log(`Updating edge with ID ${id} with data:`, JSON.stringify(updateData, null, 2));
    const result = await this.edgeRepository.update(id, {
      node1_alias: updateData.node1_alias,
      node2_alias: updateData.node2_alias,
    })

    if (result.affected === 0) {
      throw new NotFoundException(`Edge with ID ${id} not found for update`);
    }

    console.log("this is the result form the update: ", JSON.stringify(result, null, 2));

    return
  }
}
