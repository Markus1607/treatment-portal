import xlsx from 'xlsx';
import { useRef, useMemo } from 'react';
import ReactToPrint from 'react-to-print';
import { uniqueId } from 'lodash';
import { CSVDownloader } from 'react-papaparse';
import { getLabelFromID } from '~/utils/functions';
import {
  CompletedSessionInfoDataType,
  FormatSessionCardInfoType,
} from '../api/format';
import { AppProvider } from '~/AppProvider';
import { useGetAppAddress } from '../api/utils';
import { SessionTypeEnums } from '~/utils/options.d';

type CompletedTreatmentDetailsPropType = {
  isFullyAssistedTreatment?: boolean;
  data: CompletedSessionInfoDataType | null;
  sessionInfo: FormatSessionCardInfoType | null;
};

export default function CompletedTreatmentDetails({
  data,
  sessionInfo,
}: CompletedTreatmentDetailsPropType) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t, sunscreenList, currentPatientUsername } =
    AppProvider.useContainer();

  const { fullAppAddress } = useGetAppAddress({
    sessionType: data?.sessionTypeRaw as string,
    coordinates: data?.coordinates as { lat: number; lng: number },
  });

  const treatmentDetailsData = useMemo(
    () =>
      [
        {
          field: t('disease_type'),
          value: sessionInfo?.diseaseTreated || '-',
        },
        {
          field: t(
            'Patient_Records_session_info.Date_of_the_treatment_session'
          ),
          value: data?.sessionDate || '-',
        },
        {
          field: t(
            'Patient_Records_session_info.dPDT_treatment_session_status'
          ),
          value: data?.sessionStatus || '-',
        },
        {
          field: t('Patient_Records_session_info.Preparatory_emollient'),
          value: data?.preparatoryEmollient || '-',
        },
        {
          field: t('Patient_Records_session_info.Prodrug_used'),
          value: data?.prodrug || '-',
        },
        {
          field: t('expected_treatment location'),
          value: data?.address || '-',
        },
        data?.sessionTypeRaw !== SessionTypeEnums.FullyAssisted && {
          field: t('actual_treatment_location'),
          value: fullAppAddress || '-',
        },
        {
          field: t('location_source'),
          value: data?.locationSource || '-',
        },
        {
          field: t('Patient_Records_session_info.Session_start_time_planned'),
          value: data?.plannedStartTime || '-',
        },
        {
          field: t('Patient_Records_session_info.Session_start_time_actual'),
          value: data?.startTime || '-',
        },
        {
          field: t('Patient_Records_session_info.Session_end_time_actual'),
          value: data?.endTime || '-',
        },
        {
          field: t(
            'Patient_Records_session_info.Total_duration_of_the_daylight_exposure'
          ),
          value: data?.duration || '-',
        },
        {
          field: t('Patient_Records_session_info.Average_temperature'),
          value: data?.avgTemp || '-',
        },
        {
          field: t('Patient_Records_session_info.Accumulated_Ppix_dose'),
          value: data?.ppixDose || '-',
        },
        {
          field: t('Patient_Records_session_info.Accumulated_Ppix_irradiance'),
          value: data?.avgPpixIrradiance || '-',
        },
        {
          field: t('Patient_Records_session_info.Suncream_applied'),
          value: data?.sunscreen
            ? getLabelFromID(data?.sunscreen, sunscreenList)
            : t('None'),
        },
      ].filter(Boolean) as { field: string; value: string }[],
    [t, data, fullAppAddress]
  );

  return (
    <div
      ref={ref}
      className='p-5 m-4 mb-0 text-sm text-left bg-white containerShadow print:px-10 text-black-light print:text-xs'
    >
      <div className='flex items-start justify-between'>
        <h1 className='mb-5 text-base font-medium text-black'>
          {t('Patient_Records_–_session_information.card_title.77')}
        </h1>
        <div className='space-x-2 font-light print:hidden'>
          <span className='text-black-lighter'>{t('Summary.export_text')}</span>
          <span className='text-gray-light'>|</span>
          <ReactToPrint
            trigger={() => (
              <button className='underline text-blue-lighter'>PDF</button>
            )}
            content={() => ref.current}
            documentTitle={
              t('Patient_Records_–_session_information.card_title.77') +
              ' PatientID ' +
              currentPatientUsername +
              ' SessionID ' +
              data?.sessionID
            }
          />

          <span className='text-gray-light'>|</span>
          <button
            type='button'
            className='underline text-blue-lighter'
            onClick={() => {
              const wb = xlsx.utils.book_new();
              const ws1 = xlsx.utils.json_to_sheet(treatmentDetailsData, {
                skipHeader: true,
              });
              xlsx.utils.book_append_sheet(
                wb,
                ws1,
                t('Patient_Records_–_session_information.card_title.77') +
                  currentPatientUsername +
                  data?.sessionID
              );
              xlsx.writeFile(
                wb,
                t('Patient_Records_–_session_information.card_title.77') +
                  ' PatientID ' +
                  currentPatientUsername +
                  ' SessionID ' +
                  data?.sessionID +
                  '.xlsx'
              );
            }}
          >
            XLS
          </button>
          <span className='text-gray-light'>|</span>
          <CSVDownloader
            className='underline text-blue-lighter'
            data={treatmentDetailsData}
            type='button'
            filename={
              t('Patient_Records_–_session_information.card_title.77') +
              ' PatientID ' +
              currentPatientUsername +
              ' SessionID ' +
              data?.sessionID
            }
            bom={true}
          >
            CSV
          </CSVDownloader>
        </div>
      </div>

      {treatmentDetailsData.map((detail) => (
        <div
          key={uniqueId('detail-')}
          className='grid justify-between grid-cols-2 py-2 font-light border-b last:border-0 border-gray-light'
        >
          <p className='font-normal text-black'>{detail.field}</p>
          <p className='text-right text-black-light'>{detail.value}</p>
        </div>
      ))}
    </div>
  );
}
