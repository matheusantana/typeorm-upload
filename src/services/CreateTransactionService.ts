import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoriesRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const repository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    const { total } = await repository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    const transactionCategory = await categoryRepository.getCategoryByTitle(
      category,
    );

    const transaction = repository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await repository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
