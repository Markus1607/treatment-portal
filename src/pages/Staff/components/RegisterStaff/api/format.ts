export const defaultValues = {
  forename: '',
  surname: '',
  email: '',
};

export type StaffData = typeof defaultValues;

export function formatStaffPostData(obj: StaffData) {
  return {
    forename: obj.forename,
    surname: obj.surname,
    email: obj.email,
  };
}

export type StaffPostData = ReturnType<typeof formatStaffPostData>;
