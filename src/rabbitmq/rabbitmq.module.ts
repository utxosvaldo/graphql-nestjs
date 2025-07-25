import { Module } from '@nestjs/common';
import { RabbitmqController } from './rabbitmq.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:password@localhost:5672'],
          queue: 'edge_events_queue',
          queueOptions: {
            durable: true,
          }
        }
      }
    ])
  ],
  exports: [ClientsModule],
  controllers: [RabbitmqController],
})
export class RabbitmqModule { }
