// ملف الثيم للتطبيق
const theme = {
    colors: {
      primary: {
        main: '#5e60ce',
        light: '#8687E7',
        dark: '#4849A8',
        gradient: 'linear-gradient(135deg, #5e60ce 0%, #4ea8de 100%)',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#64dfdf',
        light: '#97E8E8',
        dark: '#39B8B8',
        contrastText: '#000000',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
        muted: '#888888',
        light: '#FFFFFF',
      },
      background: {
        default: '#f8f9fa',
        paper: '#FFFFFF',
        dark: '#343a40',
      },
      status: {
        success: '#38b000',
        warning: '#ffbe0b',
        danger: '#ff5a5f',
        info: '#3a86ff',
      },
      border: '#e0e0e0',
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  };
  
  export default theme;