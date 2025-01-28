import { isNumber } from 'lodash';
import { TFunction } from 'react-i18next';
import { AppProvider } from '~/AppProvider';
import { ClipLoader } from 'components/Loader';
import { useGetAppAddress } from '../api/utils';
import GraphLegend from 'components/Graphs/GraphLegend';
import SolarRadiationDoseChart from 'components/Graphs/SolarRadiationDoseChart';
import EffectiveIrradianceChart from 'components/Graphs/EffectiveIrradianceChart';
import AccumulatedSolarDosesChart from 'components/Graphs/AccumulatedSolarDosesChart';
import { CompletedSessionReportDataType } from '../api/format';
import { getLabelFromID } from '~/utils/functions';

export type CompletedSessionReportType = {
  t: TFunction;
  isLoading: boolean;
  data: CompletedSessionReportDataType | null;
};

export default function CompletedSessionReport({
  t,
  data,
  isLoading,
}: CompletedSessionReportType) {
  return (
    <div className='grid gap-4 m-4 text-lg text-left text-black 3xl:gap-5'>
      <div className='container space-y-4'>
        <div className='p-4 bg-white containerShadow'>
          <h1 className='mb-5 text-base font-semibold text-black'>
            {t('Patient_Records_–_Report.card_title')}
          </h1>
          <div className='flex text-sm'>
            {isLoading && (
              <div className='py-[120px] flex justify-center mx-auto w-full'>
                <ClipLoader color='#1e477f' size={1} />
              </div>
            )}
            {!isLoading && (
              <>
                <div className='flex flex-col mt-6 space-y-7'>
                  <GraphLegend
                    title={t('Patient_Records_–_Report.PpIX-effective_dose')}
                    subtitle={`${t(
                      'Patient_Records_–_Report.Percent_min_ppix'
                    )} ${data?.minPpix || '-'} J/cm²)`}
                    colour='bg-blue-lighter'
                    whitespace='whitespace-nowrap'
                    height='h-20'
                  />
                  <GraphLegend
                    title={t('Patient_Records_–_Report.erythemal_dose')}
                    subtitle={t(
                      'Patient_Records_–_Report.percent_patients_MED'
                    )}
                    colour='bg-SmartPDTorange'
                    whitespace='whitespace-nowrap'
                    height='h-20'
                  />
                </div>
                <SolarRadiationDoseChart
                  graphId='solarradiationdosechart'
                  data={[
                    {
                      name: t('Patient_Records_–_Report.erythemal_dose'),
                      value: isNumber(data?.burnDose) ? data?.burnDose : '-',
                      percentage: data?.burnDosePercentage || '-',
                      unit: 'J/m²',
                    },
                    {
                      name: t('Patient_Records_–_Report.PpIX-effective_dose'),
                      value: isNumber(data?.ppixDose) ? data?.ppixDose : '-',
                      percentage: data?.pdtDosePercentage
                        ? Math.round(data.pdtDosePercentage)
                        : '-',
                      unit: 'J/cm²',
                    },
                  ]}
                  hideWithoutSunscreen={true}
                />
              </>
            )}
          </div>
        </div>
        <div className='p-4 text-base bg-white containerShadow'>
          <div className='flex justify-between font-light'>
            <h1 className='mb-5 text-base font-semibold text-black'>
              {t('Patient_Records.PpiX_dose_accumulated')}
            </h1>
            <p className='text-sm text-black-lighter'>
              {t('Patient_Records_–_Report.Outdoor_direct_sunlight')}
            </p>
          </div>
          {isLoading && (
            <div className='py-[120px] flex justify-center mx-auto w-full'>
              <ClipLoader color='#1e477f' size={1} />
            </div>
          )}
          {!isLoading && !data?.accumulatedGraph && (
            <p className='py-[140px] text-center text-sm font-light'>
              {t('No_data_available')}
            </p>
          )}
          {data?.accumulatedGraph && (
            <>
              <AccumulatedSolarDosesChart
                height={300}
                data={data.accumulatedGraph || []}
                graphId='patientrecordsaccumulatedchart'
                leftYAxisLabel={
                  t('Monitoring_-_report.PpIX-effective_dose') + ' (J/cm²)'
                }
                rightYAxisLabel={
                  t('Monitoring_-_report.Erythemal_dose') + ' (J/m²)'
                }
              />
              <div className='flex mx-8 mb-4'>
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
        <div className='p-4 text-base bg-white containerShadow'>
          <h1 className='mb-5 text-base font-semibold text-black'>
            {t('Patient_Records.PpiX_effective_irradiance')}
          </h1>
          {isLoading && (
            <div className='py-[120px] flex justify-center mx-auto w-full'>
              <ClipLoader color='#1e477f' size={1} />
            </div>
          )}
          {!isLoading && !data?.irradianceGraph && (
            <p className='py-[140px] text-center text-sm font-light'>
              {t('No_data_available')}
            </p>
          )}
          {data?.irradianceGraph && (
            <>
              <EffectiveIrradianceChart
                height={300}
                graphId='patientrecordsirradiancechart'
                data={data.irradianceGraph || []}
              />
              <div className='flex mx-8 mb-4'>
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
      </div>
      <div className='container space-y-4'>
        <SessionConditions data={data} />
        <EnvironmentalConditions t={t} data={data} />
      </div>
    </div>
  );
}

export const SessionConditions = ({
  data,
}: {
  data: CompletedSessionReportDataType | null;
}) => {
  const { t, sunscreenList } = AppProvider.useContainer();
  return (
    <div className='p-5 pb-2 text-sm font-light text-left bg-white containerShadow text-black-light'>
      <h1 className='mb-5 text-base font-semibold text-black'>
        {t('Patient_Records_Report.Session_conditions')}
      </h1>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Exposure_start_time')}
        </p>
        <p className='text-right text-black-light'>{data?.startTime || '-'}</p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Exposure_end_time')}
        </p>
        <p className='text-right text-black-light'>{data?.endTime || '-'}</p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Treatment_duration')}
        </p>
        <p className='text-right text-black-light'>{data?.duration || '-'}</p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Planned_start')}
        </p>
        <p className='text-right text-black-light'>
          {data?.plannedStartTime || '-'}
        </p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Sunscreen_applied')}
        </p>
        <p className='text-right text-black-light'>
          {data?.sunscreen
            ? getLabelFromID(data?.sunscreen, sunscreenList)
            : t('None')}
        </p>
      </div>
    </div>
  );
};

export const EnvironmentalConditions = ({
  t,
  data,
}: {
  t: TFunction;
  data: CompletedSessionReportDataType | null;
}) => {
  const { fullAppAddress } = useGetAppAddress({
    sessionType: data?.sessionTypeRaw as string,
    coordinates: data?.coordinates as { lat: number; lng: number },
  });

  return (
    <div className='p-5 pb-2 text-sm font-light text-left bg-white containerShadow text-black-light'>
      <h1 className='mb-5 text-base font-semibold text-black'>
        {t('Patient_Records_Report.Enviromental_conditions')}
      </h1>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Location')}
        </p>
        <p className='text-right text-black-light'>
          {fullAppAddress || data?.address || '-'}
        </p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Average_temperature')}
        </p>
        <p className='text-right text-black-light'>{data?.avgTemp || '-'}</p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.UV_index')}
        </p>
        <p className='text-right text-black-light'>{data?.uvIndex || '-'}</p>
      </div>
      <div className='flex justify-between py-3'>
        <p className='font-medium text-black'>
          {t('Patient_Records_Report.Treatment_enviroment')}
        </p>
        <p className='text-right text-black-light'>{t('Outdoors')}</p>
      </div>
    </div>
  );
};
