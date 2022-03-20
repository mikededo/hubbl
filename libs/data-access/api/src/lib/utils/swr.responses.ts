import {
  EventDTO,
  EventTemplateDTO,
  GymZoneDTO,
  TrainerDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';

/**
 * Dashboard fetcher response
 */
export type DashboardResponse = {
  virtualGyms: VirtualGymDTO[];

  gymZones: GymZoneDTO[];

  events: EventDTO[];

  todayEvents: EventDTO[];

  templates: EventTemplateDTO[];

  trainers: TrainerDTO<number>[];
};
