import { StaffData } from '../../RegisterStaff/api/format';

export function formatStaffPutData(obj: StaffData) {
  return {
    email: obj.email,
    forename: obj.forename,
    surname: obj.surname,
  };
}
