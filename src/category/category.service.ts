import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) { }

  async create(newCategory: any) {
    const createdCategory = new this.categoryModel(newCategory);
    return await createdCategory.save();
  }

  async findAll() {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, category: any) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      category,
      { new: true },
    ).exec();

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return updatedCategory;
  }

  async remove(id: number) {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return deletedCategory;
  }

  async seedCategories() {
    const categories = [
      { name: 'Women', children: [
        { name: 'Clothing', children: [
          { name: 'Dresss', children: [
            { name: 'Causal Dresses' },
            { name: 'Party Dresses' },
          ]},
        ]},
        { name: 'T-Shirts', children: [
          { name: 'Printed T-shirts' },
          { name: 'Causal T-Shirts' },
          { name: 'Plain T-Shirts' },
        ]},
      ]},
      { name: 'Men', children: [
        { name: 'Footwear', children: [
          { name: 'Branded' },
          { name: 'Non Branded' },
        ]},
        { name: 'T-Shirts', children: [
          { name: 'Printed T-shirts' },
          { name: 'Causal T-Shirts' },
          { name: 'Plain T-Shirts' },
        ]},
        { name: 'Shirts', children: [
          { name: 'Party Shirts' },
          { name: 'Causal Shirts' },
          { name: 'Plain Shirts' },
        ]},
      ]},
    ];

    for (const category of categories) {
      await this.createCategory(category, null);
    }

    console.log('Categories seeded successfully');
    return {message: 'Categories seeded successfully'};
  }

  private async createCategory(category: any, parentId: any) {
    const createdCategory = await this.categoryModel.create({
      name: category.name,
      parentId: parentId,
    });

    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.createCategory(child, createdCategory._id);
      }
    }
  }
}
