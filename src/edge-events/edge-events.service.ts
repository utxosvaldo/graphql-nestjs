import { Injectable } from '@nestjs/common';
import { UpdateEdgeEventDto } from './dto/update-edge-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Edge } from 'src/edge/entities/edge.entity';

@Injectable()
export class EdgeEventsService {
  constructor(
    @InjectRepository(Edge) private edgeRepository: Repository<Edge>,
  ) { }

  async updateAliases(id: string, updateEdgeEventDto: UpdateEdgeEventDto): Promise<UpdateResult> {
    const result = await this.edgeRepository.update(id, {
      node1_alias: updateEdgeEventDto.node1_alias,
      node2_alias: updateEdgeEventDto.node2_alias,
    })

    if (result.affected === 0) {
      throw new Error(`Edge with ID ${id} not found for update`);
    }

    return result;
  }
}
