import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EdgeEventsService } from './edge-events.service';
import { Edge } from '../edge/entities/edge.entity';

@Controller()
export class EdgeEventsController {
  constructor(private readonly edgeEventsService: EdgeEventsService) { }

  @MessagePattern('edge.created')
  async handleEdgeCreated(@Payload() data: Edge) {
    // console log as requested
    console.log(
      `New channel between ${data.node1_alias} and ${data.node2_alias} with a capacity of ${data.capacity} has been created.`
    );

    // Update the edges node2_alias
    const result = await this.edgeEventsService.updateAliases(data.id, {
      node1_alias: `${data.node1_alias}-updated`,
      node2_alias: `${data.node2_alias}-updated`,
    })

    if (result.affected === 0) {
      throw new NotFoundException(`Edge with ID ${data.id} not found for update`);
    }
  }

}
