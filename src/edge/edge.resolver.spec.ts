// edge/edge.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EdgeResolver } from './edge.resolver';
import { EdgeService } from './edge.service';
import { CreateEdgeInput } from './dto/create-edge.input';

describe('EdgeResolver', () => {
  let resolver: EdgeResolver;
  let service: EdgeService;

  const mockEdgeService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeResolver,
        {
          provide: EdgeService,
          useValue: mockEdgeService,
        },
      ],
    }).compile();

    resolver = module.get<EdgeResolver>(EdgeResolver);
    service = module.get<EdgeService>(EdgeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEdges', () => {
    it('should return an array of edges', async () => {
      const result = [{ id: '1', node1_alias: 'alice', node2_alias: 'bob' }];
      mockEdgeService.findAll.mockResolvedValue(result);

      expect(await resolver.getEdges()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getEdge', () => {
    it('should return a single edge', async () => {
      const result = { id: '1', node1_alias: 'alice', node2_alias: 'bob' };
      mockEdgeService.findOne.mockResolvedValue(result);

      expect(await resolver.getEdge('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('createEdge', () => {
    it('should create a new edge', async () => {
      const createEdgeInput: CreateEdgeInput = {
        node1_alias: 'alice',
        node2_alias: 'bob',
      };
      const result = { id: '1', ...createEdgeInput, capacity: 50000 };
      mockEdgeService.create.mockResolvedValue(result);

      expect(await resolver.createEdge(createEdgeInput)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createEdgeInput);
    });
  });
});
