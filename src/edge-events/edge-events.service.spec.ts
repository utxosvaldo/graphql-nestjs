import { Test, TestingModule } from '@nestjs/testing';
import { EdgeEventsService } from './edge-events.service';

describe('EdgeEventsService', () => {
  let service: EdgeEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeEventsService],
    }).compile();

    service = module.get<EdgeEventsService>(EdgeEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
