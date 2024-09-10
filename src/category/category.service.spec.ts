import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import mongoose, { Mongoose } from 'mongoose';
import { NotFoundException } from '@nestjs/common';


describe('CategoryService', () => {
  let service: CategoryService;
  let model: any;
  const id = new mongoose.Types.ObjectId();

  const mockCategory = {
    _id: id,
    name: 'Category 1',
    parentId: null,
  };

  const categoryArray = [
    mockCategory
  ];

  // Mock the constructor and save method for the category model
  const mockCategoryModel: any = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(mockCategory),
  }));

  // Mock static methods on the model
  mockCategoryModel.find = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(categoryArray) });
  mockCategoryModel.findById = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) });
  mockCategoryModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) });
  mockCategoryModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCategory) });
  mockCategoryModel.exec = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel
        }
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto = {
      name: 'Category 1',
      parentId: null
    };
    
    const result = await service.create(createCategoryDto);
    expect(result).toEqual(mockCategory);
    expect(model).toHaveBeenCalledWith(createCategoryDto); 
  });

  it('should return a single category by ID', async () => {
    const result = await service.findOne(id);
    expect(result).toEqual(mockCategory);
  });

  it('should throw an error if category not found', async () => {
    model.findById.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.findOne('invalid_id')).rejects.toThrow(NotFoundException);
  });

  it('should return all categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual(categoryArray);
    expect(model.find).toHaveBeenCalled();
  });

  it('should update a category', async () => {
    const updateCategoryDto = { name: 'Updated category' };
    const result = await service.update(id, updateCategoryDto);
    expect(result).toEqual(mockCategory);
    expect(model.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should delete a category', async () => {
    const result = await service.remove(id);
    expect(result).toEqual(mockCategory);
    expect(model.findByIdAndDelete).toHaveBeenCalled();
  });

  it('should throw an error if category to delete is not found', async () => {
    model.findByIdAndDelete.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.remove('invalid_id')).rejects.toThrow(NotFoundException);
  });
});
