import { isNumber } from 'lodash';
import { useRef, useLayoutEffect, MutableRefObject } from 'react';
import { TFunction } from 'react-i18next';
import { SessionInfoDataType } from '../api/format';

type SessionProtocolProps = {
  t: TFunction;
  title?: string;
  scrollPosition: MutableRefObject<number>;
  data: SessionInfoDataType | undefined | null;
};

export default function SessionProtocol({
  t,
  data,
  title,
  scrollPosition,
}: SessionProtocolProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition?.current || 0;
    }
  }, [scrollPosition]);

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => (scrollPosition.current = e.currentTarget.scrollTop)}
      className={
        'monitoringScrollBar flex flex-col w-full min-h-full text-black font-light px-4 text-sm bg-white overflow-y-auto' +
        (title ? ' containerShadow pb-4 ' : '')
      }
    >
      {title && <p className='py-3 text-base font-semibold'>{title}</p>}
      <div className='flex justify-between py-4 text-left border-b gap-6 border-gray-light'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Session_type')}
        </p>
        <p className='text-right text-black-light'>
          {data?.sessionType || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Treatment_enviroment')}
        </p>
        <p className='text-right text-black-light'>
          {data?.treatmentEnvironment ? t('Outdoors') : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Expected_location')}
        </p>
        <p className='text-right text-black-light'>
          {data?.expectedLocation || '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Prodrug')}
        </p>
        <p className='text-right text-black-light'>{data?.prodrug || '-'}</p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Quantity_of_prodrug_to_be_applied')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.prodrugQuantity)
            ? data?.prodrugQuantity + ` ${t('option.units')}`
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Minimum_duration')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.minDuration) ? data?.minDuration + t('Minutes') : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Maximum_duration')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.maxDuration) ? data?.maxDuration + t('Minutes') : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Accumulated_indoor_time_allowed')}
        </p>
        <p className='text-right text-black-light'>
          {isNumber(data?.indoorTimeAllowed)
            ? Math.floor(data?.indoorTimeAllowed || 0 / 60) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>{t('ppix-dose-ques')}</p>
        <p className='text-right text-black-light'>
          {data?.minPpixDose && isNumber(data?.minPpixDose)
            ? Math.round(data?.minPpixDose / 10000) + ' J/cm²'
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Minimum_DLI')}
        </p>
        <p className='ml-8 text-right text-black-light whitespace-nowrap'>
          {isNumber(data?.minDLI)
            ? Math.round(data?.minDLI || 0 / 60) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Maximum_DLI')}
        </p>
        <p className='ml-8 text-right text-black-light whitespace-nowrap'>
          {isNumber(data?.maxDLI)
            ? Math.round(data?.maxDLI || 0 / 60) + t('Minutes')
            : '-'}
        </p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Emollient_application')}
        </p>
        <p className='text-right text-black-light'>{data?.emollient || '-'}</p>
      </div>
      <div className='flex justify-between py-4 border-b'>
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Alcohol_application')}
        </p>
        <p className='text-right text-black-light'>
          {data?.alcoholApplied || '-'}
        </p>
      </div>
      <div
        className={`flex justify-between py-4 ${
          title ? 'border-b mb-2' : '3xl:mb-2 xl:mb-8 mb-16'
        } `}
      >
        <p className='font-medium break-all'>
          {t('Monitoring–protocol.Sunscreen_application')}
        </p>
        <p className='text-right text-black-light'>
          {data?.sunscreenApplied || '-'}
        </p>
      </div>
    </div>
  );
}
