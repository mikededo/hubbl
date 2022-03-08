import { GymDTO } from '@hubbl/shared/models/dto';
import { GymService } from '../../services';
import { UpdateByOwnerController } from '../Base';

const updateInstance = new UpdateByOwnerController(
  GymService,
  GymDTO.fromJson,
  'Gym'
);

export const GymUpdateController = updateInstance;
