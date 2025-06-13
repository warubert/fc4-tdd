
import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { Property } from "../../domain/entities/property";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.name) {
        return res
          .status(400)
          .json({ message: 'O nome da propriedade é obrigatório.' });
      }

      if (!req.body.basePricePerNight) {
        return res
          .status(400)
          .json({ message: 'O preço base por noite é obrigatório.' });
      }

      const property = new Property (
        req.body.id,
        req.body.name,
        req.body.description,
        req.body.maxGuests,
        req.body.basePricePerNight
      );

      await this.propertyService.createProperty(property);
      const createdProperty = await this.propertyService.findPropertyById(property.getId());

      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: createdProperty!.getId(),
          name: createdProperty!.getName(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}
