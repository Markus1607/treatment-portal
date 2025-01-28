import { diseasesTypes, pdtTypes } from 'utils/options';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import { RadioToggle } from './components/RadioToggle';
import { useNaturalDPDT } from './components/PDT-types/NaturalDPDT';
import { SetStateAction, Dispatch, useState, useMemo, useEffect } from 'react';
import { ReactComponent as HandPointer } from 'assets/images/ic_hand_direct.svg';
import { useAllProtocolsData } from 'pages/Protocol/api/query';
import { getNatPDTList } from './components/PDT-types/utils';
import {
  FormatGetTreatmentType,
  FormattedNatPDTSessionsType,
} from '../Patients/components/PatientSchedule/api/query';
import { DiseasesTypeEnums, DiseasesTypeOptions } from '~/utils/options.d';
import toast from 'react-hot-toast';

type SchedulingPropTypes = {
  patientUid: string;
  savedDataLoading?: boolean;
  bookedEvent?: FormatGetTreatmentType['eventData'] | null;
  setBookedEvent: Dispatch<
    SetStateAction<null | FormatGetTreatmentType['eventData']>
  >;
  savedData?: FormattedNatPDTSessionsType;
};

export default function Scheduling({
  savedData,
  patientUid,
  bookedEvent,
  setBookedEvent,
  savedDataLoading,
}: SchedulingPropTypes) {
  const {
    t,
    cookies: {
      user: { token },
    },
  } = AppProvider.useContainer();
  const [selectedPdtType, setSelectedPdtType] = useState<number>(0);
  const [selectedDiseaseType, setSelectedDiseaseType] =
    useState<DiseasesTypeOptions>(
      savedData?.diseaseTypeUid || DiseasesTypeEnums.AK
    );

  const { data: allProtocolData } = useAllProtocolsData(token);

  const naturalPDTList = useMemo(() => {
    return allProtocolData && 'naturalPDTList' in allProtocolData
      ? getNatPDTList({
          data: allProtocolData.naturalPDTList,
          diseaseTypeUid: selectedDiseaseType,
        })
      : [];
  }, [allProtocolData, selectedDiseaseType]);

  useEffect(() => {
    if (savedData?.diseaseTypeUid) {
      setSelectedDiseaseType(savedData?.diseaseTypeUid);
    } else {
      setSelectedDiseaseType(selectedDiseaseType);
    }
  }, [savedData?.diseaseTypeUid]);

  const { NaturalSessionFields, NaturalDPDTCalendar } = useNaturalDPDT({
    savedData,
    patientUid,
    bookedEvent,
    setBookedEvent,
    naturalPDTList,
    savedDataLoading,
    selectedDiseaseType,
  });

  const renderSessionField = () => {
    switch (selectedPdtType) {
      case 0:
        return NaturalSessionFields;
      default:
        return NaturalSessionFields;
    }
  };

  const renderCalendar = () => {
    switch (selectedPdtType) {
      case 0:
        return NaturalDPDTCalendar;
      default:
        return NaturalDPDTCalendar;
    }
  };

  const formsErrorForBookedSession = () => {
    if (bookedEvent) {
      toast.error(t('Session_not_editable_for_booked'), {
        id: 'booked-error',
      });
    }
  };

  return (
    <div className='relative flex flex-col childrenContainer 3xl:overflow-hidden'>
      <div className='grid h-full max-h-full text-sm 2xl:grid-cols-scheduling2XL xl:grid-cols-schedulingXL'>
        <form
          onClick={formsErrorForBookedSession}
          className={`z-[1] container h-full xl:overflow-y-auto ${
            bookedEvent ? 'cursor-not-allowed' : 'cursor-default'
          }`}
        >
          <div
            className={`m-4 4xl:m-6 space-y-8 text-black lg:mb-10 ${
              bookedEvent ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
          >
            <div className='lg:mb-[8rem] p-4 bg-white rounded-md shadow space-y-6'>
              <header className='!mb-4 flex justify-between w-full'>
                <h1 className='text-base font-medium 4xl:text-lg'>
                  {t('provide-treatment-options')}
                </h1>
                {savedDataLoading && (
                  <div className='-mt-2'>
                    <ClipLoader color='#1e477f' size={0.65} />
                  </div>
                )}
              </header>

              <RadioToggle
                name='disease-type'
                options={diseasesTypes()}
                label={t('disease-to-be-treated')}
                selectedOptionType={selectedDiseaseType}
                setSelectedOptionType={setSelectedDiseaseType}
              />

              <RadioToggle
                name='pdt-type'
                label={t('therapy')}
                options={pdtTypes()}
                selectedOptionType={selectedPdtType}
                setSelectedOptionType={setSelectedPdtType}
              />

              {renderSessionField()}

              <p className='flex items-center gap-2 p-2 text-sm font-light text-black rounded-md bg-blue-50'>
                <span>{t('select-a-treatment-date-direct-text')}</span>
                <HandPointer style={{ scale: '0.8' }} />
              </p>
            </div>
          </div>
        </form>

        {/* =========================== SCHEDULING CUSTOMIZATIONS =========================================== */}

        <div className='container relative bg-white'>{renderCalendar()}</div>
      </div>
    </div>
  );
}
