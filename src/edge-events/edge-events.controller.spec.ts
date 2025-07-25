// events/edge-events.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EdgeEventsController } from './edge-events.controller';
import { EdgeEventsService } from './edge-events.service';
import { Edge } from '../edge/entities/edge.entity';

describe('EdgeEventsController', () => {
  let controller: EdgeEventsController;
  let service: EdgeEventsService;

  const mockEdgeEventsService = {
    updateAliases: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgeEventsController],
      providers: [
        {
          provide: EdgeEventsService,
          useValue: mockEdgeEventsService,
        },
      ],
    }).compile();

    controller = module.get<EdgeEventsController>(EdgeEventsController);
    service = module.get<EdgeEventsService>(EdgeEventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleEdgeCreated', () => {
    const mockEdgeData: Edge = {
      id: 'test-id-123',
      node1_alias: 'alice',
      node2_alias: 'bob',
      capacity: 50000,
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      get edge_peers() {
        return `${this.node1_alias}-${this.node2_alias}`;
      },
    };

    it('should handle edge created event successfully', async () => {
      // Mock console.log to verify the output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mock successful update (1 row affected)
      mockEdgeEventsService.updateAliases.mockResolvedValue({ affected: 1 });

      await controller.handleEdgeCreated(mockEdgeData);

      // Verify console log output matches the exact format
      expect(consoleSpy).toHaveBeenCalledWith(
        'New channel between alice and bob with a capacity of 50000 has been created.'
      );

      // Verify service was called with correct parameters
      expect(service.updateAliases).toHaveBeenCalledWith('test-id-123', {
        node1_alias: 'alice-updated',
        node2_alias: 'bob-updated',
      });

      // Verify no exception was thrown
      expect(service.updateAliases).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });

    it('should throw NotFoundException when edge not found for update', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mock update with no rows affected (edge not found)
      mockEdgeEventsService.updateAliases.mockResolvedValue({ affected: 0 });

      await expect(controller.handleEdgeCreated(mockEdgeData))
        .rejects
        .toThrow(NotFoundException);

      await expect(controller.handleEdgeCreated(mockEdgeData))
        .rejects
        .toThrow('Edge with ID test-id-123 not found for update');

      // Verify console log still happened before the error
      expect(consoleSpy).toHaveBeenCalledWith(
        'New channel between alice and bob with a capacity of 50000 has been created.'
      );

      // Verify service was called
      expect(service.updateAliases).toHaveBeenCalledWith('test-id-123', {
        node1_alias: 'alice-updated',
        node2_alias: 'bob-updated',
      });

      consoleSpy.mockRestore();
    });

    it('should format console message correctly with different node aliases', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const customEdgeData: Edge = {
        id: 'different-id',
        node1_alias: 'lightning-node-1',
        node2_alias: 'lightning-node-2',
        capacity: 750000,
        created_at: new Date(),
        updated_at: new Date(),
        get edge_peers() {
          return `${this.node1_alias}-${this.node2_alias}`;
        },
      };

      mockEdgeEventsService.updateAliases.mockResolvedValue({ affected: 1 });

      await controller.handleEdgeCreated(customEdgeData);

      expect(consoleSpy).toHaveBeenCalledWith(
        'New channel between lightning-node-1 and lightning-node-2 with a capacity of 750000 has been created.'
      );

      expect(service.updateAliases).toHaveBeenCalledWith('different-id', {
        node1_alias: 'lightning-node-1-updated',
        node2_alias: 'lightning-node-2-updated',
      });

      consoleSpy.mockRestore();
    });
  });
});
