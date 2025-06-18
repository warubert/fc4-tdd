import { BookingMapper } from "./booking_mapper";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { Booking } from "../../../domain/entities/booking";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";

describe("BookingMapper", () => {
    it("deve converter BookingEntity em Booking corretamente", () => {
      const propertyEntity: PropertyEntity = {
        id: "1",
        name: "Casa",
        description: "Casa de praia",
        maxGuests: 4,
        basePricePerNight: 150,
        bookings: []
      };

      const userEntity: UserEntity = {
        id: "1",
        name: "João"
      }

      const bookingEntity: BookingEntity = {
        id: "1",
        property: propertyEntity,
        guest: userEntity,
        startDate: new Date("2025-12-20"),
        endDate: new Date("2025-12-25"),
        guestCount: 2,
        totalPrice: 600,
        status: "CONFIRMED"
      };
      
      const bookingDomain = BookingMapper.toDomain(bookingEntity);
      
      expect(bookingDomain).toBeInstanceOf(Booking);
      expect(bookingDomain.getId()).toBe("1");
    });
    
    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
      const propertyEntity: PropertyEntity = {
        id: "1",
        name: "Casa",
        description: "Casa de praia",
        maxGuests: 4,
        basePricePerNight: 150,
        bookings: []
      };

      const userEntity: UserEntity = {
        id: "1",
        name: "João"
      }

      const entity: Partial<BookingEntity> = {
        id: "1",
        property: propertyEntity,
        guest: userEntity,
        startDate: new Date("2025-12-20"),
        endDate: new Date("2025-12-25"),
      };

      expect(() => BookingMapper.toDomain(entity as BookingEntity)).toThrow("BookingEntity Inválido: Campos faltando");
    });

    it("deve converter Booking para BookingEntity corretamente", () => {
      const property = new Property(
        "1",
        "Casa",
        "Casa de praia",
        4,
        150
      );

      const user = new User(
        "1",
        "João"
      )

      const dateRange = new DateRange(
        new Date("2025-12-20"),
        new Date("2025-12-25")
      );

      const domain = new Booking(
        "1",
        property,
        user,
        dateRange,
        2
      );

      const entity = BookingMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(BookingEntity);
      expect(entity.id).toBe("1");
    });

});

