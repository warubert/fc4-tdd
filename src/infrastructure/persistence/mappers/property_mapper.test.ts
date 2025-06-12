import { PropertyMapper } from "./property_mapper";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

describe("PropertyMapper", () => {
    it("deve converter PropertyEntity em Property corretamente", () => {
      const entity: PropertyEntity = {
        id: "1",
        name: "Casa",
        description: "Casa de praia",
        maxGuests: 4,
        basePricePerNight: 150,
        bookings: []
      };

      const domain = PropertyMapper.toDomain(entity);

      expect(domain).toBeInstanceOf(Property);
      expect(domain.getId()).toBe("1");
      expect(domain.getName()).toBe("Casa");
      expect(domain.getDescription()).toBe("Casa de praia");
      expect(domain.getMaxGuests()).toBe(4);
      expect(domain.getBasePricePerNight()).toBe(150);
    });

    it("deve converter Property para PropertyEntity corretamente", () => {
      const domain = new Property(
        "1",
        "Casa",
        "Casa de praia",
        4,
        150
      );

      const entity = PropertyMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(PropertyEntity);
      expect(entity.id).toBe("1");
      expect(entity.name).toBe("Casa");
      expect(entity.description).toBe("Casa de praia");
      expect(entity.maxGuests).toBe(4);
      expect(entity.basePricePerNight).toBe(150);
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const entity: Partial<PropertyEntity> = {
      id: "1",
      name: "Casa",
      maxGuests: 2,
      basePricePerNight: 100
    };

    expect(() => PropertyMapper.toDomain(entity as PropertyEntity)).toThrow("PropertyEntity Inválido: Campos faltando");
  });
});

