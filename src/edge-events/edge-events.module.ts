import { Module } from '@nestjs/common';
import { EdgeEventsService } from './edge-events.service';
import { EdgeEventsController } from './edge-events.controller';
import { Edge } from 'src/edge/entities/edge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])], // add database access
  controllers: [EdgeEventsController],
  providers: [EdgeEventsService],
})
export class EdgeEventsModule { }
