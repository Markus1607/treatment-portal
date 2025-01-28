import { isNumber } from 'lodash';
import AccumulatedSolarDosesChart from 'components/Graphs/AccumulatedSolarDosesChart';
import EffectiveIrradianceChart from 'components/Graphs/EffectiveIrradianceChart';
import GraphLegend from 'components/Graphs/GraphLegend';
import { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { TFunction } from 'react-i18next';
import ProgressBar from '~/pages/Monitoring/Components/ProgressBar';
import DoseDiv from '~/pages/Monitoring/Components/DoseDiv';
import {
  FormatSessionCardInfoType,
  OngoingSessionReportDataType,
} from '../api/format';
import { getLabelFromID } from '~/utils/functions';
import { AppProvider } from '~/AppProvider';
import { useGetAppAddress } from '../api/utils';

type SessionReportProps = {
  t: TFunction;
  patientUid: string;
  data: OngoingSessionReportDataType | null;
  scrollPosition: MutableRefObject<number>;
  sessionInfo: FormatSessionCardInfoType | null;
};

export default function SessionReport({
  t,
  data,
  patientUid,
  sessionInfo,
  scrollPosition,
}: SessionReportProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition?.current || 0;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => (scrollPosition.current = e.currentTarget.scrollTop)}
      className='w-full min-h-full mx-auto overflow-y-auto text-sm text-black bg-white monitoringScrollBar 4xl:overflow-x-hidden'
    >
      <ProgressBar
        text={t('monitoring.protocol_minimum_heading')}
        percentage={data?.protocolTimePercentage}
        time={data?.minProtocolDurationRemaining}
        colour='text-blue'
      />
      <ProgressBar
        colour='text-warning'
        time={data?.pauseDuration}
        text={t('monitoring.pause_time_accumualted')}
        percentage={data?.pauseTimePercentage}
      />
      <div className='flex w-full text-black'>
        <DoseDiv
          name={t('Monitoring_-_report.PpIX-effective_dose')}
          time={
            isNumber(data?.ppixDoseTimeRemaining)
              ? data?.ppixDoseTimeRemaining === -1
                ? t('Monitoring_.Complete')
                : '-'
              : data?.ppixDoseTimeRemaining || '-'
          }
          timeText={t('Monitoring_-_report.dose_label')}
          percent={data?.ppixPercent || 0}
          textColour='text-blue-lighter'
          textColourDark='text-[#2363df]'
          bgColour='bg-blue-lighter'
        />
        <DoseDiv
          name={t('Monitoring_-_report.Erythemal_dose')}
          tooltipText={t('Erythemal_dose.tooltip')}
          time={
            isNumber(data?.burnTimeRemaining)
              ? data?.burnTimeRemaining === -1
                ? t('monitoring.erythema_dose_label.risk')
                : t('sunburn.no_risk')
              : data?.burnTimeRemaining || '-'
          }
          timeText={t('time_remaining.sunburn')}
          percent={data?.erythemaPercent || 0}
          textColour='text-orange-light'
          textColourDark='text-[#ef9607]'
          bgColour='bg-orange-light'
        />
      </div>
      <div className='border-b border-gray-light'>
        <p className='px-6 py-4 text-base font-bold text-left bg-white'>
          {t('Patient_Records.PpiX_dose_accumulated')}
        </p>
        {!data?.accumulatedGraph && (
          <p className='py-[140px] text-center font-light'>
            {t('No_data_available')}
          </p>
        )}
        {data?.accumulatedGraph && (
          <>
            <AccumulatedSolarDosesChart
              height={300}
              data={data?.accumulatedGraph}
              graphId='monitoringaccumulatedchart'
              leftYAxisLabel={
                t('Monitoring_-_report.PpIX-effective_dose') + ' (J/cm²)'
              }
              rightYAxisLabel={
                t('Monitoring_-_report.Erythemal_dose') + ' (J/m²)'
              }
            />
            <div className='flex w-3/5 mx-8 mb-4'>
              <GraphLegend
                title={t('Monitoring_-_report.Erythemal_dose')}
                subtitle='(J/m²)'
                colour='bg-SmartPDTorange'
                whitespace='whitespace-nowrap'
              />
              <GraphLegend
                title={t('Monitoring_-_report.PpIX-effective_dose')}
                subtitle='(J/cm²)'
                colour='bg-blue-lighter'
                whitespace='whitespace-nowrap'
              />
            </div>
          </>
        )}
      </div>
      <div className='border-b border-gray-light'>
        <p className='flex justify-between px-6 py-4 text-base font-bold text-left bg-white'>
          <span>{t('Patient_Records.PpiX_effective_irradiance')}</span>
          <span className='ml-16 text-xs font-normal text-black-lighter'>
            {t('Monitoring_-_report.conditions_indicator')}
          </span>
        </p>
        {!data?.irradianceGraph && (
          <p className='py-[140px] text-center font-light'>
            {t('No_data_available')}
          </p>
        )}
        {data?.irradianceGraph && (
          <>
            <EffectiveIrradianceChart
              height={300}
              data={data?.irradianceGraph}
              graphId={`monitoringirradiancechart${patientUid}`}
            />
            <div className='flex w-3/5 mx-8 mb-4'>
              <GraphLegend
                title={t('irradiance.erythemal')}
                subtitle='(mW/m²)'
                colour='bg-SmartPDTorange'
                whitespace='whitespace-nowrap'
              />
              <GraphLegend
                title={t('Weather.PpIX_graph_label')}
                subtitle='(W/m²)'
                colour='bg-blue-lighter'
                whitespace='whitespace-nowrap'
              />
            </div>
          </>
        )}
      </div>
      <div className='flex w-full pb-4 text-black'>
        <SessionConditions data={data} />
        <EnvironmentalConditions t={t} data={data} sessionInfo={sessionInfo} />
      </div>
    </div>
  );
}

