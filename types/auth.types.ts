export type SignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
};
