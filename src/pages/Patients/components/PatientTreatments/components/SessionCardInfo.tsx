import { AppProvider } from '~/AppProvider';
import { statusIcons } from '~/utils/icons';
import { getFinishedReason } from '~/utils/functions';
import { FormatSessionCardInfoType } from '../api/format';
import warningIcon from 'assets/images/ic_warning.svg';
import { SessionStateEnums } from '../../PatientSchedule/api/query.d';
import { FinishedReasonsEnums } from '~/utils/options.d';
import { useGetAppAddress } from '../api/utils';

export const SessionCardInfo = (data: FormatSessionCardInfoType) => {
  const { t } = AppProvider.useContainer();

  const isCancelledTreatment =
    !!data &&
    data.sessionState === SessionStateEnums.COMPLETED &&
    data?.finishedReason !== FinishedReasonsEnums.Complete;

  const { appAddress } = useGetAppAddress({
    coordinates: data.coordinates,
    sessionType: data.sessionTypeRaw,
  });

  switch (data.sessionState) {
    case SessionStateEnums.SCHEDULED:
      return (
        <main className='flex flex-col w-full h-full p-4 px-5'>
          <div className='flex justify-between w-full pb-2 border-b align-center border-black-lighter/20'>
            <div>
              <p className='text-sm 4xl:text-[0.9rem] font-bold'>
                {data.diseaseTitle}
              </p>
            </div>
            <div className='min-w-[13rem] 4xl:min-w-[13.65rem]'>
              <p className='text-sm 4xl:text-[0.9rem] font-bold'>
                {data.sessionAddress || '-'}
              </p>
              <p className='text-xs 4xl:text-cxs text-black-lighter'>
                {data.addressSource}
              </p>
            </div>
          </div>
          <div className='flex justify-between pt-2 align-center'>
            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('treatment_status')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold items-center'>
                <img
                  src={
                    data.isTreatmentDeclined || data?.isTreatmentOverdue
                      ? warningIcon
                      : statusIcons.upcoming
                  }
                  alt='upcoming'
                />
                {data.isTreatmentDeclined
                  ? t('declined_by patient')
                  : data.isTreatmentOverdue
                  ? t('Dashboard.reschedule_required')
                  : t('Monitoring_.Scheduled')}
              </p>
            </div>

            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('Patient_Records_Report.Exposure_start_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.sessionStartTime}
              </p>
            </div>

            <div className='lg:min-w-[13rem] xl:min-w-min 4xl:min-w-[13.65rem]'>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('Dairy_list_estimated_end_time')}
              </p>
              <p className='flex gap-2 text-cxs 4xl:text-[0.9rem]  font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.estimatedEndTime}
              </p>
            </div>
          </div>
        </main>
      );

    case SessionStateEnums.RUNNING:
      return (
        <main className='flex flex-col w-full h-full p-4 px-5'>
          <div className='flex justify-between w-full pb-2 border-b align-center border-black-lighter/20'>
            <div>
              <p className='text-sm 4xl:text-[0.9rem] font-bold'>
                {data.diseaseTitle}
              </p>
            </div>
            <div className='min-w-[13rem] 4xl:min-w-[13.65rem]'>
              <p className='text-sm 4xl:text-[0.9rem] font-bold'>
                {appAddress || data.sessionAddress}
              </p>
              <p className='text-xs 4xl:text-cxs text-black-lighter'>
                {data.addressSource}
              </p>
            </div>
          </div>
          <div className='flex justify-between pt-2 align-center'>
            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('treatment_status')}
              </p>
              <p className='flex gap-2 text-[0.92rem] font-bold'>
                <img src={statusIcons.ongoing} alt='ongoing' />
                {t('Monitoring_.Ongoing')}
              </p>
            </div>

            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('Patient_Records_Report.Exposure_start_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.sessionStartTime}
              </p>
            </div>

            <div className='lg:min-w-[13rem] xl:min-w-min 4xl:min-w-[13.65rem]'>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {data.actualEndTime
                  ? t('actual_end_time')
                  : t('Dairy_list_estimated_end_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem]  font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.actualEndTime || data.estimatedEndTime}
              </p>
            </div>
          </div>
        </main>
      );

    case SessionStateEnums.PAUSED:
      return (
        <main className='flex flex-col w-full h-full p-4 px-5'>
          <div className='flex justify-between w-full pb-2 border-b align-center border-black-lighter/20'>
            <div>
              <p className='text-sm 4xl:text-[0.9rem]  font-bold'>
                {data.diseaseTitle}
              </p>
            </div>
            <div className='min-w-[13rem] 4xl:min-w-[13.65rem]'>
              <p className='text-sm 4xl:text-[0.9rem]  font-bold'>
                {appAddress || data.sessionAddress}
              </p>
              <p className='text-xs 4xl:text-cxs text-black-lighter'>
                {data.addressSource}
              </p>
            </div>
          </div>
          <div className='flex justify-between pt-2 align-center'>
            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('treatment_status')}
              </p>
              <p className='flex gap-2 text-[0.92rem] font-bold'>
                <img src={statusIcons.pending} alt='paused' />
                {t('Monitoring_.Paused')}
              </p>
            </div>

            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('Patient_Records_Report.Exposure_start_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.sessionStartTime}
              </p>
            </div>

            <div className='lg:min-w-[13rem] xl:min-w-min 4xl:min-w-[13.65rem]'>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {data.actualEndTime
                  ? t('actual_end_time')
                  : t('Dairy_list_estimated_end_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem]  font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.actualEndTime || data.estimatedEndTime}
              </p>
            </div>
          </div>
        </main>
      );

    case SessionStateEnums.COMPLETED:
      return (
        <main className='flex flex-col w-full h-full p-4 px-5'>
          <div className='flex justify-between w-full pb-2 border-b align-center border-black-lighter/20'>
            <div>
              <p className='text-sm 4xl:text-[0.9rem] font-bold'>
                {data.diseaseTitle}
              </p>
            </div>
            <div className='min-w-[13rem] 4xl:min-w-[13.65rem]'>
              <p className='text-sm 4xl:text-[0.9rem]  font-bold'>
                {appAddress || data.sessionAddress}
              </p>
              <p className='text-xs 4xl:text-cxs text-black-lighter'>
                {data.addressSource}
              </p>
            </div>
          </div>
          <div className='flex items-center justify-between w-full pt-2'>
            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('treatment_status')}
              </p>
              <p className='flex gap-1 text-sm 4xl:text-[0.9rem] font-bold items-center'>
                <img
                  src={
                    isCancelledTreatment
                      ? statusIcons.missed
                      : statusIcons.complete
                  }
                  alt={
                    isCancelledTreatment
                      ? t('Monitoring_.Missed')
                      : t('Monitoring_.Complete')
                  }
                />
                {isCancelledTreatment && data.finishedReason
                  ? getFinishedReason(data.finishedReason)
                  : t('Monitoring_.Complete')}
              </p>
            </div>
            <div>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {t('Patient_Records_Report.Exposure_start_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.sessionStartTime}
              </p>
            </div>
            <div className='lg:min-w-[13rem] xl:min-w-min 4xl:min-w-[13.65rem]'>
              <p className='text-xs font-light 4xl:text-cxs text-black-lighter'>
                {data.actualEndTime
                  ? t('actual_end_time')
                  : t('Dairy_list_estimated_end_time')}
              </p>
              <p className='flex gap-2 text-sm 4xl:text-[0.9rem] font-bold'>
                <img src={statusIcons.clock} alt='clock' />
                {data.actualEndTime
                  ? data.actualEndTime
                  : data.estimatedEndTime}
              </p>
            </div>
          </div>
        </main>
      );
    default:
      return null;
  }
};
