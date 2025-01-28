import { useState } from 'react';
import { signUpStaff } from 'routes';
import apiServer from 'server/apiServer';
import { AppProvider } from 'AppProvider';
import Modal from 'components/Modals/Modal';
import TermsOfUseModal from './TermsOfUseModal';
import { getStorageValue } from 'utils/functions';
import { useHandleUserLogout, useLocalStorage } from 'utils/hooks';
import OnboardingModal from 'pages/Main/components/OnboardingModal';

export default function Onboarding() {
  const {
    t,
    cookies: { user },
    setAcceptedCookies,
  } = AppProvider.useContainer();

  const [onboardNewUser, setOnboardNewUser] = useState(false);
  const [localTermsOfUse, setLocalTermsOfUse] = useLocalStorage<boolean>(
    'termsOfUse',
    false
  );
  const [termsOfUseModal, setTermsOfUseModal] = useState(
    !localTermsOfUse && !user?.termsOfUseAccepted
  );
  const storedOnboardState =
    getStorageValue('onboardNewUser', false) !== null ? false : true;
  const [localStorageOnboardNewUserValue, setLocalStorageOnboardNewUserValue] =
    useLocalStorage<boolean>('onboardNewUser', storedOnboardState);

  const handleOnboardingClose = () => {
    setOnboardNewUser(false);
    setLocalStorageOnboardNewUserValue(false);
    apiServer.put(
      `${signUpStaff}`,
      {
        staff_id: user.id,
        login_used: true,
      },
      {
        headers: {
          'x-access-tokens': user.token,
        },
      }
    );
  };

  const declineSuccess = () => setAcceptedCookies(false);
  const handleDecline = useHandleUserLogout(declineSuccess);

  const handleAccept = () => {
    setTermsOfUseModal(false);
    setLocalTermsOfUse(true);
    apiServer.put(
      `${signUpStaff}`,
      {
        staff_id: user.id,
        tou_accepted: true,
      },
      {
        headers: {
          'x-access-tokens': user.token,
        },
      }
    );
    if (localStorageOnboardNewUserValue === true && !user.loginUsed) {
      setOnboardNewUser(true);
    }
  };

  return (
    <>
      <Modal
        marginTop='auto'
        overflow='visible'
        isVisible={onboardNewUser}
        setVisible={handleOnboardingClose}
        modalContent={
          <OnboardingModal
            t={t}
            setOnboardingModal={setOnboardNewUser}
            handleOnboardingClose={handleOnboardingClose}
          />
        }
      />
      <Modal
        marginTop='auto'
        maskOpacity={1}
        animation='none'
        overflow='visible'
        closeOnEsc={false}
        maskColour='#F7F9FC'
        closeMaskOnClick={false}
        isVisible={termsOfUseModal}
        setVisible={setTermsOfUseModal}
        modalContent={
          <TermsOfUseModal
            t={t}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
          />
        }
      />
    </>
  );
}
