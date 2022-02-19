import { IsEnum, IsNumber, IsString, validateOrReject } from 'class-validator';

import { TrainerTag } from '@hubbl/shared/models/entities';
import {
  enumError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { AppPalette } from '@hubbl/shared/types';

import DTO from '../Base';
import { PersonDTOGroups } from '../Person';
import { DTOGroups } from '../util';

export default class TrainerTagDTO implements DTO<TrainerTag> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
  })
  name!: string;

  @IsEnum({}, { message: enumError('AppPalette', 'color') })
  color!: AppPalette;

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @returns The parsed `TrainerTagDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<TrainerTagDTO> {
    const result = new TrainerTagDTO();

    result.id = json.id;
    result.name = json.name;
    result.color = json.color;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [variant]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO
   *
   * @param tag The fetched tag
   * @returns The dto to be send as a response
   */
  public static fromClass(tag: TrainerTag): TrainerTagDTO {
    const result = new TrainerTagDTO();

    result.id = tag.id;
    result.name = tag.name;
    result.color = tag.color;

    return result;
  }

  /**
   *
   * @returns The parsed tag from the DTO
   */
  public toClass(): TrainerTag {
    const result = new TrainerTag();

    result.id = this.id;
    result.name = this.name;
    result.color = this.color;

    return result;
  }
}
