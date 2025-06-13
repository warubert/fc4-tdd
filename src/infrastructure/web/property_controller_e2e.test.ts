import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyController } from "./property_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "../repositories/typeorm_booking_repository";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserService } from "../../application/services/user_service";
import { BookingService } from "../../application/services/booking_service";
const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;

let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  bookingRepository = new TypeORMBookingRepository(
      dataSource.getRepository(BookingEntity)
    );

  userRepository = new TypeORMUserRepository(
      dataSource.getRepository(UserEntity)
    );

  propertyService = new PropertyService(propertyRepository);
  userService = new UserService(userRepository);
  bookingService = new BookingService(
    bookingRepository,
    propertyService,
    userService
  );


  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);

    await propertyRepo.clear();
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      id: "1",
      name: "Casa de Praia",
      description: "Uma linda casa de praia com vista para o mar.",
      maxGuests: 6,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property).toHaveProperty("name");
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      id: "1",
      name: "",
      description: "Uma linda casa de praia com vista para o mar.",
      maxGuests: 6,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('O nome da propriedade é obrigatório.');
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post("/properties").send({
      id: "1",
      description: "Uma linda casa de praia com vista para o mar.",
      name: "Casa de Praia",
      maxGuests: 0,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('A capacidade máxima deve ser maior que zero.');
  })

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      id: "1",
      description: "Uma linda casa de praia com vista para o mar.",
      name: "Casa de Praia",
      maxGuests: 6,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('O preço base por noite é obrigatório.');
  })
});
