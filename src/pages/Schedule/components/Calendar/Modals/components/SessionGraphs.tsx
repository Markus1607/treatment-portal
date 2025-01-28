import { Dispatch, SetStateAction } from 'react';
import ShowIcon from 'assets/images/ic_show.svg';
import HideIcon from 'assets/images/ic_hide.svg';
import { uniqueId } from 'lodash';
import { TFunction } from 'react-i18next';
import { sessionGraphDataType } from '../api/format.d';
import GraphLegend from 'components/Graphs/GraphLegend';
import SolarRadiationDoseChart from 'components/Graphs/SolarRadiationDoseChart';

type SessionGraphsProps = {
  minPpix: number;
  data: sessionGraphDataType;
  hideWithoutSunscreen: boolean;
  titleToolTip: string | JSX.Element;
  t: TFunction<'translation', undefined>;
  setHideWithoutSunscreen: Dispatch<SetStateAction<boolean>>;
  disableHideWithoutSunscreenBtn?: boolean;
};

function SessionGraphs({
  t,
  data,
  minPpix,
  titleToolTip,
  hideWithoutSunscreen,
  setHideWithoutSunscreen,
  disableHideWithoutSunscreenBtn,
}: SessionGraphsProps) {
  return (
    <div className='w-full p-4 pr-0 bg-white containerShadow'>
      <div className='flex items-center justify-between w-full mb-5'>
        <div className='relative items-center flex-1 gap-2 text-sm font-semibold text-left text-black xl:text-base'>
          <h1 className='inline text-left'>
            {t('Patient_Records_–_Report.card_title')}
          </h1>
          {titleToolTip}
        </div>
        {!disableHideWithoutSunscreenBtn && (
          <button
            onClick={() => setHideWithoutSunscreen(!hideWithoutSunscreen)}
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
        <div className='flex flex-col h-full mt-6 space-y-7'>
          {hideWithoutSunscreen ? (
            <>
              <GraphLegend
                title={t('Patient_Records_–_Report.PpIX-effective_dose')}
                subtitle={`${t(
                  'Patient_Records_–_Report.Percent_min_ppix'
                )} ${minPpix} J/cm²)`}
                colour='bg-blue-lighter'
                whitespace='xl:whitespace-nowrap'
                height='h-20'
              />
              <GraphLegend
                title={t(
                  'Patient_Records_–_Report.erythemal_dose_with_sunscreen'
                )}
                subtitle={t('Patient_Records_–_Report.percent_patients_MED')}
                colour='bg-SmartPDTorange'
                whitespace='xl:whitespace-nowrap'
                height='h-20'
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
                whitespace='xl:whitespace-nowrap'
                height='h-20'
              />
              <GraphLegend
                title={t(
                  'Patient_Records_–_Report.erythema_dose_without_sunscreen'
                )}
                subtitle={t('Patient_Records_–_Report.percent_patients_MED')}
                colour='bg-orange-light'
                whitespace='xl:whitespace-nowrap'
                height='h-20'
              />
            </>
          )}
        </div>
        <SolarRadiationDoseChart
          hideWithoutSunscreen={hideWithoutSunscreen}
          graphId={uniqueId('solar-chart-')}
          data={
            hideWithoutSunscreen
              ? [
                  {
                    name: t(
                      'Scheduled_session_modal.Erythemal_dose_with_sunscreen'
                    ),
                    value: data?.[0]?.erythermal_sunscreen_label || 0,
                    percentage: data?.[0]?.erythermal_sunscreen_percentage || 0,
                    unit: 'J/m²',
                  },
                  {
                    name: t(
                      'Scheduled_session_modal.PpIX-effective_dose_with_sunscreen'
                    ),
                    value: data?.[0]?.ppix_sunscreen_label,
                    percentage: data?.[0]?.ppix_sunscreen_percentage || 0,
                    unit: 'J/cm²',
                  },
                ]
              : [
                  {
                    name: 'Erythemal dose without sunscreen',
                    value: data?.[0]?.erythermal_no_sunscreen_label || 0,
                    percentage:
                      data?.[0]?.erythermal_no_sunscreen_percentage || 0,
                    unit: 'J/m²',
                  },
                  {
                    name: 'PpIX-effective dose without sunscreen',
                    value: data?.[0]?.ppix_no_sunscreen_label || 0,
                    percentage: data?.[0]?.ppix_no_sunscreen_percentage || 0,
                    unit: 'J/cm²',
                  },
                ]
          }
        />
      </div>
    </div>
  );
}

export default SessionGraphs;
