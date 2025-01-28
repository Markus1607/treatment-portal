import { useState } from 'react';
import { includes } from 'lodash';
import { btnIcons } from 'utils/icons';
import { TFunction } from 'react-i18next';
import { Suspense, useEffect } from 'react';
import { galleryIcons } from 'utils/icons';
import { ClipLoader } from 'components/Loader';
import Gallery from './components/Gallery/Gallery';
import ImageUploader, { ImageListType } from 'react-images-uploading';
import { Redirect, Route, Switch, Link, useLocation } from 'react-router-dom';
import {
  photos,
  gallery,
  analysis,
  patients,
  photoGallery,
  photoAnalysis,
} from 'routes';

type PatientPhotosProps = {
  t: TFunction;
  patientUid: string;
  patientUsername: string;
  setSubTitle: (value: string) => void;
};

export default function PatientPhotos({
  t,
  patientUid,
  setSubTitle,
  patientUsername,
}: PatientPhotosProps) {
  const { pathname } = useLocation();
  const [uploadedImage, setUploadedImage] = useState<ImageListType>([]);
  const isPageActive = (pageName: string) => includes(pathname, pageName);

  useEffect(() => setSubTitle(t('Patient.Photos')), [t, setSubTitle]);

  const onChange = (imageList: ImageListType) => {
    setUploadedImage(imageList);
  };

  const UploadButton = () => {
    return (
      <ImageUploader
        onChange={onChange}
        dataURLKey='data_url'
        value={uploadedImage}
        acceptType={['png', 'jpg', 'jpeg']}
      >
        {({ onImageUpload }) => (
          <button
            onClick={() => onImageUpload()}
            className='flex items-center gap-3 px-5 py-2 text-sm text-white rounded bg-blue hover:scale-y-105'
          >
            <img
              src={btnIcons.upload}
              alt='upload-btn-icon'
              className='scale-95'
            />
            <span>{t('global.upload_photo')}</span>
          </button>
        )}
      </ImageUploader>
    );
  };

  return (
    <div className='flex flex-col h-full max-h-full bg-dashboard'>
      <header className='flex items-center justify-between w-full gap-16 px-6 py-4 bg-white border shadow-sm'>
        <img
          className='w-32'
          alt='smartak-logo'
          src={galleryIcons.smartak_logo}
        />
        <div className='flex gap-12 mr-auto text-black-light'>
          <Link
            to={`${patients}/${patientUsername}/${photos}/${gallery}`}
            className={`border-b-4 py-1 ${
              isPageActive(gallery) ? 'border-blue text-black' : 'border-white'
            } `}
          >
            {t('option.gallery')}
          </Link>

          {/* TODO: Remove pointer-event-none to the link when page is ready */}
          <Link
            to={`${patients}/${patientUsername}/${photos}/${analysis}`}
            className={`border-b-4 py-1 hidden pointer-events-none cursor-not-allowed ${
              isPageActive(analysis) ? 'border-blue text-black' : 'border-white'
            } `}
          >
            {t('option.analysis')}
          </Link>
        </div>
        <UploadButton />
      </header>
      <main className='w-full h-full px-6 py-6 overflow-y-auto'>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
              <ClipLoader color='#1e477f' size={1} />
            </div>
          }
        >
          <Switch>
            <Route exact path={photoGallery}>
              <Gallery
                patientUid={patientUid}
                UploadButton={UploadButton}
                uploadedImage={uploadedImage}
                patientUsername={patientUsername}
                setUploadedImage={setUploadedImage}
              />
            </Route>
            <Route exact path={photoAnalysis}>
              <div>Analysis Page</div>
            </Route>
            <Route exact path='*'>
              <Redirect
                push
                to={`${patients}/${patientUsername}/${photos}/${gallery}`}
              />
            </Route>
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}
