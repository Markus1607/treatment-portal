import GraphLegend from 'components/Graphs/GraphLegend';
import TempChart from 'components/Graphs/TempChart';
import SolarChart from 'components/Graphs/SolarChart';
import ShowIcon from 'assets/images/ic_show.svg';
import HideIcon from 'assets/images/ic_hide.svg';
import { DiscardButton } from 'components/Forms/Buttons';
import PrecipitationChart from 'components/Graphs/PrecipitationChart';
import ExpectedSolarRadiationChart from 'components/Graphs/ExpectedSolarRadiationChart';
import { ModalTitle } from 'components/ModalTitle';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { graphIdType } from '@types';

type WeatherDetailsModalPropType = {
  minPpix: number;
  timeZoneLabel: string;
  graphIDs: graphIdType;
  titleToolTip: JSX.Element;
  selectedDayData: {
    date: string;
    chartData: object[];
    formattedDate?: string;
  };
  hideWithoutSunscreen: boolean;
  t: TFunction<'translation', undefined>;
  setSessionSummaryModal: Dispatch<SetStateAction<boolean>>;
  setWeatherDetailsModal: Dispatch<SetStateAction<boolean>>;
  setHideWithoutSunscreen: Dispatch<SetStateAction<boolean>>;
  disableHideWithoutSunscreenBtn?: boolean;
};

