import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategoryByTitle(title: string): Promise<Category> {
    const category = await this.findOne({ where: { title } });

    if (category) {
      return category;
    }
    const createdCategory = this.create({ title: category });
    this.save(createdCategory);
    return createdCategory;
  }
}

export default CategoryRepository;
