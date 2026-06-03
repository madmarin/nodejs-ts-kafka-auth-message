import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { User } from "../user";

@Entity({ name: "Messages" })
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "sender_id" })
  sender_id: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "recipient_id" })
  recipient_id: User;

  @Column({ type: "text" })
  message: string;

  @CreateDateColumn({
    name: "created_time",
    type: "timestamp",
  })
  created_time: Date;
}
