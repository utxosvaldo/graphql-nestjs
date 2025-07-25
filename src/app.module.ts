// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EdgeModule } from './edge/edge.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EdgeEventsModule } from './edge-events/edge-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local', // Loads file for local development
      ignoreEnvFile: process.env.NODE_ENV === 'production', // In production, use container env vars only
    }),

    // TypeORM with ConfigService - async configuration
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'demo_db'),
        autoLoadEntities: true,
        synchronize: true, // Only for demo
      }),
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      debug: true,
    }),
    EdgeModule,
    RabbitmqModule,
    EdgeEventsModule,
  ],
})
export class AppModule { }
