import { IsEnum, IsInstance, validateOrReject } from 'class-validator';

import { CalendarDateDTO } from '@hubbl/shared/models/dto';
import { CalendarDate } from '@hubbl/shared/models/entities';
import {
  enumError,
  instanceError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { GymZoneIntervals } from '@hubbl/shared/types';

export default class FetchAppointmentInterval {
  @IsInstance(CalendarDate, { message: instanceError('CalendarDate', 'date') })
  date!: CalendarDate;

  @IsEnum(GymZoneIntervals, {
    message: enumError('GymZoneIntervals', 'interval')
  })
  interval!: GymZoneIntervals;

  /**
   * Validates the body of the request
   */
  public static async validate(body: any): Promise<FetchAppointmentInterval> {
    const result = new FetchAppointmentInterval();

    result.date = body.date;
    result.interval = body.interval;

    

    await validateOrReject(await CalendarDateDTO.fromJson(body.date), {
      validationError: { target: false }
    }).catch((errors) => {
      throw validationParser(errors, 'date');
    });

    await validateOrReject(result, {
      validationError: { target: false }
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }
}
