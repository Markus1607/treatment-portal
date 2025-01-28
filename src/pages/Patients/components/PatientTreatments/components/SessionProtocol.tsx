import { isNumber } from 'lodash';
import { TFunction } from 'react-i18next';
import { getLabelFromID, getLabelFromKey } from '~/utils/functions';
import { useRef, useLayoutEffect, MutableRefObject } from 'react';
import {
  diseasesTypes,
  emollient,
  prodrug,
  sessionTypeToLocationSource,
} from '~/utils/options';
import { NatPDTSessionDetailsType } from '../../PatientSchedule/api/format';
import { AppProvider } from '~/AppProvider';
import { SunscreenRequiredEnums } from '~/utils/options.d';

type SessionProtocolProps = {
  t: TFunction;
  scrollPosition: MutableRefObject<number>;
  data: NatPDTSessionDetailsType | undefined | null;
};

export default function SessionProtocol({
  t,
  data,
  scrollPosition,
}: SessionProtocolProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sunscreenList } = AppProvider.useContainer();

  useLayoutEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition?.current || 0;
    }
  }, [scrollPosition]);

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => (scrollPosition.current = e.currentTarget.scrollTop)}
      className='flex flex-col w-full h-full px-4 mx-auto overflow-y-auto font-light text-black bg-white text-[0.8rem] 4xl:text-sm'
    >
      <div className='flex justify-between gap-6 py-4 text-left border-b border-gray-light'>
        <p className='font-medium break-all'>{t('disease_type')}</p>
        <p className='text-right text-black-light'>
          {getLabelFromKey(data?.diseaseTypeUid as string, diseasesTypes()) ||
            '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Expected_location')}
        </p>
        <p className='text-right text-black-light'>
          {data?.expectedLocation.address || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>{t('location_source')}</p>
        <p className='text-right text-black-light'>
          {getLabelFromKey(data?.sessionType, sessionTypeToLocationSource()) ||
            '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Prodrug')}
        </p>
        <p className='text-right text-black-light'>
          {data?.prodrug ? getLabelFromKey(data?.prodrug, prodrug()) : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Minimum_duration')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.protocolDetails?.minDuration)
            ? data?.protocolDetails.minDuration + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Maximum_duration')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.protocolDetails.maxDuration)
            ? data?.protocolDetails.maxDuration + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Accumulated_indoor_time_allowed')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.protocolDetails.accIndoorTime)
            ? Math.floor(data?.protocolDetails.accIndoorTime) === 1
              ? `1 ${t('minute')}`
              : Math.floor(data?.protocolDetails.accIndoorTime) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>{t('ppix-dose-ques')}</p>
        <p className='text-right text-black-light'>
          {data?.protocolDetails.ppixDose
            ? data?.protocolDetails.ppixDose + ' J/cm²'
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Minimum_DLI')}
        </p>
        <p className='ml-8 text-right text-black-light whitespace-nowrap'>
          {isNumber(data?.protocolDetails.minDrugLight)
            ? Math.round(data?.protocolDetails.minDrugLight) === 1
              ? `1 ${t('minute')}`
              : Math.round(data?.protocolDetails.minDrugLight) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Maximum_DLI')}
        </p>
        <p className='ml-8 text-right text-black-light whitespace-nowrap'>
          {isNumber(data?.protocolDetails.maxDrugLight)
            ? Math.round(data?.protocolDetails.maxDrugLight) === 1
              ? `1 ${t('minute')}`
              : Math.round(data?.protocolDetails.maxDrugLight) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Emollient_application')}
        </p>
        <p className='text-right text-black-light'>
          {data?.protocolDetails.emollient
            ? getLabelFromKey(data?.protocolDetails.emollient, emollient())
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Alcohol_application')}
        </p>
        <p className='text-right text-black-light'>
          {data?.protocolDetails.alcohol === 'true' ? t('Yes') : t('No')}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Sunscreen_application')}
        </p>
        <p className='text-right text-black-light'>
          {[
            SunscreenRequiredEnums.Totally,
            SunscreenRequiredEnums.Specifically,
          ].includes(data?.sunscreenRequired as SunscreenRequiredEnums)
            ? data?.sunscreenTypeUid &&
              getLabelFromID(data?.sunscreenTypeUid, sunscreenList)
            : t('None')}
        </p>
      </div>
    </div>
  );
}
