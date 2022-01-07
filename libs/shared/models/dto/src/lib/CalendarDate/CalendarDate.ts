import { IsNumber, Max, Min, validateOrReject } from 'class-validator';

import { CalendarDate } from '@hubbl/shared/models/entities';

import DTO from '../Base';
import { DTOGroups, numberError, validationParser } from '../util';
import { maxError, minError } from '../util/error-messages';

export default class CalendarDateDTO implements DTO<CalendarDate> {
  @IsNumber({}, { message: numberError('year') })
  @Min(new Date().getFullYear(), {
    message: minError('year', new Date().getFullYear())
  })
  year!: number;

  @IsNumber({}, { message: numberError('month') })
  @Min(1, { message: minError('month', 1) })
  @Max(12, { message: maxError('month', 12) })
  month!: number;

  @IsNumber({}, { message: numberError('day') })
  @Min(1, { message: minError('day', 1) })
  @Max(31, { message: minError('day', 31) })
  day!: number;

  private static validDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  }

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `CalendarDateDTO`
   */
  public static async fromJson(json: any): Promise<CalendarDateDTO> {
    const result = new CalendarDateDTO();

    if (!CalendarDateDTO.validDate(json.year, json.month - 1, json.day)) {
      throw 'Date is not valid';
    }

    result.year = json.year;
    result.month = json.month;
    result.day = json.day;

    await validateOrReject(result, {
      validationError: { target: false }
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO and validates it
   *
   * @param calendarDate The fetched calendar date
   * @returns The parsed `CalendarDateDTO`
   */
  public static async fromClass(
    calendarDate: CalendarDate
  ): Promise<CalendarDateDTO> {
    const result = new CalendarDateDTO();

    result.year = calendarDate.year;
    result.month = calendarDate.month;
    result.day = calendarDate.day;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [DTOGroups.ALL]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   *
   * @returns The parsed calendar from the DTO
   */
  public toClass(): CalendarDate {
    const calendar = new CalendarDate();

    calendar.year = this.year;
    calendar.month = this.month;
    calendar.day = this.day;

    return calendar;
  }
}
