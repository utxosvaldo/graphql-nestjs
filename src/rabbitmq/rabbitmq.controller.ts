import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Edge } from 'src/edge/entities/edge.entity';

@Controller()
export class RabbitmqController {
  @MessagePattern('edge.created')
  handleEdgeCreated(@Payload() data: Edge) {
    console.log(
      `New channel between ${data.node1_alias} and ${data.node2_alias} with a capacity of ${data.capacity} has been created.`
    );
    console.log(JSON.stringify(data, null, 2));
  }
}
