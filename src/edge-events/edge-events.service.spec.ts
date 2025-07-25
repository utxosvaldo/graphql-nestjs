// events/edge-events.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EdgeEventsService } from './edge-events.service';
import { Edge } from '../edge/entities/edge.entity';

describe('EdgeEventsService', () => {
  let service: EdgeEventsService;
  let repository: Repository<Edge>;

  const mockRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeEventsService,
        {
          provide: getRepositoryToken(Edge),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EdgeEventsService>(EdgeEventsService);
    repository = module.get<Repository<Edge>>(getRepositoryToken(Edge));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAliases', () => {
    it('should successfully update edge aliases', async () => {
      const edgeId = 'test-id';
      const updateData = {
        node1_alias: 'alice-updated',
        node2_alias: 'bob-updated',
      };

      // Mock successful update (1 row affected)
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateAliases(edgeId, updateData);

      expect(repository.update).toHaveBeenCalledWith(edgeId, updateData);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when edge not found', async () => {
      const edgeId = 'non-existent-id';
      const updateData = {
        node1_alias: 'alice-updated',
        node2_alias: 'bob-updated',
      };

      // Mock no rows affected (edge not found)
      mockRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.updateAliases(edgeId, updateData))
        .rejects
        .toThrow(NotFoundException);

      expect(repository.update).toHaveBeenCalledWith(edgeId, updateData);
    });

    it('should call repository.update with correct parameters', async () => {
      const edgeId = '123-456-789';
      const updateData = {
        node1_alias: 'test-node1-updated',
        node2_alias: 'test-node2-updated',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateAliases(edgeId, updateData);

      expect(repository.update).toHaveBeenCalledWith('123-456-789', {
        node1_alias: 'test-node1-updated',
        node2_alias: 'test-node2-updated',
      });
    });
  });
});
