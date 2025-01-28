import { AppProvider } from 'AppProvider';
import { useForm } from 'react-hook-form';
import CombinedPDTSessionFields from './CombinedPDTSessionFields';
import { defaultCombinedPDTValues } from 'pages/Schedule/api/format';

// eslint-disable-next-line react-refresh/only-export-components
export function useCombinedPDT() {
  const { t } = AppProvider.useContainer();
  const {
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultCombinedPDTValues,
  });

  return {
    CombinedSessionFields: (
      <CombinedPDTSessionFields t={t} control={control} errors={errors} />
    ),
    CombinedProtocolFields: <CombinedProtocolFields />,
    CombinedDPDTCalendar: <CombinedDPDTCalendar />,
  };
}

export const CombinedProtocolFields = () => {
  return <div>CombinedProtocolFields</div>;
};

export const CombinedDPDTCalendar = () => {
  return <div />;
};
