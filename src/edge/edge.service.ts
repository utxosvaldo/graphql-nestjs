// edge.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './edge.entity';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
  ) { }

  async findAll(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }
}
