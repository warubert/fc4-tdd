import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(property: Property): Promise<void> {
    const existingProperty = await this.propertyRepository.findById(property.getId());
    if (existingProperty) {
      throw new Error("Propriedade já existe com este ID.");
    }
    await this.propertyRepository.save(property);
  }
}
