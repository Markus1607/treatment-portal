import { graphIdType } from '@types';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import ShowIcon from 'assets/images/ic_show.svg';
import HideIcon from 'assets/images/ic_hide.svg';
import { ModalTitle } from 'components/ModalTitle';
import SolarChart from 'components/Graphs/SolarChart';
import { DiscardButton } from 'components/Forms/Buttons';
import GraphLegend from 'components/Graphs/GraphLegend';
import { ChartDataType } from 'pages/Schedule/api/types/format';
import ExpectedSolarRadiationChart from 'components/Graphs/ExpectedSolarRadiationChart';

type AverageWeatherModalProps = {
  minPpix: number;
  graphIDs: graphIdType;
  titleToolTip: string | JSX.Element;
  timeZoneLabel: string;
  selectedDayData: {
    chartData: ChartDataType[];
    date: string;
    formattedDate?: string;
  };
  hideWithoutSunscreen: boolean;
  t: TFunction<'translation', undefined>;
  setSessionSummaryModal: Dispatch<SetStateAction<boolean>>;
  setWeatherDetailsModal: Dispatch<SetStateAction<boolean>>;
  setHideWithoutSunscreen: Dispatch<SetStateAction<boolean>>;
  disableHideWithoutSunscreenBtn?: boolean;
};

export default function AverageWeatherModal({
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
}: AverageWeatherModalProps) {
  const modalTitle = `${t('Patient')}  > ${t(
    'Dashboard_weather_modal_scheduling'
  )} > ${selectedDayData?.formattedDate} > ${t(
    'Dashboard_weather_modal_conditions'
  )}`;

  return (
    <div className='3xl:min-w-[100rem] 3xl:w-[100rem] max-w-[95vw] z-[102] md:min-w-[95vw] xl:min-w-[85rem] xl:w-[85rem] text-center text-black text-base bg-dashboard lg:w-full'>
      <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
        <h2 className='text-sm xl:text-lg'>{ModalTitle(modalTitle)}</h2>
        <h2 className='flex-shrink-0 text-sm xl:text-lg'>{timeZoneLabel}</h2>
      </header>
      <main className='2xl:min-w-[90rem] max-h-[60vh] 2xl:max-h-[60vh] md:min-w-[30rem] lg:max-w-[80%] lg:min-w-[55rem] xl:min-w-[85rem] flex flex-col gap-3 m-3.5 mx-auto p-0.5 overflow-x-hidden overflow-y-scroll xl:flex-row xl:px-5 xl:w-full xl:max-w-full'>
        {/* Left Panel */}
        <div className='xl:pb-[360px] flex flex-col gap-4 w-full'>
          <div className='w-full p-4 bg-white shadow-sm containerShadow'>
            <div className='w-full text-left bg-white'>
              <div className='mb-[1.25rem] flex items-start justify-between w-full'>
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
                <div className='flex flex-col mt-2 space-y-2'>
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
        </div>

        {/* Right Panel */}
        <div className='flex flex-col w-full gap-4'>
          <div className='p-4 bg-white shadow-sm containerShadow'>
            {/*   Solar irrdiance graph content goes here */}
            <h2 className='mb-5 text-base font-bold text-left text-black'>
              {t('Weather.card_title')}
            </h2>
            <div className='flex text-left'>
              <div className='text-sm text-black'>
                <div className='flex flex-col mt-6 space-y-6'>
                  <GraphLegend
                    title={t('Weather.eyrthema_graph_label')}
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
