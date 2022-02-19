import * as ClassValidator from 'class-validator';

import { TrainerTag } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';
import { AppPalette } from '@hubbl/shared/types';

import TrainerTagDTO from './TrainerTag';

jest.mock('@hubbl/shared/models/helpers');

const propCompare = (
  want: TrainerTag | TrainerTagDTO,
  got: TrainerTag | TrainerTagDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.color).toBe(want.color);
};

describe('TrainerTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        name: 'Test',
        email: 'test@TrainerTag.com',
        phone: '000 000 000',
        code: '8X4rZNmu',
        color: AppPalette.BLUE
      };

      const result = await TrainerTagDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(TrainerTagDTO);
      // Check fields
      propCompare(json as any, result);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create a DTO if fromJson not is valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await TrainerTagDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a TrainerTagDTO from a correct TrainerTag', () => {
      const tag = new TrainerTag();
      tag.id = 1;
      tag.name = 'Test';
      tag.color = AppPalette.BLUE;

      const result = TrainerTagDTO.fromClass(tag);

      propCompare(tag, result);
    });
  });

  describe('#toClass', () => {
    it('should return a TrainerTag', () => {
      const dto = new TrainerTagDTO();
      dto.id = 1;
      dto.name = 'Test';
      dto.color = AppPalette.BLUE;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
