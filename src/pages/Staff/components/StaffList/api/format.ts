export type StaffListResponseType = {
  staff_members: StaffMember[];
};

export type StaffMember = {
  email: string;
  forename: string;
  ins_uid: string;
  surname: string;
  tou_accepted: boolean;
  uid: string;
  username: string;
};

export function formatStaff(list: StaffListResponseType['staff_members']) {
  return list.map((staff) => {
    return {
      uid: staff.uid,
      forename: staff.forename || '',
      surname: staff.surname || '',
      email: staff.email || '',
    };
  });
}

export type StaffListDataType = ReturnType<typeof formatStaff>;

export type StaffMemberType = ReturnType<typeof formatStaff>[0];
