import { Trainer } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class TrainerService extends BaseService<Trainer> {
  constructor() {
    super(Trainer);
  }
}
