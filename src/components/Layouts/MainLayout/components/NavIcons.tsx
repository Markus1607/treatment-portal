import { ReactComponent as UserIcon } from 'assets/images/ic_user.svg';
import { ReactComponent as FeedbackIcon } from 'assets/images/ic_feedback.svg';
import { ReactComponent as LogoutIcon } from 'assets/images/ic_logout.svg';
import { ReactComponent as SystemInfo } from 'assets/images/ic_system_info.svg';
import { ReactComponent as TermsOfUse } from 'assets/images/ic_terms_of_use.svg';
import { ReactComponent as PrivacyPolicy } from 'assets/images/ic_privacy_policy.svg';

export type IconType =
  | 'ic_user'
  | 'ic_logout'
  | 'ic_feedback'
  | 'ic_system_info'
  | 'ic_terms_of_use'
  | 'ic_privacy_policy';

type NavIconsPropType = {
  icon: IconType;
};

const NavIcons = ({ icon }: NavIconsPropType) => {
  switch (icon) {
    case 'ic_user':
      return <UserIcon />;
    case 'ic_feedback':
      return <FeedbackIcon />;
    case 'ic_logout':
      return <LogoutIcon />;
    case 'ic_system_info':
      return <SystemInfo />;
    case 'ic_terms_of_use':
      return <TermsOfUse />;
    case 'ic_privacy_policy':
      return <PrivacyPolicy />;
    default:
      return null;
  }
};

export default NavIcons;
