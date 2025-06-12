import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<void> {
    const existingUser = await this.userRepository.findById(user.getId());
    if (existingUser) {
      throw new Error("Usuário já existe com este ID.");
    }
    
    return await this.userRepository.save(user);
  }
}
