import {
  useRef,
  Dispatch,
  useEffect,
  RefObject,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { uniqueId } from 'lodash';
import { TFunction } from 'react-i18next';
import { statusIcons } from 'utils/icons';
import { getLabelFromKey } from 'utils/functions';
import { MonitoringDataType } from '../api/format';
import { SessionTypeEnums } from 'utils/options.d';
import { treatmentPreference } from 'utils/options';
import { ReactComponent as Warning } from 'assets/images/ic_warning_orange.svg';

type ActiveTreatmentListProps = {
  t: TFunction;
  data: MonitoringDataType[];
  setActive: (value: boolean) => void;
  addressArray: {
    id: number;
    address: string;
  }[];
  selectedPatientID: number | null;
  scrollPosition: MutableRefObject<number>;
  treatmentListScrollRef: RefObject<HTMLElement>;
  setSelectedPatientID: Dispatch<SetStateAction<number | null>>;
  handleEndSession: (patientID: number, sessionID: string) => void;
};

export default function ActiveTreatmentList({
  t,
  data,
  setActive,
  addressArray,
  scrollPosition,
  handleEndSession,
  selectedPatientID,
  setSelectedPatientID,
  treatmentListScrollRef,
}: ActiveTreatmentListProps) {
  const lastItem = data?.length - 1;
  const selectedTreatmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treatmentListScrollRef.current && selectedTreatmentRef.current) {
      treatmentListScrollRef.current.scrollTop =
        selectedTreatmentRef.current.offsetTop - 116;
    }
  }, [selectedTreatmentRef, treatmentListScrollRef]);

  return (
    <>
      {data.map((details, index) => {
        const isComplete = true;
        const isPending = details.paused;
        const isSelectedTreatment = details.patientID === selectedPatientID;
        const addressArrayIndex = addressArray.findIndex(
          (address) => address?.id === details.patientID
        );
        const isPDTComplete = details.estimatedEndTime === -1;
        const isPDTUnachievale = details.estimatedEndTime === -2;
        const isPortalOnly =
          details.sessionType === SessionTypeEnums.FullyAssisted;

        return (
          <div
            key={uniqueId('treatment-list-')}
            ref={isSelectedTreatment ? selectedTreatmentRef : null}
            onClick={() => {
              setActive(true);
              setSelectedPatientID(details.patientID);
              if (scrollPosition.current) scrollPosition.current = 0;
            }}
            className={`px-6 text-sm text-left border-b border-t bg-[#fcfcfc]  transition duration-200 cursor-pointer hover:shadow-lg hover:bg-dashboard w-full
          ${
            isSelectedTreatment
              ? 'border-blue border-r !bg-dashboard'
              : 'border-gray-light'
          }
          ${index === lastItem ? 'border-b-2' : ''}`}
          >
            <div className='flex items-start justify-between py-2 pt-4'>
              <div className='flex flex-col'>
                <div className='flex items-center gap-4'>
                  <div className='w-3 h-3 bg-red-500 rounded-full pulse' />
                  <h2 className='text-[0.95rem] whitespace-nowrap 2xl:text-base font-medium'>
                    {t('Dashboard.patient_id')}: {details.patientID}
                  </h2>
                </div>
                {isPDTComplete && (
                  <p className='font-light text-black-light'>
                    {t('monitoring.treatment.dose_reached')}
                    {isPortalOnly && (
                      <>
                        {'. '}
                        <span
                          className='underline text-blue-lighter hover:cursor-pointer'
                          onClick={() => {
                            details.sessionID &&
                              handleEndSession(
                                details.patientID,
                                details.sessionID
                              );
                          }}
                        >
                          {t('End_Session')}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
              <div className='text-right border-t border-gray-lightest'>
                <h2 className='text-[0.95rem] mb-1 2xl:text-base font-medium'>
                  {addressArray[addressArrayIndex]?.address || '-'}
                </h2>
                <p className='font-light text-black-light'>
                  {getLabelFromKey(details.sessionType, treatmentPreference())}
                </p>
              </div>
            </div>

            <div className='flex items-center w-full gap-16 py-4 border-t'>
              <div className='flex flex-col gap-2'>
                <span className='text-xs font-light text-black-lighter lg:text-sm'>
                  {t('Monitoring_–_no_side_menu.status_pre-treatment')}
                </span>
                <span className='flex items-center gap-2'>
                  <img
                    alt={
                      isComplete
                        ? t('Monitoring_.Complete')
                        : t('Monitoring_.Ongoing')
                    }
                    src={
                      isComplete ? statusIcons.complete : statusIcons.ongoing
                    }
                  />
                  <p className='font-medium'>
                    {isComplete
                      ? t('Monitoring_.Complete')
                      : t('Monitoring_.Ongoing')}
                  </p>
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-xs font-light text-black-lighter lg:text-sm'>
                  {t('monitoring.treatment_status')}
                </span>
                <span className='flex items-center gap-2'>
                  <img
                    alt={
                      isComplete
                        ? t('Monitoring_.Paused')
                        : t('Monitoring_.Ongoing')
                    }
                    src={isPending ? statusIcons.pending : statusIcons.ongoing}
                  />
                  <p className='font-medium'>
                    {isPending
                      ? t('Monitoring_.Paused')
                      : t('Monitoring_.Ongoing')}
                  </p>
                </span>
              </div>

              <div className='flex flex-col gap-2'>
                <span className='text-xs font-light text-black-lighter lg:text-sm'>
                  {t('Monitoring_–_no_side_menu.end_time_heading')}
                </span>
                {!isPDTComplete && !isPDTUnachievale && (
                  <span className='flex items-center gap-2'>
                    <img alt='clock-icon' src={statusIcons.clock} />
                    <p className='flex-shrink-0 font-medium'>{`${t(
                      'Monitoring_–_estimated_end_time_today'
                    )} ${details.estimatedEndTime}`}</p>
                  </span>
                )}
                {isPDTComplete && (
                  <span className='flex items-center gap-2'>
                    <img
                      alt={t('Monitoring_.Complete')}
                      src={statusIcons.complete}
                    />
                    <p className='flex-shrink-0 font-medium'>
                      {t('monitoring.treatment.dose_reached')}
                    </p>
                  </span>
                )}
                {isPDTUnachievale && (
                  <span className='flex items-center gap-2'>
                    <Warning />
                    <p className='flex-shrink-0 font-medium'>
                      {t('monitoring.treatment.pdt_unachieavable')}
                    </p>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
