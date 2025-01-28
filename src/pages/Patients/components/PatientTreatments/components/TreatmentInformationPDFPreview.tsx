import { AppProvider } from '~/AppProvider';
import { FormatSessionCardInfoType } from '../api/format';
import { useGetTreatmentInfoPdf } from '../api/query';
import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from '~/components/Loader';
import { createObjectURL } from '../api/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { PdfGenerationErrors } from '../api/api.types';
import { ReactComponent as ErrorPDFFileIcon } from 'assets/images/ic_file_error.svg';

type TreatmentInformationPDFPreviewProps = {
  isEnabled: boolean;
  selectedTreatmentData?: FormatSessionCardInfoType;
};

export default function TreatmentInformationPDFPreview({
  isEnabled,
  selectedTreatmentData,
}: TreatmentInformationPDFPreviewProps) {
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const queryClient = useQueryClient();
  const embedRef = useRef<HTMLEmbedElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfGenerationError, setPdfGenerationError] = useState(false);

  //* Get treatment information
  const { data: treatmentInformation, isLoading } = useGetTreatmentInfoPdf(
    user.token,
    selectedTreatmentData?.sessionUid || '',
    isEnabled
  );

  useEffect(() => {
    if (!treatmentInformation && isLoading) return;

    const timeInterval = setInterval(() => {
      if (pdfUrl === '') {
        queryClient.invalidateQueries('get-treatment-info-pdf');
      }
    }, 1000);

    if (pdfUrl !== '') return () => clearInterval(timeInterval);

    if (
      'error' in treatmentInformation &&
      (treatmentInformation?.error?.code ===
        PdfGenerationErrors.CONVERSION_FAILURE ||
        treatmentInformation?.error?.code ===
          PdfGenerationErrors.DOCUMENT_RENDERING_ERROR ||
        treatmentInformation?.error?.code ===
          PdfGenerationErrors.PDF_DOES_NOT_EXIST)
    ) {
      setPdfUrl('Error');
      setPdfGenerationError(true);
      clearInterval(timeInterval);
      toast.error(t('cert_generate_error'));
      queryClient.invalidateQueries('get-treatment-info-pdf');
    }

    //* if certificate exists
    if (!('error' in treatmentInformation)) {
      setPdfGenerationError(false);
      clearInterval(timeInterval);
      const url = createObjectURL(treatmentInformation);
      setPdfUrl(url);
      embedRef.current?.setAttribute('src', url);
    }

    return () => clearInterval(timeInterval);
  }, [treatmentInformation]);

  return (
    <div className='w-full h-full'>
      {(isLoading || pdfUrl === '') && (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <ClipLoader color='#1e477f' size={1.5} />
          <p className='text-sm text-black-light'> {t('Generating')}</p>
        </div>
      )}
      {!isLoading && pdfGenerationError && (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='w-12 h-12 mb-2 4xl:w-16 4xl:h-16'>
            <ErrorPDFFileIcon />
          </div>
          <p className='4xl:text-sm text-cxs'>
            {t('Error.treatment_information')}
          </p>
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
