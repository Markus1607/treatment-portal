import { getUserLanguage } from '~/utils/functions';
import { useQueryClient } from 'react-query';
import { AppProvider } from '~/AppProvider';
import {
  generateTreatmentCertificate,
  useGetTreatmentCertificate,
} from '../api/query';
import { FormatSessionCardInfoType } from '../api/format';
import { useEffect, useRef, useState } from 'react';
import { createObjectURL } from '../api/utils';
import toast from 'react-hot-toast';
import { ClipLoader } from '~/components/Loader';
import { PdfGenerationErrors } from '../api/api.types';
import { ReactComponent as ErrorPDFFileIcon } from 'assets/images/ic_file_error.svg';

type CertificatePreviewProps = {
  pdfGenerationError: boolean;
  isCompletedTreatment: boolean;
  selectedTreatmentData?: FormatSessionCardInfoType;
  setPdfGenerationError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CertificatePreview({
  pdfGenerationError,
  setPdfGenerationError,
  selectedTreatmentData,
  isCompletedTreatment,
}: CertificatePreviewProps) {
  const lang = getUserLanguage();
  const embedRef = useRef<HTMLEmbedElement>(null);
  const queryClient = useQueryClient();
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const [pdfUrl, setPdfUrl] = useState<string>('');

  //* Get treatment certificate
  const { data: treatmentCertificate, isLoading } = useGetTreatmentCertificate(
    user.token,
    selectedTreatmentData?.sessionUid || '',
    isCompletedTreatment
  );

  //* useEffect to handle certificate preview
  useEffect(() => {
    if (!treatmentCertificate && isLoading) return;

    if (
      'error' in treatmentCertificate &&
      treatmentCertificate?.error.code ===
        PdfGenerationErrors.PDF_DOES_NOT_EXIST
    ) {
      //No certificate found so generate one and upload to s3
      generateTreatmentCertificate(
        user.token,
        selectedTreatmentData?.sessionUid || '',
        lang
      )
        .then((data) => {
          if (data.status === 'Generating') {
            setPdfUrl('');
            setPdfGenerationError(false);
            setTimeout(() => {
              queryClient.invalidateQueries('get-treatment-certificate');
            }, 4000);
          }
        })
        .catch((err) => {
          setTimeout(() => {
            queryClient.invalidateQueries('get-treatment-certificate');
          }, 4000);
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    }

    //* if certificate generation is still in progress
    if (
      'error' in treatmentCertificate &&
      treatmentCertificate?.error?.code ===
        PdfGenerationErrors.GENERATION_INCOMPLETE
    ) {
      setPdfUrl('');
      queryClient.invalidateQueries('get-treatment-certificate');
      setTimeout(() => {
        queryClient.invalidateQueries('get-treatment-certificate');
      }, 4000);
    }

    //* if certificate exists
    if (!('error' in treatmentCertificate)) {
      setPdfGenerationError(false);
      const url = createObjectURL(treatmentCertificate);
      setPdfUrl(url);
      embedRef.current?.setAttribute('src', url);
    }

    //* if error occurs during pdf generation
    if (
      'error' in treatmentCertificate &&
      treatmentCertificate?.error?.code !==
        PdfGenerationErrors.GENERATION_INCOMPLETE
    ) {
      setPdfUrl('Error');
      setPdfGenerationError(true);
      toast.error(t('cert_generate_error'));
    }
  }, [
    embedRef,
    isLoading,
    treatmentCertificate,
    selectedTreatmentData?.sessionUid,
  ]);

  return (
    <div className='w-full h-full'>
      {(isLoading || pdfUrl === '') && (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <ClipLoader color='#1e477f' size={1.5} />
          <p className='mt-1 text-sm text-black-light'> {t('Generating')}</p>
        </div>
      )}
      {!isLoading && pdfGenerationError && (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='w-12 h-12 mb-2 4xl:w-16 4xl:h-16'>
            <ErrorPDFFileIcon />
          </div>
          <p className='4xl:text-sm text-cxs'>{t('Error.certificate')}</p>
        </div>
      )}
      {!isLoading && !pdfGenerationError && pdfUrl !== '' && (
        <embed
          src={pdfUrl}
          ref={embedRef}
          width='100%'
          height='100%'
          type='application/pdf'
        ></embed>
      )}
    </div>
  );
}
