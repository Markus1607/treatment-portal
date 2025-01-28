import { Dispatch, Suspense, SetStateAction } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { ClipLoader } from '../Loader';

type ModalPropType = {
  overflow?: string;
  marginTop?: string;
  animation?: string;
  isVisible: boolean;
  maskColour?: string;
  maskOpacity?: number;
  closeOnEsc?: boolean;
  modalContent: JSX.Element;
  closeMaskOnClick?: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Modal({
  overflow,
  marginTop,
  isVisible,
  setVisible,
  closeOnEsc,
  animation,
  maskColour,
  maskOpacity,
  modalContent,
  closeMaskOnClick,
}: ModalPropType) {
  return (
    <Rodal
      duration={250}
      visible={isVisible}
      animation={animation ? animation : 'slideDown'}
      showCloseButton={false}
      customStyles={{
        //* This is for the main container, not the overlay
        padding: '0px',
        marginTop: marginTop ? marginTop : '1px',
        maxWidth: '100vw',
        maxheight: '100vh',
        marginLeft: 'auto',
        overflow: overflow ? overflow : 'hidden',
        marginRight: 'auto',
        width: 'max-content',
        height: 'max-content',
        borderRadius: '0.5rem',
        zIndex: 99999,
        ...(!marginTop && {
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
        }),
      }}
      customMaskStyles={{
        opacity: maskOpacity ? maskOpacity : 0.3,
        backgroundColor: maskColour ? maskColour : '#222',
      }}
      onClose={() => setVisible(false)}
      closeOnEsc={!closeOnEsc ? closeOnEsc : true}
      closeMaskOnClick={!closeMaskOnClick ? closeMaskOnClick : true}
    >
      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full p-40 mx-auto bg-white px-52'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        }
      >
        {modalContent}
      </Suspense>
    </Rodal>
  );
}
