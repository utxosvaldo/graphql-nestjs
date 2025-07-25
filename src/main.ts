// main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService - from docs [1]
  const configService = app.get(ConfigService);

  // Connect microservice with ConfigService
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL', 'amqp://admin:password@localhost:5672')],
      queue: 'edge_events_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  // Use ConfigService for port - from docs [1]
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

}
bootstrap();
