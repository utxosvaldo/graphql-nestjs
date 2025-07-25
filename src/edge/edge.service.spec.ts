// edge/edge.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';
import { EdgeService } from './edge.service';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

describe('EdgeService', () => {
  let service: EdgeService;
  let repository: Repository<Edge>;
  let clientProxy: ClientProxy;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeService,
        {
          provide: getRepositoryToken(Edge),
          useValue: mockRepository,
        },
        {
          provide: 'RABBITMQ_SERVICE', // Mock the RabbitMQ client
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
    repository = module.get<Repository<Edge>>(getRepositoryToken(Edge));
    clientProxy = module.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of edges', async () => {
      const result = [
        {
          id: '1',
          node1_alias: 'alice',
          node2_alias: 'bob',
          capacity: 50000,
        },
      ];
      mockRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single edge', async () => {
      const result = {
        id: '1',
        node1_alias: 'alice',
        node2_alias: 'bob',
        capacity: 50000,
      };
      mockRepository.findOne.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when edge not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a new edge and emit the edge object in a message.', async () => {
      const createEdgeInput: CreateEdgeInput = {
        node1_alias: 'alice',
        node2_alias: 'bob',
      };

      const createdEdge = {
        id: '1',
        ...createEdgeInput,
        capacity: 50000,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(createdEdge);
      mockRepository.save.mockResolvedValue(createdEdge);

      const result = await service.create(createEdgeInput);

      expect(repository.create).toHaveBeenCalledWith({
        ...createEdgeInput,
        capacity: expect.any(Number),
      });
      expect(repository.save).toHaveBeenCalledWith(createdEdge);
      expect(clientProxy.emit).toHaveBeenCalledWith('edge.created', expect.objectContaining({
        id: createdEdge.id,
        node1_alias: createEdgeInput.node1_alias,
        node2_alias: createEdgeInput.node2_alias,
        capacity: expect.any(Number),
      }));
      expect(result).toBe(createdEdge);
    });

    it('should generate capacity between 10000 and 1000000', async () => {
      const createEdgeInput: CreateEdgeInput = {
        node1_alias: 'alice',
        node2_alias: 'bob',
      };

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockResolvedValue({});

      await service.create(createEdgeInput);

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.capacity).toBeGreaterThanOrEqual(10000);
      expect(createCall.capacity).toBeLessThanOrEqual(1000000);
    });
  });
});
