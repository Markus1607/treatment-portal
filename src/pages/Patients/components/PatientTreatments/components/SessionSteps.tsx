import { statusIcons } from 'utils/icons';
import { useMemo, useRef, useLayoutEffect, MutableRefObject } from 'react';
import { getDateFromUnix, isValidUnixDate } from 'utils/functions';
import { isNumber, uniqueId } from 'lodash';
import { TFunction } from 'react-i18next';
import { SessionStepsDataType } from '../api/format';
import { SessionTypeEnums } from 'utils/options.d';

type StepDataType = {
  stepTitle: string;
  img?: string;
  imgAlt?: string;
  date?: string;
  time?: string;
};

const makeSessionData = (
  t: TFunction,
  data: SessionStepsDataType | null | undefined,
  isPaused: boolean
) => {
  if (!data) return [];
  //*left blank those which are not currently supported do not remove blank ones, undefined case handled. Can add these back in when ready
  const apiData = [
    data.emollient1,
    data.emollient2,
    data.emollient3,
    data.sunscreen,
    data.alcohol,
    data.sponged,
    data.prodrugApplied,
    data.pdtExposure,
    data.lesionWashed,
    data.pictureTaken,
    data.disposeProdrug,
  ];

  const stepStrings = [
    t('Monitoring_–_Steps.step1'),
    t('Monitoring_–_Steps.step2'),
    t('Monitoring_–_Steps.step3'),
    t('Monitoring_–_Steps.step4'),
    t('Monitoring_–_Steps.step5'),
    t('Monitoring_–_Steps.step6'),
    t('Monitoring_–_Steps.step7'),
    t('Monitoring_–_Steps.step9'),
    t('Monitoring_–_Steps.step10'),
    t('Monitoring_–_Steps.step12'),
    t('Monitoring_–_Steps.step13'),
  ];

  const stepData = apiData.map((data, index) => {
    const obj: StepDataType = {
      stepTitle: '',
    };
    obj.stepTitle = stepStrings[index];
    //* Handles this mapping
    //* Null = "To Do"
    //* Timestamp = "Complete"
    //* 0 = "Missed"
    //* -1 = "Not in this treatment"
    //* > 0 = time in miliseconds

    if (data === undefined) return null;

    if (data === null) {
      // === To Do
      const isRunning = index === 8 && isPaused;
      obj.img = isRunning ? statusIcons.running : statusIcons.not_applicable;
      obj.imgAlt = isRunning
        ? t('Monitoring_.Ongoing')
        : t('Monitoring_.Not_applicable');
    } else if (data === 0) {
      // === Missed
      obj.img = statusIcons.missed;
      obj.imgAlt = t('Monitoring_.Missed');
    } else if (data === -1) {
      // === Not in this treatment
      return null;
    } else {
      // === Complete (timestamp)
      obj.date =
        (isNumber(data) && isValidUnixDate(data)
          ? getDateFromUnix(data, 'D MMM YYYY')
          : `${data}`) || '-';
      obj.img = statusIcons.complete_blue;
      obj.imgAlt = t('Monitoring_.Complete');
      obj.time = (isNumber(data) && getDateFromUnix(data, 'HH:mm')) || '-';
    }
    return obj;
  });
  //* Handles different design for session steps for fully_assisted cases
  if (data.sessionTypeRaw === SessionTypeEnums.FullyAssisted) {
    return stepData.slice(8, 12);
  }
  return stepData;
};

const SessionStep = ({ data }: { data: StepDataType }) => {
  return (
    <div className='flex justify-between w-full py-4 font-light'>
      <div className='flex w-full'>
        <img
          src={data.img}
          alt={data.imgAlt}
          className='z-10 mx-5 bg-white rounded-full w-7 h-7 bg-clip-content'
        />
        <div className='flex flex-col text-left'>
          <p className='text-black-lighter'>{data.date ? data.date : ''}</p>
          <p className='font-medium text-black'>{data.stepTitle}</p>
        </div>
      </div>
      {data.time && <p className='w-full pt-5 mr-6 text-right'>{data.time}</p>}
    </div>
  );
};

type SessionStepsProps = {
  t: TFunction;
  title?: string;
  isPaused: boolean;
  scrollPosition: MutableRefObject<number>;
  data: SessionStepsDataType | null | undefined;
};

export default function SessionSteps({
  t,
  data,
  title,
  isPaused,
  scrollPosition,
}: SessionStepsProps) {
  const stepData = useMemo(
    () => makeSessionData(t, data, isPaused),
    [t, data, isPaused]
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition?.current || 0;
    }
    return () => {};
  }, []); //eslint-disable-line

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => (scrollPosition.current = e.currentTarget.scrollTop)}
      className={
        'monitoringScrollBar w-full h-full text-black-light text-sm bg-white overflow-y-auto' +
        (title ? ' containerShadow ' : '')
      }
    >
      {title && (
        <p className='px-4 py-3 text-base font-semibold text-black'>{title}</p>
      )}
      <div
        className={`min-h-min relative flex-col w-full text-sm ${
          title ? 'mb-2' : '3xl:mb-2 xl:mb-8 mb-16'
        }`}
      >
        <div className='absolute bottom-8 left-8 top-8 w-0.5 bg-gray-300 bg-clip-content' />
        {stepData &&
          stepData.map(
            (data) =>
              data && (
                <SessionStep data={data} key={uniqueId('session-step-')} />
              )
          )}
      </div>
    </div>
  );
}
