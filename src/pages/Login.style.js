/* eslint-disable import/no-anonymous-default-export */
export default {
  wrapper: {
    backgroundColor: '#73BA1D',
    backgroundImage: 'url(../assets/registerBackground.jpeg)',
    height: '100vh',
    width: '100%',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '20px',
    zIndex: '999',
    height: '600px',
    width: '450px',
    boxShadow: 'rgba(42, 63, 77, 0.75) 10px 10px 12px 2px',
  },
  loginAskMsg: {
    padding: '10px',
    fontWeight: '500',
    fontSize: '20px',
    paddingBottom: '30px',
  },
  login: {
    marginLeft: '10px',
    color: '#1E6D58',
  },
  loginBtn: {
    height: '100%',
    color: '#fff',
    padding: '10px',
    backgroundColor: '#1E6D58',
    flex: 1,
    marginRight: '8px',
  },
  logo: {
    color: '#1E6D58',
    height: '50px',
    fontWeight: '800',
    fontSize: '30px',
    fontFamily: `Montserrat', sans-serif`,
  },
  logoIcon: {
    width: '300px',
    height: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
  },
  logoContainer: {
    display: 'flex',
  },
  snackbar: {
    zIndex: '10',
  },
  alert: {
    zIndex: '10',
  },
};
