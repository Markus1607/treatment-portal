import { isNumber } from 'lodash';
import completeIcon from 'assets/images/ic_complete.svg';
import failedIcon from 'assets/images/ic_cross_red.svg';
import { TFunction } from 'react-i18next';
import {
  FormatSessionCardInfoType,
  CompletedProtocolAdherenceDataType,
} from '../api/format';
import { SessionTypeEnums } from '~/utils/options.d';
import { AppProvider } from '~/AppProvider';
import { getLabelFromID, getLabelFromKey } from '~/utils/functions';
import { emollient } from '~/utils/options';

export type ProtocolAdherenceDataType = {
  t: TFunction<'translation', undefined>;
  data: CompletedProtocolAdherenceDataType | null;
  selectedTreatmentData: FormatSessionCardInfoType | null;
};

export default function ProtocolAdherence({
  t,
  data,
  selectedTreatmentData,
}: ProtocolAdherenceDataType) {
  const { sunscreenList } = AppProvider.useContainer();

  const isAssistedTreatment =
    selectedTreatmentData?.sessionType === SessionTypeEnums.Assisted;
  const isSelfAppliedTreatment =
    selectedTreatmentData?.sessionType === SessionTypeEnums.SelfApplied;

  return (
    <div className='childrenContainer'>
      <div className='px-4 m-4 overflow-x-auto text-sm text-left bg-white containerShadow'>
        <table className='w-full min-w-full mt-3 mb-6 font-light whitespace-nowrap'>
          <thead>
            <tr className='pt-6 pb-2 text-black border-b-2 border-gray-light'>
              <th className='w-1/2'></th>
              <th className='py-2 font-medium'>
                {t('Patient_Records–protocol.expected')}
              </th>
              <th className='font-medium'>
                {t('Patient_Records–protocol.actual')}
              </th>
              <th className='font-medium'>
                {t('Patient_Records–protocol.adherence')}
              </th>
            </tr>
          </thead>
          <tbody className='text-black-light'>
            <tr className='border-b border-gray-light'>
              <th className='py-4 mr-2 font-medium text-black whitespace-normal'>
                {t('Patient_Records–protocol.indoor_time')}
              </th>
              <td>
                {data?.expectedIndoorTime
                  ? data.expectedIndoorTime + t('Minutes')
                  : `0 ${t('Minutes')}`}
              </td>
              <td>
                {isNumber(data?.actualIndoorTime)
                  ? data?.actualIndoorTime + t('Minutes')
                  : `0 ${t('Minutes')}`}
              </td>
              <td>
                <img
                  className='w-6 h-6'
                  alt={
                    data?.adherenceIndoorTime
                      ? t('Monitoring_.Complete')
                      : t('Monitoring_.Ongoing')
                  }
                  src={data?.adherenceIndoorTime ? completeIcon : failedIcon}
                />
              </td>
            </tr>
            <tr className='border-b last:border-b-0 border-gray-light'>
              <th className='py-4 font-medium text-black'>
                {t('Patient_Records–protocol.PpIX_dose')}
              </th>
              <td>{data?.expectedPdtDose || '-'}</td>
              <td>{data?.actualPdtDose || '-'}</td>
              <td>
                <img
                  className='w-6 h-6'
                  alt={
                    data?.adherencePdtDose
                      ? t('Monitoring_.Complete')
                      : t('Monitoring_.Ongoing')
                  }
                  src={data?.adherencePdtDose ? completeIcon : failedIcon}
                />
              </td>
            </tr>
            <tr className='border-b last:border-b-0 border-gray-light'>
              <th className='py-4 font-medium text-black'>
                {t('Patient_Records–protocol.average_temp')}
              </th>
              <td>{data?.expectedAvgTemp || '-'}</td>
              <td>{data?.actualAvgTemp || '-'}</td>
              <td>
                <img
                  className='w-6 h-6'
                  alt={
                    data?.adherenceAvgTemp
                      ? t('Monitoring_.Complete')
                      : t('Monitoring_.Ongoing')
                  }
                  src={data?.adherenceAvgTemp ? completeIcon : failedIcon}
                />
              </td>
            </tr>

            {(isAssistedTreatment || isSelfAppliedTreatment) && (
              <>
                <tr className='border-b border-gray-light'>
                  <th className='py-4 font-medium text-black'>
                    {t('Patient_Records–protocol.emollient_application')}
                  </th>
                  <td>
                    {data?.expectedEmollient
                      ? getLabelFromKey(data.expectedEmollient, emollient())
                      : '-'}
                  </td>
                  <td>
                    {data?.actualEmollient
                      ? getLabelFromKey(data.actualEmollient, emollient())
                      : '-'}
                  </td>
                  <td>
                    <img
                      className='w-6 h-6'
                      alt={
                        data?.adherenceEmollient
                          ? t('Monitoring_.Complete')
                          : t('Monitoring_.Ongoing')
                      }
                      src={data?.adherenceEmollient ? completeIcon : failedIcon}
                    />
                  </td>
                </tr>
                <tr className='border-b border-gray-light'>
                  <th className='py-4 font-medium text-black'>
                    {t('Patient_Records–protocol.alcohol_application')}
                  </th>
                  <td>{data?.expectedAlcohol || '-'}</td>
                  <td>{data?.actualAlcohol || '-'} </td>
                  <td>
                    <img
                      className='w-6 h-6'
                      alt={
                        data?.adherenceAlcohol
                          ? t('Monitoring_.Complete')
                          : t('Monitoring_.Ongoing')
                      }
                      src={data?.adherenceAlcohol ? completeIcon : failedIcon}
                    />
                  </td>
                </tr>
                <tr>
                  <th className='py-4 font-medium text-black'>
                    {t('Patient_Records–protocol.sunscreen_application')}
                  </th>
                  <td>
                    {data?.expectedSunscreen
                      ? getLabelFromID(data.expectedSunscreen, sunscreenList)
                      : '-'}
                  </td>
                  <td>
                    {data?.actualSunscreen
                      ? getLabelFromID(data.actualSunscreen, sunscreenList)
                      : '-'}
                  </td>
                  <td>
                    <img
                      className='w-6 h-6'
                      alt={
                        data?.adherenceSunscreen
                          ? t('Monitoring_.Complete')
                          : t('Monitoring_.Ongoing')
                      }
                      src={data?.adherenceSunscreen ? completeIcon : failedIcon}
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
