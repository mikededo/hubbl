import EventDTO from '../Event';
import EventTemplateDTO from '../EventTemplate';
import GymZoneDTO from '../GymZone';
import TrainerDTO from '../Trainer';
import VirtualGymDTO from '../VirtualGym';
import DashboardDTO from './';

jest.mock('../Event');
jest.mock('../EventTemplate');
jest.mock('../GymZone');
jest.mock('../Trainer');
jest.mock('../VirtualGym');

describe('DashboardDTO', () => {
  const vgFromClassSpy = jest.spyOn(VirtualGymDTO, 'fromClass');
  const gzFromClassSpy = jest.spyOn(GymZoneDTO, 'fromClass');
  const eFromClassSpy = jest.spyOn(EventDTO, 'fromClass');
  const etFromClassSpy = jest.spyOn(EventTemplateDTO, 'fromClass');
  const tFromClassSpy = jest.spyOn(TrainerDTO, 'fromClass');

  beforeEach(() => {
    jest.clearAllMocks();

    vgFromClassSpy.mockImplementation();
    gzFromClassSpy.mockImplementation();
    eFromClassSpy.mockImplementation();
    etFromClassSpy.mockImplementation();
    tFromClassSpy.mockImplementation();
  });

  describe('#fromClass', () => {
    it('should parse all the fields', () => {
      const result = DashboardDTO.fromClass({
        virtualGyms: [{}, {}] as any,
        gymZones: [{}, {}] as any,
        events: [{}, {}] as any,
        todayEvents: [{}, {}] as any,
        templates: [{}, {}] as any,
        trainers: [{}, {}] as any
      });

      expect(vgFromClassSpy).toHaveBeenCalledTimes(2);
      expect(gzFromClassSpy).toHaveBeenCalledTimes(2);
      expect(eFromClassSpy).toHaveBeenCalledTimes(4);
      expect(etFromClassSpy).toHaveBeenCalledTimes(2);
      expect(tFromClassSpy).toHaveBeenCalledTimes(2);

      expect(result).toBeInstanceOf(DashboardDTO);
    });

    it('should parse only the given fields', () => {
      const result = DashboardDTO.fromClass({
        virtualGyms: [{}, {}] as any,
        gymZones: [{}, {}] as any,
        events: [{}, {}] as any,
        todayEvents: [{}, {}] as any
      });

      expect(vgFromClassSpy).toHaveBeenCalledTimes(2);
      expect(gzFromClassSpy).toHaveBeenCalledTimes(2);
      expect(eFromClassSpy).toHaveBeenCalledTimes(4);
      expect(etFromClassSpy).not.toHaveBeenCalled();
      expect(tFromClassSpy).not.toHaveBeenCalled();

      expect(result).toBeInstanceOf(DashboardDTO);
    });
  });
});
