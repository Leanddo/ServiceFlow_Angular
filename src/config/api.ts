export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  auth: {
    normalAuth: {
      login: `${API_BASE_URL}/auth/login`,
      signup: `${API_BASE_URL}/auth/signup`,
    },
    otp: {
      verify: `${API_BASE_URL}/auth/otp/checkOTP`,
      reSend: `${API_BASE_URL}/auth/otp/resendOTP`,
    },
    password: {
      forgotPassword: `${API_BASE_URL}/forgot-password`,
      forgotPasswordVerify: (token: string) =>
        `${API_BASE_URL}/reset-password/${token}`,
    },
    google: {
      login: `${API_BASE_URL}/auth/google`,
    },
  },
};
