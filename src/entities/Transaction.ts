import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

type TransactionTypes = "revenue" | "expense";
type TransactionCategories =
  | "wage"
  | "investment"
  | "gift"
  | "rent"
  | "bills"
  | "subscriptions"
  | "food"
  | "trip";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 20 })
  title: string;

  @Column({ type: "varchar", length: 320, nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  value: number;

  @Column({ type: "datetime" })
  @Index()
  date: Date;

  @Column({ type: "enum", enum: ["revenue", "expense"], default: "revenue" })
  type: TransactionTypes;

  @Column({
    type: "enum",
    enum: [
      "wage",
      "investment",
      "gift",
      "rent",
      "bills",
      "subscriptions",
      "food",
      "trip",
    ],
    default: "wage",
  })
  categorie: TransactionCategories;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
