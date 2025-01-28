export type GetSaltResponseType = {
  salt: string;
};

export type LoginResponseType = {
  admin?: {
    username: string;
  };
  institution?: Institution;
  staff_member?: StaffMember;
  token: string;
};

export type Institution = {
  address: string;
  current_staff: number;
  email: string;
  key: null | string;
  lat: number;
  lon: number;
  max_staff: number;
  name: string;
  post_code: string;
  subscription_expiry: number;
  subscription_type: SubscriptionType;
  token_count: number;
  uid: string;
};

export type SubscriptionType = {
  duration: string;
  renew_duration: string;
  renew_staff_n: null;
  renew_token_n: number;
  staff_n: number;
  token_n: number;
  uid: string;
};

export type StaffMember = {
  email: string;
  forename: string;
  surname: string;
  tou_accepted: boolean;
  uid: string;
  username: string;
};
