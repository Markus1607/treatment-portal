import { isNumber, isString } from 'lodash';
import DoseDiv from './DoseDiv';
import ProgressBar from './ProgressBar';
import AccumulatedSolarDosesChart from 'components/Graphs/AccumulatedSolarDosesChart';
import EffectiveIrradianceChart from 'components/Graphs/EffectiveIrradianceChart';
import GraphLegend from 'components/Graphs/GraphLegend';
import { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { TFunction } from 'react-i18next';
import { FormattedOngoingSessionDataType } from '../api/format';

const SessionConditions = ({
  t,
  data,
}: {
  t: TFunction;
  data: FormattedOngoingSessionDataType | null;
}) => {
  return (
    <div className='w-full px-4 font-light text-left text-black border border-gray-light divide-gray-light divide-y'>
      <div className='flex flex-col'>
        <h1 className='py-4 text-base font-bold'>
          {t('Monitoring_-_report.card_title.63')}
        </h1>
        <div className='flex justify-between py-4'>
          <p className='font-medium'>
            {t('Monitoring_-_report.Exposure_start_time')}
          </p>
          <p className='text-right text-black-light'>
            {data?.startTime && data.startTime}
          </p>
        </div>
      </div>

      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Estimated_Exposure_end_time')}
        </p>
        <p className='text-right text-black-light'>
          {data?.estimatedEndTime === -1 &&
            t('monitoring.treatment.dose_reached')}
          {data?.estimatedEndTime === -2 &&
            t('monitoring.treatment.pdt_unachieavable')}
          {isString(data?.estimatedEndTime) && data?.estimatedEndTime}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Treatment_duration')}
        </p>
        <p className='text-right text-black-light'>
          {data?.report?.treatmentDuration + t('Minutes') || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('monitoring.report.actualPDTTreatmentTime')}
        </p>
        <p className='text-right text-black-light whitespace-nowrap'>
          {data?.report?.actualPDTDuration + t('Minutes') || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Planned_start_time')}
        </p>
        <p className='text-right text-black-light'>
          {data?.plannedStartTime || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Planned_duration')}
        </p>
        <p className='text-right text-black-light'>
          {data?.plannedDuration ? data.plannedDuration + t('Minutes') : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Sunscreen_applied')}
        </p>
        <p className='text-right text-black-light'>
          {data?.sunscreen ? data.sunscreen : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Treatment_rescheduled')}
        </p>
        <p className='text-right text-black-light'>
          {data?.rescheduled || '-'}
        </p>
      </div>
    </div>
  );
};

const EnvironmentalConditions = ({
  t,
  data,
  address,
}: {
  t: TFunction;
  address: string;
  data: FormattedOngoingSessionDataType | null;
}) => {
  return (
    <div className='w-full px-4 font-light text-black border border-gray-light divide-gray-light divide-y'>
      <div className='flex flex-col'>
        <h1 className='py-4 text-base font-bold text-left'>
          {t('enviornmental_conditions')}
        </h1>
        <div className='flex justify-between py-4'>
          <p className='font-medium'>{t('Monitoring_-_report.Location')}</p>
          <p className='text-right text-black-light'>{address || '-'}</p>
        </div>
      </div>

      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Average_temperature')}
        </p>
        <p className='text-right text-black-light'>
          {data?.avgTemp + '°C' || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>{t('Monitoring_-_report.UV_index')}</p>
        <p className='text-right text-black-light'>
          {data?.report?.uvIndex || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4'>
        <p className='font-medium'>
          {t('Monitoring_-_report.Treatment_environment')}
        </p>
        <p className='text-right text-black-light'>{t('Outdoors')}</p>
      </div>
      {/* <div className='flex justify-between py-4'>
        <p className='font-medium'>{t('Monitoring_-_report.Comfort_index')}</p>
        <p className='text-right text-black-light'>18°C</p>
      </div> */}
    </div>
  );
};

type SessionReportProps = {
  t: TFunction;
  address: string;
  data: FormattedOngoingSessionDataType | null;
  scrollPosition: MutableRefObject<number>;
};

export default function SessionReport({
  t,
  data,
  address,
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
      className='w-full min-h-full mx-auto overflow-y-auto text-sm text-black bg-white monitoringScrollBar xl:overflow-x-hidden'
    >
      <ProgressBar
        text={t('monitoring.protocol_minimum_heading')}
        percentage={data?.report?.protocolTimePercentage}
        time={data?.report?.minProtocolDurationRemaining}
        colour='text-blue'
      />
      <ProgressBar
        colour='text-warning'
        time={data?.report?.pauseDuration}
        text={t('monitoring.pause_time_accumualted')}
        percentage={data?.report?.pauseTimePercentage}
      />
      <div className='flex w-full text-black'>
        <DoseDiv
          name={t('Monitoring_-_report.PpIX-effective_dose')}
          time={
            isNumber(data?.report?.ppixDoseTimeRemaining)
              ? data?.report?.ppixDoseTimeRemaining === -1
                ? t('Monitoring_.Complete')
                : '-'
              : data?.report?.ppixDoseTimeRemaining || '-'
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
            isNumber(data?.report?.burnTimeRemaining)
              ? data?.report?.burnTimeRemaining === -1
                ? t('monitoring.erythema_dose_label.risk')
                : t('sunburn.no_risk')
              : data?.report?.burnTimeRemaining || '-'
          }
          timeText={t('time_remaining.sunburn')}
          percent={data?.burnPercent || 0}
          textColour='text-orange-light'
          textColourDark='text-[#ef9607]'
          bgColour='bg-orange-light'
        />
      </div>
      <div className='border-b border-gray-light'>
        <p className='px-6 py-4 text-base font-bold text-left bg-white'>
          {t('Patient_Records.PpiX_dose_accumulated')}
        </p>
        {!data?.report?.accumulatedGraph && (
          <p className='py-[140px] text-center font-light'>
            {t('No_data_available')}
          </p>
        )}
        {data?.report?.accumulatedGraph && (
          <>
            <AccumulatedSolarDosesChart
              height={300}
              data={data.report.accumulatedGraph}
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
        {!data?.report?.irradianceGraph && (
          <p className='py-[140px] text-center font-light'>
            {t('No_data_available')}
          </p>
        )}
        {data?.report?.irradianceGraph && (
          <>
            <EffectiveIrradianceChart
              height={300}
              data={data.report.irradianceGraph}
              graphId={`monitoringirradiancechart${data.patientID}`}
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
      <div className='flex w-full mb-16 text-black 3xl:mb-2 xl:mb-8'>
        <SessionConditions t={t} data={data} />
        <EnvironmentalConditions t={t} data={data} address={address} />
      </div>
    </div>
  );
}
