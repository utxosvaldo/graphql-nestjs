import { Module } from '@nestjs/common';
import { EdgeService } from './edge.service';
import { EdgeResolver } from './edge.resolver';

@Module({
  providers: [EdgeService, EdgeResolver]
})
export class EdgeModule {}
