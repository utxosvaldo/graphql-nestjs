import { PartialType } from '@nestjs/mapped-types';
import { CreateEdgeEventDto } from './create-edge-event.dto';

export class UpdateEdgeEventDto extends PartialType(CreateEdgeEventDto) {
  node1_alias: string;
  node2_alias: string;
}
