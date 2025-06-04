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
    logout: `${API_BASE_URL}/auth/logout`,
  },
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    profileImage: `${API_BASE_URL}/user/profile/image`,
    changePassword: `${API_BASE_URL}/user/password`,
    deleteAccount: `${API_BASE_URL}/user/account`,
  },
  businesses: {
    getAll: `${API_BASE_URL}/business`,
    create: `${API_BASE_URL}/business`,
    update: (id: number) => `${API_BASE_URL}/business/${id}`,
    getById: (id: number) => `${API_BASE_URL}/business/${id}`,
    services: {
      getBusinessService: (id: number) =>
        `${API_BASE_URL}/businesses/${id}/services`,
    },
    photos: {
      getBusinessPhotos: (id: number) =>
        `${API_BASE_URL}/business/${id}/photos`,
    },
    professionals: {
      getPublicBusinessProfessionalsById: (id: number) =>
        `${API_BASE_URL}/business/${id}/professionals/public`,
      getPrivateBusinessProfessionalsById: (id: number) =>
        `${API_BASE_URL}/business/${id}/professionals/private`,
    },
  },
  rating: {
    getBusinessRatingAvg: (id: number) =>
      `${API_BASE_URL}/business/${id}/average-rating`,
    getBusinessReviews: (id: number) =>
      `${API_BASE_URL}/business/${id}/reviews`,
  },
  queues: {
    getAvailableTimes: (serviceId: number | string, date: string) =>
      `${API_BASE_URL}/services/${serviceId}/queues/available-times/${date}`,
    createQueue: (serviceId: number | string) =>
      `${API_BASE_URL}/services/${serviceId}/queues`,
    getUserQueues: `${API_BASE_URL}/queues/user`,
    queueStatus: (queueId: number | string) =>
      `${API_BASE_URL}/queues/${queueId}/status`,
  },
};
