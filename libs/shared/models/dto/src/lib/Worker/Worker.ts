import { genSalt, hash } from 'bcrypt';
import {
  IsBoolean,
  IsNumber,
  IsString,
  validateOrReject
} from 'class-validator';

import { Gym, Person, Worker } from '@gymman/shared/models/entities';
import { Gender } from '@gymman/shared/types';

import PersonDTO, { PersonDTOVariants } from '../Person';
import {
  booleanError,
  numberError,
  stringError,
  validationParser
} from '../util';

export default class WorkerDTO<T extends Gym | number> extends PersonDTO<T> {
  @IsNumber(
    {},
    { message: numberError('managerId'), groups: [PersonDTOVariants.REGISTER] }
  )
  managerId!: number;

  @IsString({ message: stringError('workerCode'), groups: ['all'] })
  workerCode!: string;

  @IsBoolean({ message: booleanError('updateVirtualGyms') })
  updateVirtualGyms!: boolean;

  @IsBoolean({ message: booleanError('createGymZones') })
  createGymZones!: boolean;

  @IsBoolean({ message: booleanError('updateGymZones') })
  updateGymZones!: boolean;

  @IsBoolean({ message: booleanError('deleteGymZones') })
  deleteGymZones!: boolean;

  @IsBoolean({ message: booleanError('createTrainers') })
  createTrainers!: boolean;

  @IsBoolean({ message: booleanError('updateTrainers') })
  updateTrainers!: boolean;

  @IsBoolean({ message: booleanError('deleteTrainers') })
  deleteTrainers!: boolean;

  @IsBoolean({ message: booleanError('createEvents') })
  createEvents!: boolean;

  @IsBoolean({ message: booleanError('updateEvents') })
  updateEvents!: boolean;

  @IsBoolean({ message: booleanError('deleteEvents') })
  deleteEvents!: boolean;

  @IsBoolean({ message: booleanError('createEventTypes') })
  createEventTypes!: boolean;

  @IsBoolean({ message: booleanError('updateEventTypes') })
  updateEventTypes!: boolean;

  @IsBoolean({ message: booleanError('deleteEventTypes') })
  deleteEventTypes!: boolean;

  private static mapWorkerProps<T extends Gym | number>(
    to: WorkerDTO<T>,
    from: any
  ): void {
    to.managerId = from.managerId;
    to.workerCode = from.workerCode;
    to.updateVirtualGyms = from.updateVirtualGyms;
    to.createGymZones = from.createGymZones;
    to.updateGymZones = from.updateGymZones;
    to.deleteGymZones = from.deleteGymZones;
    to.createTrainers = from.createTrainers;
    to.updateTrainers = from.updateTrainers;
    to.deleteTrainers = from.deleteTrainers;
    to.createEvents = from.createEvents;
    to.updateEvents = from.updateEvents;
    to.deleteEvents = from.deleteEvents;
    to.createEventTypes = from.createEventTypes;
    to.updateEventTypes = from.updateEventTypes;
    to.deleteEventTypes = from.deleteEventTypes;
  }

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @param variant The variant of the DTO
   * @returns The parsed `WorkerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: PersonDTOVariants
  ): Promise<WorkerDTO<T>> {
    const result = new WorkerDTO<T>();

    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.gym = json.gym;
    result.gender = json.gender;

    // Worker props
    WorkerDTO.mapWorkerProps(result, json);

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [variant]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO
   *
   * @param worker The fetched worker
   * @param gym The gym to assign to the DTO
   * @returns The dto  to be send as a response
   */
  public static async fromClass(
    worker: Worker,
    gym: Gym
  ): Promise<WorkerDTO<Gym>> {
    const result = new WorkerDTO<Gym>();
    // Person props
    result.id = worker.person.id;
    result.email = worker.person.email;
    result.password = worker.person.password;
    result.firstName = worker.person.firstName;
    result.lastName = worker.person.lastName;
    result.gym = gym;
    result.theme = worker.person.theme;
    result.gender = worker.person.gender as Gender;

    // Worker props
    WorkerDTO.mapWorkerProps(result, worker);

    await validateOrReject(result, {
      validationError: { target: false },
      groups: ['all']
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   *
   * @returns The parsed worker from the DTO
   */
  public async toClass(): Promise<Worker> {
    const worker = new Worker();
    const person = new Person();

    // Set person fields
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.email = this.email;

    // Encrypt password
    const salt = await genSalt(10);
    person.password = await hash(this.password, salt);

    person.gender = this.gender;
    person.gym = this.gym;

    // Set person into worker
    worker.person = person;

    // Set worker props
    worker.updateVirtualGyms = this.updateVirtualGyms;
    worker.createGymZones = this.createGymZones;
    worker.updateGymZones = this.updateGymZones;
    worker.deleteGymZones = this.deleteGymZones;
    worker.createTrainers = this.createTrainers;
    worker.updateTrainers = this.updateTrainers;
    worker.deleteTrainers = this.deleteTrainers;
    worker.createEvents = this.createEvents;
    worker.updateEvents = this.updateEvents;
    worker.deleteEvents = this.deleteEvents;
    worker.createEventTypes = this.createEventTypes;
    worker.updateEventTypes = this.updateEventTypes;
    worker.deleteEventTypes = this.deleteEventTypes;

    return worker;
  }
}
