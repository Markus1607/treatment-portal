import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  profile,
  termOfUse,
  systemInfo,
  loginAdmin,
  loginStaff,
  privacyPolicy,
} from 'routes';
import { AppProvider } from 'AppProvider';
import NavIcons, { IconType } from './NavIcons';
import { getUserInitials, getUserName } from '../utils';
import { useHandleUserLogout, useOnClickOutside } from 'utils/hooks';
import { ReactComponent as DropIcon } from 'assets/images/ic_dropdown.svg';

export default function UserLogout() {
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = user?.staffType === 'ADMIN';
  const [toggleMenu, setToggleMenu] = useState(false);

  useOnClickOutside(ref, () => setToggleMenu(false));

  const handleLogout = useHandleUserLogout();

  return (
    <div ref={ref} className='relative'>
      <div
        onClick={() => setToggleMenu(!toggleMenu)}
        className='rounded-[50%] text-[0.95rem] grid place-items-center w-10 h-10 text-center text-black font-bold bg-dashboard border border-blue-dark hover:border-gray-300 box-border cursor-pointer scale-105'
      >
        {getUserInitials(user)}
      </div>
      {toggleMenu && (
        <div className='top-[3.2rem] z-[999] absolute right-0 flex flex-col p-0 font-normal bg-blue border border-blue rounded overflow-hidden'>
          <div className='flex flex-col w-full'>
            <div className='flex justify-between w-full'>
              <span className='px-[4rem] py-1.5 text-center text-white whitespace-nowrap text-sm font-light'>
                {getUserName(user)}
              </span>
              <span className='px-2 py-2 bg-white border-b border-blue'>
                <DropIcon className='transform scale-75 rotate-180 text-blue-dark' />
              </span>
            </div>
            <div className='flex flex-col w-full px-4 py-4 pt-6 space-y-2 text-center text-blue bg-gray-lightest'>
              {!isAdmin && (
                <>
                  <NavLink
                    to={profile}
                    navIcon='ic_user'
                    text={t('Dashboard.Profile')}
                    onClick={() => setToggleMenu(false)}
                  />

                  <NavLink
                    to={systemInfo}
                    navIcon='ic_system_info'
                    text={t('my_info.link_text')}
                    onClick={() => setToggleMenu(false)}
                  />
                  <NavLink
                    to={privacyPolicy}
                    navIcon='ic_privacy_policy'
                    text={t('my_info.link_text.15')}
                    onClick={() => setToggleMenu(false)}
                  />
                  <NavLink
                    to={termOfUse}
                    navIcon='ic_terms_of_use'
                    text={t('terms_of_use.header')}
                    onClick={() => setToggleMenu(false)}
                  />
                </>
              )}

              <NavLink
                navIcon='ic_logout'
                text={t('Dashboard.Log_out')}
                onClick={() => handleLogout()}
                to={isAdmin ? loginAdmin : loginStaff}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type NavLinkPropType = {
  to: string;
  text: string;
  navIcon: IconType;
  onClick: () => void;
};

const NavLink = ({ to, onClick, text, navIcon }: NavLinkPropType) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className='block w-full px-4 text-sm hover:text-white hover:bg-blue hover:opacity-100'
    >
      <div className='flex gap-4 items-center py-2.5 text-left'>
        <span className='opacity-90'>
          <NavIcons icon={navIcon} />
        </span>
        <span className='block w-full whitespace-nowrap'>{text}</span>
      </div>
    </Link>
  );
};