export default function WeatherDetailsModal({
  t,
  minPpix,
  graphIDs,
  titleToolTip,
  timeZoneLabel,
  selectedDayData,
  setSessionSummaryModal,
  setWeatherDetailsModal,
  hideWithoutSunscreen,
  setHideWithoutSunscreen,
  disableHideWithoutSunscreenBtn,
}: WeatherDetailsModalPropType) {
  const modalTitle = `${t('Patient')}  > ${t(
    'Dashboard_weather_modal_scheduling'
  )} > ${t('Dashboard_weather_modal_conditions')}`;

  const modalTitleWithDate = `${t('Patient')} > ${t(
    'Dashboard_weather_modal_scheduling'
  )} > ${selectedDayData?.formattedDate} > ${t(
    'Dashboard_weather_modal_conditions'
  )}`;

  return (
    <div className='3xl:min-w-[100rem] 3xl:w-[100rem] max-w-[95vw] md:min-w-[95vw] xl:min-w-[85rem] xl:w-[85rem] text-center text-black text-base bg-dashboard lg:w-full'>
      {timeZoneLabel && (
        <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
          <h2 className='text-sm xl:text-lg'>
            {ModalTitle(modalTitleWithDate)}
          </h2>
          <h2 className='text-sm xl:text-lg'>{timeZoneLabel}</h2>
        </header>
      )}
      {!timeZoneLabel && (
        <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
          <h2 className='text-sm xl:text-lg'>{ModalTitle(modalTitle)}</h2>
          <h2 className='flex-shrink-0 text-sm xl:text-lg'>
            {selectedDayData?.date}
          </h2>
        </header>
      )}
      <main className='3xl:min-w-[100rem] max-h-[80vh] md:min-w-[30rem] lg:max-w-[80%] lg:min-w-[55rem] xl:min-w-[85rem] flex flex-col gap-3 m-3.5 mx-auto p-0.5 3xl:max-h-full overflow-x-hidden overflow-y-scroll xl:flex-row xl:px-5 xl:w-full xl:max-w-full'>
        {/* Left Panel */}
        <div className='flex flex-col w-full gap-4'>
          <div className='w-full p-4 bg-white shadow-sm containerShadow'>
            <div className='w-full text-left bg-white'>
              <div className='mb-[1.2rem] flex items-start justify-between w-full'>
                <div className='relative flex-1 gap-2 text-sm font-semibold text-left text-black xl:text-base'>
                  <h1 className='inline text-left'>
                    {t(
                      'Patient_Scheduling_time_slots_weather.Expected_solar_radiation'
                    )}
                  </h1>
                  {titleToolTip}
                </div>
                {!disableHideWithoutSunscreenBtn && (
                  <button
                    onClick={() =>
                      setHideWithoutSunscreen(!hideWithoutSunscreen)
                    }
                    className='flex items-center mx-2 space-x-2 font-light underline text-cxs text-blue-lighter'
                  >
                    <img
                      src={hideWithoutSunscreen ? ShowIcon : HideIcon}
                      alt={t('Scheduled_session_modal.show_icon_alt')}
                    />
                    <p>
                      {hideWithoutSunscreen
                        ? t('Scheduled_session_modal.Show_without_sunscreen')
                        : t('Scheduled_session_modal.Hide_without_sunscreen')}
                    </p>
                  </button>
                )}
              </div>
              <div className='flex text-sm'>
                <div className='max-w-[10.5rem] flex flex-col mt-2 space-y-2'>
                  {hideWithoutSunscreen ? (
                    <>
                      <GraphLegend
                        title={t(
                          'Patient_Records_–_Report.PpIX-effective_dose'
                        )}
                        subtitle={`${t(
                          'Patient_Records_–_Report.Percent_min_ppix'
                        )} ${minPpix} J/cm²)`}
                        colour='bg-blue-lighter'
                        whitespace='xl:whitespace-nowrap'
                      />
                      <GraphLegend
                        title={t(
                          'Patient_Records_–_Report.erythemal_dose_with_sunscreen'
                        )}
                        subtitle={t(
                          'Patient_Records_–_Report.percent_patients_MED'
                        )}
                        colour='bg-SmartPDTorange'
                      />
                    </>
                  ) : (
                    <>
                      <GraphLegend
                        title={t(
                          'Scheduled_session_modal.PpIX-effective_dose_without_sunscreen'
                        )}
                        subtitle={`${t(
                          'Patient_Records_–_Report.Percent_min_ppix'
                        )} ${minPpix} J/cm²)`}
                        colour='bg-[#daecfa]'
                      />
                      <GraphLegend
                        title={t(
                          'Patient_Records_–_Report.erythema_dose_without_sunscreen'
                        )}
                        subtitle={t(
                          'Patient_Records_–_Report.percent_patients_MED'
                        )}
                        colour='bg-orange-light'
                      />
                    </>
                  )}
                </div>
                <ExpectedSolarRadiationChart
                  graphId={graphIDs?.solarRadiation || 'a'}
                  data={selectedDayData?.chartData || []}
                  hideWithoutSunscreen={hideWithoutSunscreen}
                />
              </div>
            </div>
          </div>
          <div className='p-4 bg-white shadow-sm containerShadow'>
            {/*   Solar irrdiance graph content goes here */}
            <h2 className='mb-5 text-base font-bold text-left text-black'>
              {t('Weather.card_title')}
            </h2>
            <div className='flex text-left'>
              <div className='text-sm text-black'>
                <div className='flex flex-col mt-6 space-y-6'>
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
              </div>
              <SolarChart
                height={200}
                graphId={graphIDs?.solar || 'b'}
                data={selectedDayData?.chartData || []}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='flex flex-col w-full gap-4'>
          <div className='p-4 bg-white shadow-sm containerShadow'>
            <div className='text-left bg-white'>
              <h1 className='mb-5 text-base font-semibold text-black'>
                {t('Weather.card_title.44')}
              </h1>
              <div className='flex text-sm'>
                <div className='flex flex-col mt-2 space-y-2'>
                  <GraphLegend
                    title={t('Weather.air_temperature_label')}
                    subtitle='ºC'
                    colour='bg-SmartPDTorange'
                    whitespace='whitespace-nowrap'
                  />
                </div>
                <TempChart
                  graphId={graphIDs?.temp || 'c'}
                  data={selectedDayData?.chartData || []}
                />
              </div>
            </div>
          </div>
          <div className='p-4 bg-white shadow-sm containerShadow'>
            {/*   Solar irrdiance graph content goes here */}
            <h2 className='mb-5 text-base font-bold text-left text-black'>
              {t('Scheduled_session_modal.precipitation')}
            </h2>
            <div className='flex text-sm'>
              <div className='text-sm text-black'>
                <div className='flex flex-col mt-6 space-y-6'>
                  <GraphLegend
                    title={t(
                      'Patient_Scheduling_time_slots_weather.precipitation'
                    )}
                    subtitle='(%)'
                    colour='bg-blue-lighter'
                    whitespace='whitespace-nowrap'
                  />
                </div>
              </div>
              <PrecipitationChart
                graphId={graphIDs?.precipitation || 'd'}
                data={selectedDayData?.chartData || []}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className='px-4 py-3 bg-white border'>
        <DiscardButton
          alt={t('Button_Back')}
          text={t('Button_Back')}
          onClick={() => {
            setSessionSummaryModal(true);
            setWeatherDetailsModal(false);
          }}
        />
      </footer>
    </div>
  );
}