export const SessionConditions = ({
  data,
}: {
  data: OngoingSessionReportDataType | null;
}) => {
  const { t, sunscreenList } = AppProvider.useContainer();

  return (
    <div className='w-full px-4 font-light text-left text-black border divide-y border-gray-light divide-gray-light'>
      <div className='flex flex-col'>
        <h1 className='py-4 text-base font-bold'>
          {t('Monitoring_-_report.card_title.63')}
        </h1>
        <div className='flex justify-between py-4'>
          <p className='font-medium'>
            {t('Monitoring_-_report.Exposure_start_time')}
          </p>
          <p className='text-right text-black-light'>
            {data?.startTime ? data.startTime : '-'}
          </p>
        </div>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Treatment_duration')}
        </p>
        <p className='text-right text-black-light'>
          {data?.treatmentDuration || isNumber(data?.treatmentDuration)
            ? data?.treatmentDuration + t('Minutes')
            : `0 ${t('Minutes')}`}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('monitoring.report.actualPDTTreatmentTime')}
        </p>
        <p className='text-right text-black-light whitespace-nowrap'>
          {data?.actualPDTDuration || isNumber(data?.actualPDTDuration)
            ? data?.actualPDTDuration + t('Minutes')
            : `0 ${t('Minutes')}`}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Sunscreen_applied')}
        </p>
        <p className='text-right text-black-light'>
          {data?.sunscreenApplied
            ? getLabelFromID(data?.sunscreenApplied, sunscreenList)
            : t('None')}
        </p>
      </div>
    </div>
  );
};

export const EnvironmentalConditions = ({
  t,
  data,
  sessionInfo,
}: {
  t: TFunction;
  data: OngoingSessionReportDataType | null;
  sessionInfo: FormatSessionCardInfoType | null;
}) => {
  const { appAddress } = useGetAppAddress({
    sessionType: sessionInfo?.sessionTypeRaw as string,
    coordinates: sessionInfo?.coordinates as { lat: number; lng: number },
  });

  return (
    <div className='w-full px-4 font-light text-black border divide-y border-gray-light divide-gray-light'>
      <div className='flex flex-col'>
        <h1 className='py-4 text-base font-bold text-left'>
          {t('enviornmental_conditions')}
        </h1>
        <div className='flex justify-between py-4'>
          <p className='font-medium'>{t('Monitoring_-_report.Location')}</p>
          <p className='text-right text-black-light'>
            {appAddress || data?.expectedLocation || '-'}
          </p>
        </div>
      </div>

      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Average_temperature')}
        </p>
        <p className='text-right text-black-light'>
          {data?.avgTemp ? data?.avgTemp + '°C' : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>{t('Monitoring_-_report.UV_index')}</p>
        <p className='text-right text-black-light'>{data?.uvIndex || '-'}</p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Treatment_environment')}
        </p>
        <p className='text-right text-black-light'>{t('Outdoors')}</p>
      </div>
    </div>
  );
};
