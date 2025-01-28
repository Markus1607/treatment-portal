import { AppProvider } from 'AppProvider';
import { usePatientModel } from './query';
import { ClipLoader } from 'components/Loader';

export default function ArtificialPDTAvatar({
  configNumber,
  lesionName,
}: {
  configNumber: number;
  lesionName: string;
}) {
  const {
    cookies: { user },
  } = AppProvider.useContainer();
  const { isLoading, data } = usePatientModel(
    user.token,
    configNumber,
    lesionName
  );

  return isLoading ? (
    <div className='flex items-center justify-center mx-auto w-full h-full bg-white'>
      <ClipLoader color='#1e477f' size={1.5} />
    </div>
  ) : (
    <div className='ml-[-12rem] flex items-center justify-center h-full'>
      <iframe
        seamless
        width='100%'
        height='100%'
        srcDoc={data}
        loading='lazy'
        name='patientModel'
        title='Artificial 3D Avatar'
      ></iframe>
    </div>
  );
}
