import { Request, Response } from "express";
import { validate } from "class-validator";
import { transactionRepository } from "../repositories/transactionRepository";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    const { id } = req.user;
    const { title, description, value, date, type, categorie } = req.body;

    if (!title || !value || !date || !type || !categorie)
      throw new BadRequestError("Parâmetros faltando.");

    const user = await userRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const transaction = transactionRepository.create({
      title,
      description,
      value,
      date,
      type,
      categorie,
      user,
    });

    const errors = await validate(transaction);

    if (errors.length > 0) {
      throw new BadRequestError("Ocorreu um erro ao criar uma nova transação.");
    }

    await transactionRepository.save(transaction);

    res.status(200).json({ message: "Transação criada com sucesso." });
  }

  async getAllTransactions(req: Request, res: Response) {
    const { id } = req.user;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const transactions = await transactionRepository.find({
      relations: { user: false },
      where: { user: { id: user.id } },
    });

    res.json(transactions);
  }

  async getTransactionById(req: Request, res: Response) {
    const { id } = req.user;
    const { transactionId } = req.params;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const transaction = await transactionRepository.findOneBy({
      user: { id: id },
      id: Number(transactionId),
    });

    if (!transaction) throw new NotFoundError("Transação não encontrada.");

    res.status(200).json(transaction);
  }

  async updateTransaction(req: Request, res: Response) {
    const { id } = req.user;
    const { transactionId } = req.params;
    const { title, description, value, date, type, categorie } = req.body;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const transaction = await transactionRepository.findOneBy({
      user: { id: id },
      id: Number(transactionId),
    });

    if (!transaction) throw new NotFoundError("Transação não encontrada.");

    transaction.title = title || transaction.title;
    transaction.description = description || transaction.description;
    transaction.value = value || transaction.value;
    transaction.date = date || transaction.date;
    transaction.type = type || transaction.type;
    transaction.categorie = categorie || transaction.categorie;

    transaction.user = user;

    const errors = await validate(transaction);

    if (errors.length > 0) {
      throw new BadRequestError("Ocorreu um erro ao atualizar a transação.");
    }

    await transactionRepository.save(transaction);

    res.status(200).json({ message: "Transação alterada com sucesso" });
  }

  async deleteTransaction(req: Request, res: Response) {
    const { id } = req.user;
    const { transactionId } = req.params;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const transaction = await transactionRepository.findOneBy({
      user: { id: id },
      id: Number(transactionId),
    });

    if (!transaction) throw new NotFoundError("Transação não encontrada.");

    await transactionRepository.remove(transaction);

    res.status(200).json({ message: "Transação deletada com sucesso." });
  }
}
