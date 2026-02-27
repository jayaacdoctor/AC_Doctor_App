const endPoint = {
  LOGIN: 'user/login',
  VERIFY_OTP: 'user/verify-otp',
  RESET_OTP: 'user/resend-otp',
  USER_PROFILE: 'user/get-profile/',
  PRE_ASSIGNURL: 'user/profile-update/image-url',
  UPDATE_PROFILE: 'user/profile-update',
  UPDATE_USERDETAIL: 'user/get-profile/',
  NOTIFICATION: 'user/notification-list',
  DELETE_NOTIFICATION: 'user/notification/delete/',
  LOG_OUT: 'user/logout/',

  // Address service
  ADD_EDIT_ADDRESS: 'user/address-add-edit',
  ADDRESS_GET: 'user/address-list/',
  ADDRESS_DELETE: 'user/address-delete/',

  //  HOME
  AUTH_PATNER: 'user/partner-list', //GET
  SERVICE_CATEGORIES: 'user/service-list', //GET
  BANNER_HOME: 'user/home-screen-data',
  BRAND_LIST: 'user/brand/list', //Get

  // MY BOOKING
  BOOKING_LIST: 'user/booking-list/',
  BOOKING_DETAIL: 'user/booking-details/', //Get
  BOOKING_REQUEST: 'user/booking/create', //POST

  // free CONSULTANCY
  CREATE_CONSULT: 'user/consultancy/create',
  GET_ALLCONSULT: 'user/consultancy-list/', //GET
  GET_AMC: 'user/lead/list/', //GET
  POST_INTEREST: 'user/featured/product/interested',

  // feature Product
  FEATURED_PRODUCTS: 'user/featured/product-list',
  FEATURED_PRODUCT_DETAILS: 'user/featured/product',

  // Error code
  ERROR_POST: 'user/error-code/list',

  //  REQUREST SERVICE
  ERROR_CODES: 'user/error-code/list', //GET

  // AMC SERVICE
  AMC_REQUEST: 'user/lead/create', //POST

  // Old AMC SERVICE
  OLD_AC_REQUEST: 'user/enquiry/create', //POST
  OLD_AC_ID_REQUEST: 'user/equiry/data/', //POST
  CANCEL_RESHEDUL: 'user/enquiry/cancel', //POST
  RE_SCHEDUL_REQUEST: 'user/enquiry/reschedule', //POST
  ALL_OLD_REQUEST: 'user/myenquiry/list', //get
};
export default endPoint;
