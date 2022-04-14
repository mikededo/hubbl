import { Gym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class GymService extends BaseService<Gym> {
  constructor() {
    super(Gym);
  }
}
