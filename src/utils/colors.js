// src/utils/colors.js
export const COLORS = {
  themeColor: '#207cccff',
  textColor: '#8f9097',
  textHeading: '#59595dff',
  inputColour: '#7c7b7bff',
  TextColor: '#666',
  primaryBlue: '#007BFF',
  disabledGrey: '#CCCCCC',
  errorRed: '#FF0000',
  white: '#FFFFFF',
  black: '#020000',
  borderColor: '#e5dbdbff',
  gray: '#808080',
  lightGray: '#D3D3D3',
  darkGray: '#A9A9A9',
  transparent: 'rgba(0, 0, 0, 0.5)',
  Lightred: '#f6d4d1ff',
  red: '#c52210ff',
  black: '#000000',
  lightBlack: '#1a1a1a',
  lightWhite: '#eef3f8ff',
  yellow: '#f1c40f',
  green: '#2ecc71',
  lightgreen: '#D7F5CF',
  darkgreen: '#1b693cff',
  blue: '#3498db',
  purple: '#9b59b6',
  orange: '#e67e22',
  pink: '#ff69b4',
  brown: '#a52a2a',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  lime: '#00ff00',
  navy: '#000080',
  teal: '#008080',
  olive: '#808000',
  maroon: '#800000',
  silver: '#c0c0c0',
  gold: '#ffd700',
  peacock: '#114f71',
  lightSky: '#e3f2fd',
  lightPnk: "#FCECEC",
  pendingBg: '#F8DD72',
  pendingText: "#8A6F00",
  onHoldBg: '#D3D3D3',
  onHoldText: '#555555',
  completedBg: '#C8FAD1',
  completedText: '#0F8A43',
};

export const Fonts = {
  regular: 'PlusJakartaSans-Regular',
  italic: 'PlusJakartaSans-Italic',

  light: 'PlusJakartaSans-Light',
  lightItalic: 'PlusJakartaSans-LightItalic',

  medium: 'PlusJakartaSans-Medium',
  mediumItalic: 'PlusJakartaSans-MediumItalic',

  semiBold: 'PlusJakartaSans-SemiBold',
  semiBoldItalic: 'PlusJakartaSans-SemiBoldItalic',

  bold: 'PlusJakartaSans-Bold',
  boldItalic: 'PlusJakartaSans-BoldItalic',

  extraBold: 'PlusJakartaSans-ExtraBold',
  extraBoldItalic: 'PlusJakartaSans-ExtraBoldItalic',

  extraLight: 'PlusJakartaSans-ExtraLight',
  extraLightItalic: 'PlusJakartaSans-ExtraLightItalic',
};
// manage status colors globally
export const STATUS_CONFIG = {
  REQUESTED: { bg: '#fdfdfd', text: '#1565C0' },            // Soft Blue
  SCHEDULED: { bg: '#E8F5E9', text: '#2E7D32' },            // Green
  RESCHEDULED: { bg: '#FFF3E0', text: '#EF6C00' },          // Orange
  IN_PROGRESS: { bg: '#E1F5FE', text: '#0277BD' },          // Sky Blue
  HOLD: { bg: '#F3E5F5', text: '#7B1FA2' },                 // Purple
  PAYMENT_PENDING: { bg: '#FFF8E1', text: '#F9A825' },      // Amber
  COMPLETED: { bg: '#E8F5E9', text: '#1B5E20' },             // Dark Green
  CANCELLED: { bg: '#FFEBEE', text: '#C62828' },            // Red
  QUOTE_SHARED: { bg: '#E0F7FA', text: '#00838F' },         // Teal
  QUOTE_ACCEPTED: { bg: '#E8F5E9', text: '#2E7D32' },        // Green
  QUOTE_REJECTED: { bg: '#FFEBEE', text: '#B71C1C' },        // Dark Red
  BOOKING_CREATED: { bg: '#EDE7F6', text: '#512DA8' },      // Indigo
  INSPECTION_SCHEDULED: { bg: '#FFF3E0', text: '#E65100' }, // Deep Orange
  INSPECTION_COMPLETED: { bg: '#E8F5E9', text: '#1B5E20' },  // Green
  FOLLOW_UP_REQUIRED: { bg: '#FFFDE7', text: '#F57F17' },   // Yellow
};
