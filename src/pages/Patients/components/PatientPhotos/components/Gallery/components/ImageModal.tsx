import { TFunction } from 'react-i18next';
import { btnIcons } from 'utils/icons';

type ImageModalProps = {
  t: TFunction;
  image: string;
  setImageModal: (value: boolean) => void;
};

export default function ImageModal({
  t,
  image,
  setImageModal,
}: ImageModalProps) {
  return (
    <div className='w-[80vh] relative border border-gray-light rounded-md'>
      <button
        onClick={() => setImageModal(false)}
        className='leading-1 bg-black/80 absolute right-2 top-2 flex gap-0.5 items-center p-1 pr-2 text-white text-sm rounded-md'
      >
        <img src={btnIcons.close} alt='close' className='scale-[.80]' />{' '}
        {t('Button_Close')}
      </button>
      {image && (
        <img
          alt='expanded patient-img'
          src={`data:image/png;base64,${image}`}
          className='border-[0.5px] max-h-[80vh] mx-auto w-full h-full rounded-md object-contain'
        />
      )}
    </div>
  );
}
