import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const rep = getCustomRepository(TransactionsRepository);
  return response.json(rep.getBalance());
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const service = new CreateTransactionService();
  const transaction = service.execute({ title, value, type, category });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const service = new DeleteTransactionService();
  service.execute(id);
  return response.status(200);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
