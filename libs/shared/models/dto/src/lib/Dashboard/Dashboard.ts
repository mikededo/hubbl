import {
  Event,
  EventTemplate,
  GymZone,
  Trainer,
  VirtualGym
} from '@hubbl/shared/models/entities';

import EventDTO from '../Event';
import EventTemplateDTO from '../EventTemplate';
import GymZoneDTO from '../GymZone';
import TrainerDTO from '../Trainer';
import VirtualGymDTO from '../VirtualGym';

type FromClassProps = {
  virtualGyms: VirtualGym[];
  gymZones: GymZone[];
  todayEvents: Event[];
  events: Event[];
  trainers?: Trainer[];
  templates?: EventTemplate[];
};

class DashboardDTO {
  virtualGyms!: VirtualGymDTO[];

  gymZones!: GymZoneDTO[];

  todayEvents!: EventDTO[];

  events!: EventDTO[];

  trainers!: TrainerDTO<number>[] | undefined;

  templates!: EventTemplateDTO[] | undefined;

  public static fromClass({
    virtualGyms,
    gymZones,
    todayEvents,
    events,
    templates,
    trainers
  }: FromClassProps): DashboardDTO {
    const dashboard = new DashboardDTO();

    dashboard.virtualGyms = virtualGyms.map(VirtualGymDTO.fromClass);
    dashboard.gymZones = gymZones.map(GymZoneDTO.fromClass);
    dashboard.todayEvents = todayEvents.map(EventDTO.fromClass);
    dashboard.events = events.map(EventDTO.fromClass);
    dashboard.trainers = trainers
      ? trainers.map((t) => TrainerDTO.fromClass(t) as TrainerDTO<number>)
      : undefined;
    dashboard.templates = templates
      ? templates.map(EventTemplateDTO.fromClass)
      : undefined;

    return dashboard;
  }
}

export default DashboardDTO;
