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
    let category = await this.findOne({ where: { title } });

    if (!category) {
      category = this.create({ title });
      await this.save(category);
    }

    return category;
  }
}

export default CategoryRepository;
