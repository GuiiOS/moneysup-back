import { Request, Response } from "express";
import { validate } from "class-validator";
import { userRepository } from "../repositories/userRepository";
import {
  AlreadyExist,
  BadRequestError,
  NotFoundError,
} from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transactionRepository } from "../repositories/transactionRepository";

type rUser = {
  id: number;
  nickName: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export class UserController {
  async createUser(req: Request, res: Response) {
    const { nickName, email, password } = req.body;

    if (!nickName || !email || !password)
      throw new BadRequestError("Parametros faltando.");

    const verifyUser = await userRepository.findOneBy({ email: email });

    if (verifyUser) throw new AlreadyExist("Email já cadastrado.");

    const hashPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      nickName,
      email,
      password: hashPassword,
    });

    const errors = await validate(user);

    if (errors.length > 0) {
      const validationErrorMessage = errors[0].constraints?.isEmail;
      throw new BadRequestError(
        validationErrorMessage || "Ocorreu um erro ao criar um novo usuário."
      );
    }

    await userRepository.save(user);

    res.status(200).json({ message: "Usuário criado com sucesso." });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "8h",
    });

    const { password: _, ...userLogin } = user;

    return res.json({
      user: userLogin,
      token: token,
    });
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const rUser: rUser = {
      id: user.id,
      nickName: user.nickName,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.status(200).json(rUser);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.user;

    const { nickName, email, password } = req.body;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    user.nickName = nickName || user.nickName;
    user.email = email || user.email;
    user.password = password || user.password;

    const errors = await validate(user);

    if (errors.length > 0) {
      const validationErrorMessage = errors[0].constraints?.isEmail;
      throw new BadRequestError(
        validationErrorMessage || "Ocorreu um erro ao criar um novo usuário."
      );
    }

    await userRepository.save(user);

    res.status(200).json({ message: "Usuário alterado com sucesso." });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.user;

    const user = await userRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const transactions = await transactionRepository.find({
      relations: { user: false },
      where: { user: { id: user.id } },
    });

    if (transactions.length > 0) {
      for (const tr of transactions) {
        await transactionRepository.remove(tr);
      }
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "Usuário deletado com sucesso." });
  }
}
