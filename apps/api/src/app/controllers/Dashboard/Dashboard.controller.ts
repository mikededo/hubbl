import { Request, Response } from 'express';
import { SelectQueryBuilder } from 'typeorm';

import { DashboardDTO } from '@hubbl/shared/models/dto';
import {
  CalendarDate,
  Event,
  EventTemplate,
  GymZone,
  Trainer,
  VirtualGym
} from '@hubbl/shared/models/entities';

import {
  EventService,
  EventTemplateService,
  GymService,
  GymZoneService,
  PersonService,
  TrainerService,
  VirtualGymService
} from '../../services';
import BaseController from '../Base';

class IFetchDashboardController extends BaseController {
  protected personService: PersonService = undefined;
  protected gymService: GymService = undefined;
  protected virtualGymService: VirtualGymService = undefined;
  protected gymZoneService: GymZoneService = undefined;
  protected eventService: EventService = undefined;
  protected eventTemplateService: EventTemplateService = undefined;
  protected trainerService: TrainerService = undefined;

  private currentDate(): Partial<CalendarDate> {
    const date = new Date();

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  private virtualGymsQuery(id: number): SelectQueryBuilder<VirtualGym> {
    return this.virtualGymService
      .createQueryBuilder({ alias: 'vg' })
      .where('vg.gym = :gymId', { gymId: +id })
      .limit(5)
      .orderBy('vg.updated_at', 'DESC');
  }

  private gymZonesQuery(id: number): SelectQueryBuilder<GymZone> {
    return this.gymZoneService
      .createQueryBuilder({ alias: 'gz' })
      .innerJoin('gz.virtualGym', 'vg', 'vg.gym = :gymId', { gymId: +id })
      .loadAllRelationIds()
      .limit(5)
      .orderBy('gz.updated_at', 'DESC');
  }

  private trainersQuery(id: number): SelectQueryBuilder<Trainer> {
    return this.trainerService
      .createQueryBuilder({ alias: 't' })
      .leftJoinAndSelect('t.person', 'p')
      .where('p.gym = :gymId', { gymId: +id })
      .limit(5)
      .orderBy('t.updated_at', 'DESC');
  }

  private todayEventsQuery(id: number): SelectQueryBuilder<Event> {
    const date = this.currentDate();

    return this.eventService
      .createQueryBuilder({ alias: 'e' })
      .leftJoinAndSelect('e.date', 'd')
      .where('e.gym = :gymId', { gymId: +id })
      .andWhere('d.year = :year', { year: date.year })
      .andWhere('d.month = :month', { month: date.month })
      .andWhere('d.day = :day', { day: date.day })
      .orderBy('e.updated_at', 'DESC')
      .loadRelationCountAndMap(
        'e.appointmentCount',
        'e.appointments',
        'ea',
        (qb) => qb.where('ea.cancelled = false')
      );
  }

  private eventsQuery(id: number, client: boolean): SelectQueryBuilder<Event> {
    const date = this.currentDate();

    return this.eventService
      .createQueryBuilder({ alias: 'e' })
      .leftJoinAndSelect('e.date', 'd')
      .where('e.gym = :gymId', { gymId: +id })
      .andWhere('d.year >= :year', { year: date.year })
      .andWhere('d.month >= :month', { month: date.month })
      .andWhere('d.day >= :day', { day: date.day })
      .limit(client ? 15 : 5)
      .orderBy('e.updated_at', 'DESC');
  }

  private templatesQuery(id: number): SelectQueryBuilder<EventTemplate> {
    return this.eventTemplateService
      .createQueryBuilder({ alias: 'et' })
      .where('et.gym = :gymId', { gymId: +id })
      .limit(5)
      .orderBy('et.updated_at', 'DESC');
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.personService) {
      this.personService = new PersonService();
    }

    if (!this.gymService) {
      this.gymService = new GymService();
    }

    if (!this.virtualGymService) {
      this.virtualGymService = new VirtualGymService();
    }

    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService();
    }

    if (!this.eventService) {
      this.eventService = new EventService();
    }

    if (!this.eventTemplateService) {
      this.eventTemplateService = new EventTemplateService();
    }

    if (!this.trainerService) {
      this.trainerService = new TrainerService();
    }

    const { id } = req.params;
    if (!id) {
      return this.clientError(res, 'No gym id given.');
    }

    // Check if the gym exists
    try {
      const exists = await this.gymService.findOne({
        where: { id: +id },
        select: ['id'],
        loadEagerRelations: false
      });
      if (!exists) {
        return this.forbidden(res, 'Gym does not exist.');
      }
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }

    const { token } = res.locals;

    // Check if the user has access to the gym
    try {
      const access = await this.personService.findOne({
        where: { id: token.id, gym: +id },
        loadEagerRelations: false,
        select: ['id']
      });

      if (!access) {
        return this.unauthorized(
          res,
          'User does not have access to the given gym.'
        );
      }
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }

    try {
      const client = token.user === 'client';

      // Run all the queries
      const result = await Promise.all([
        this.virtualGymsQuery(+id).getMany(),
        this.gymZonesQuery(+id).getMany(),
        this.todayEventsQuery(+id).getMany(),
        this.eventsQuery(+id, client).getMany(),
        !client ? this.trainersQuery(+id).getMany() : undefined,
        !client ? this.templatesQuery(+id).getMany() : undefined
      ]);

      return this.ok(
        res,
        DashboardDTO.fromClass({
          virtualGyms: result[0],
          gymZones: result[1],
          todayEvents: result[2],
          events: result[3],
          trainers: result[4],
          templates: result[5]
        })
      );
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchInstance = new IFetchDashboardController();

export const FetchDashboardController = fetchInstance;
