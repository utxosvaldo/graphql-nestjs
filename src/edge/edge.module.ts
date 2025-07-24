import { Module } from '@nestjs/common';
import { EdgeService } from './edge.service';
import { EdgeResolver } from './edge.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities/edge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  providers: [EdgeService, EdgeResolver]
})
export class EdgeModule { }
