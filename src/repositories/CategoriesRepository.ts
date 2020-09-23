import { EntityRepository, Repository, In } from 'typeorm';

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

  private async createNewCategoires(
    categoriesToCreate: string[],
    categoriesFromDb: Category[],
  ): Promise<Category[]> {
    let newCategories: Category[] = [];
    const existingCategoriesTitle = categoriesFromDb.map(
      (category: Category) => category.title,
    );
    const getNewUniqueCategoires = categoriesToCreate
      .filter(category => !existingCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    newCategories = this.create(
      getNewUniqueCategoires.map(title => ({
        title,
      })),
    );

    await this.save(newCategories);

    return newCategories;
  }

  public async getCategories(categories: string[]): Promise<Category[]> {
    let categoriesFromDb: Category[] = [];
    categoriesFromDb = await this.find({
      where: {
        title: In(categories),
      },
    });

    const newCategories = await this.createNewCategoires(
      categories,
      categoriesFromDb,
    );

    const finalCategories = [...newCategories, ...categoriesFromDb];
    return finalCategories;
  }
}

export default CategoryRepository;
