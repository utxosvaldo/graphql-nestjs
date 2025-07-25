import { Test, TestingModule } from '@nestjs/testing';
import { EdgeEventsController } from './edge-events.controller';
import { EdgeEventsService } from './edge-events.service';

describe('EdgeEventsController', () => {
  let controller: EdgeEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgeEventsController],
      providers: [EdgeEventsService],
    }).compile();

    controller = module.get<EdgeEventsController>(EdgeEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
