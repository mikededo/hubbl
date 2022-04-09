import { TrainerTag } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class TrainerTagService extends BaseService<TrainerTag> {
  constructor() {
    super(TrainerTag);
  }
}
