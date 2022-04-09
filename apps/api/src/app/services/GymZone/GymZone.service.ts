import { GymZone } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class GymZoneService extends BaseService<GymZone> {
  constructor() {
    super(GymZone);
  }
}
