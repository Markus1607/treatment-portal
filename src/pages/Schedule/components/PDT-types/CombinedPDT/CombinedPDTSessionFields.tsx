import { Control } from 'react-hook-form';
import { TFunction } from 'react-i18next';

export type CombinedPDTSessionFieldsProps = {
  errors: Record<string, any>;
  t: TFunction<'translation', undefined>;
  control: Control<any, any>;
};

export default function CombinedPDTSessionFields({
  t,
  errors,
  control,
}: CombinedPDTSessionFieldsProps) {
  console.info(t, errors, control);
  return <div>CombinedPDTSessionFields</div>;
}
