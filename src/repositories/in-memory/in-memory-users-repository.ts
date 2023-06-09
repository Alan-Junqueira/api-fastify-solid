import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(item => item.id === id);

    return user || null
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email);

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      created_at: new Date(),
      email: data.email,
      password_hash: data.password_hash
    }

    this.items.push(user)

    return user
  }

}

