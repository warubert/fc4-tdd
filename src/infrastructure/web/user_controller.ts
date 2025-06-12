
import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
import { User } from "../../domain/entities/user";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.name) {
        return res
          .status(400)
          .json({ message: 'O campo nome é obrigatório.' });
      }
      const user = new User (
        req.body.id,
        req.body.name,
      );

      await this.userService.createUser(user);
      const createdUser = await this.userService.findUserById(user.getId());

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: createdUser!.getId(),
          name: createdUser!.getName(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }

  // async cancelBooking(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const bookingId = req.params.id;
  //     await this.bookingService.cancelBooking(bookingId);

  //     return res
  //       .status(200)
  //       .json({ message: "Reserva cancelada com sucesso." });
  //   } catch (error: any) {
  //     return res.status(400).json({ message: "Reserva não encontrada." });
  //   }
  // }
}
