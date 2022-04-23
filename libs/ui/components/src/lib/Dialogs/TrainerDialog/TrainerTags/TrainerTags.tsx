import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { TrainerTagDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { TrainerFormFields } from '../../types';

export type TrainerTagsProps = {
  tags?: TrainerTagDTO[];
};

const TrainerTags = ({ tags }: TrainerTagsProps): JSX.Element => {
  const { control, getValues, setValue } = useFormContext<TrainerFormFields>();

  const [options, setOptions] = useState<TrainerTagDTO[]>([]);

  const maptrainerTags = (): SelectItem[] =>
    (tags?.length ? tags : options).map((t) => ({
      key: t.id,
      value: t.id,
      label: t.name
    }));

  useEffect(() => {
    if (tags?.length) {
      setOptions(tags);
      setValue('tags', getValues('tags') ? getValues('tags') : []);
    }
  }, [tags, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="tags"
      label="Tags (optional)"
      placeholder="Select trainer tags"
      inputProps={{ title: 'trainer-tags' }}
      options={maptrainerTags()}
      disabled={!tags}
      multiple
    />
  );
};

export default TrainerTags;
