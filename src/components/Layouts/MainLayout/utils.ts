import { UserType } from '@types';

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + '...' : str;
};

export const getUserInitials = (user: UserType) => {
  if (user.staffType !== 'ADMIN') {
    const { firstName, lastName } = user;
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  }
  return 'AD';
};

export const getUserName = (user: UserType) => {
  if (user.staffType !== 'ADMIN') {
    const { firstName, lastName } = user;
    return `${firstName.charAt(0).toUpperCase()} ${truncate(lastName, 10)}`;
  }
  return 'Admin';
};
