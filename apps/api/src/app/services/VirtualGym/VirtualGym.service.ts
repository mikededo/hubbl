import { VirtualGym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class VirtualGymService extends BaseService<VirtualGym> {
  constructor() {
    super(VirtualGym);
  }
}
