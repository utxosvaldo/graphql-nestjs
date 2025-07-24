// edge.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
  ) { }

  async create(createEdgeInput: CreateEdgeInput): Promise<Edge> {
    // Generate random capacity between 10,000 and 1,000,000 as per requirements
    const capacity = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;

    const edge = this.edgeRepository.create({
      ...createEdgeInput,
      capacity,
    });

    return this.edgeRepository.save(edge);
  }

  async findAll(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }
}
