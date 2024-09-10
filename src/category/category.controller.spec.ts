import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategory = { _id: '1', name: 'Women' };
  const mockCategoryArray = [mockCategory, { _id: '2', name: 'Men' }];

  const mockCategoriesService = {
    create: jest.fn().mockResolvedValue(mockCategory),
    findAll: jest.fn().mockResolvedValue(mockCategoryArray),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    update: jest.fn().mockResolvedValue(mockCategory),
    remove: jest.fn().mockResolvedValue(mockCategory),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto = { name: 'Women' };
    const result = await controller.create(createCategoryDto);
    expect(result).toEqual(mockCategory);
    expect(service.create).toHaveBeenCalledWith(createCategoryDto);
  });

  it('should return all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockCategoryArray);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single category by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockCategory);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a category', async () => {
    const updateCategoryDto = { name: 'Updated Women' };
    const result = await controller.update('1', updateCategoryDto);
    expect(result).toEqual(mockCategory);
    expect(service.update).toHaveBeenCalledWith('1', updateCategoryDto);
  });

  it('should delete a category', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(mockCategory);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
