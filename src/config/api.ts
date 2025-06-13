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
    isLoggedIn: `${API_BASE_URL}/auth/is-logged-in`,
  },

  user: {
    profile: `${API_BASE_URL}/user/profile`,
    profileImage: `${API_BASE_URL}/user/profile`,
    changePassword: `${API_BASE_URL}/user/password`,
    deleteAccount: `${API_BASE_URL}/user/account`,
  },

  businesses: {
    isOwnner: (id: number) => `${API_BASE_URL}/business/${id}/is-owner`,
    getAll: `${API_BASE_URL}/business`,
    getAllBusinessesByProfessional: `${API_BASE_URL}/businesses/user`,
    create: `${API_BASE_URL}/business`,
    updateBusiness: (id: number) => `${API_BASE_URL}/business/${id}`,
    getById: (id: number) => `${API_BASE_URL}/business/${id}`,
    updateSinglePhoto: (id: number) => `${API_BASE_URL}/business/${id}/photo`,
    changeBusinessStatus: (id: number) =>
      `${API_BASE_URL}/business/${id}/status`,
    deleteBusiness: (id: number) => `${API_BASE_URL}/business/${id}`,

    services: {
      getBusinessService: (id: number) =>
        `${API_BASE_URL}/businesses/${id}/services`,
      getBusinessServicePrivate: (id: number) =>
        `${API_BASE_URL}/businesses/${id}/services/private`,
      createBusinessService: (id: number) =>
        `${API_BASE_URL}/businesses/${id}/services`,
      updateBusinessServices: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}`,
      getBusinessServicesByID: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}`,
      deleteBusinessServices: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}`,
      patchBusinessServiceStatus: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}/status`,
      updateBusinessServicesPhoto: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}/photo`,
      deleteBusinessServicesPhoto: (business_id: number, service_id: number) =>
        `${API_BASE_URL}/businesses/${business_id}/services/${service_id}/photo`,
    },

    photos: {
      getBusinessPhotos: (id: number) =>
        `${API_BASE_URL}/business/${id}/photos`,
      uploadBusinessPhotos: (id: number) =>
        `${API_BASE_URL}/business/${id}/photos`,
      deleteBusinessPhotos: (id: number, photo_id: number) =>
        `${API_BASE_URL}/business/${id}/photos/${photo_id}`,
    },

    professionals: {
      getPublicBusinessProfessionalsById: (id: number) =>
        `${API_BASE_URL}/business/${id}/professionals/public`,
      getPrivateBusinessProfessionalsById: (id: number) =>
        `${API_BASE_URL}/business/${id}/professionals/private`,
      inviteProfessionals: (id: number) =>
        `${API_BASE_URL}/business/${id}/professionals`,
      updateProfessionals: (id: number, business_id: number) =>
        `${API_BASE_URL}/business/${business_id}/professionals/${id}`,
    },
    updateStatus: (id: number) => `${API_BASE_URL}/business/${id}/status`,
  },

  rating: {
    getBusinessRatingAvg: (id: number) =>
      `${API_BASE_URL}/business/${id}/average-rating`,
    getBusinessReviews: (id: number) =>
      `${API_BASE_URL}/business/${id}/reviews`,
    createReview: (id: number) => `${API_BASE_URL}/services/${id}/reviews`,
  },

  queues: {
    getAvailableTimes: (serviceId: number | string, date: string) =>
      `${API_BASE_URL}/services/${serviceId}/queues/available-times/${date}`,
    createQueue: (serviceId: number | string) =>
      `${API_BASE_URL}/services/${serviceId}/queues`,
    createQueueOwner: (serviceId: number | string) =>
      `${API_BASE_URL}/services/${serviceId}/queues/owner`,
    getUserQueues: `${API_BASE_URL}/queues/user`,
    queueStatus: (queueId: number | string) =>
      `${API_BASE_URL}/queues/${queueId}/status`,
    getQueues: (business_id: number) => `${API_BASE_URL}/queues/${business_id}`,
  },
};
