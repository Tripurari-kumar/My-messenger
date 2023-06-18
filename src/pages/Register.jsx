import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Container,
  Box,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import styles from './Register.style';
import CustomButton from '../components/common/button/button';
import Logo from '../assets/logo.jpeg';
import RegisterBackGround from '../assets/registerBackground.jpg';
import map from 'lodash/map';
import { formData } from './registerData';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { config } from '../utils/config';
import { isEmpty } from 'lodash';

function Register() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isFieldValuesValid, setIsFieldValuesValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loggedInInformation = localStorage.getItem('messenger-app-user');
  const [toastobj, setToastObj] = useState({
    open: false,
    isError: false,
    msg: '',
  });

  const handleClickShowPassword = (id) => {
    if (id === 'password') {
      setShowPassword((prevState) => !prevState);
    } else {
      setShowConfirmPassword((prevState) => !prevState);
    }
  };

  const handleFormInputs = (event, id) => {
    setFormState((prevState) => {
      return { ...prevState, [id]: event.target.value };
    });
  };
  const onSubmitClick = async () => {
    console.log(formState);
    const { userName, email, password } = formState;
    const { data } = await axios.post(config.registerRoute, {
      userName,
      email,
      password,
    });

    if (data?.status === false) {
      setToastObj({
        open: true,
        isError: true,
        msg: data?.msg,
      });
    } else if (data?.status === true) {
      localStorage.setItem('messenger-app-user', JSON.stringify(data.user));
      setToastObj({
        open: true,
        isError: false,
        msg: data?.msg,
      });
      setFormState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/profile');
    }
  };

  useEffect(() => {
    if (!isEmpty(loggedInInformation)) {
      navigate('/profile');
    }
  }, []);

  useEffect(() => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      formState?.userName.length < 8 ||
      !re.test(formState?.email) ||
      formState?.password !== formState?.confirmPassword ||
      formState?.password.length < 8
    ) {
      setIsFieldValuesValid(false);
    } else {
      setIsFieldValuesValid(true);
    }
  }, [formState]);

  const getErrorData = (id) => {
    switch (id) {
      case 'userName':
        if (formState?.userName?.length < 8 && formState?.userName) {
          return {
            isError: true,
            errorMsg: 'Username must be of more than 8 characters',
          };
        }

        break;
      case 'email':
        {
          let re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(formState?.email)) {
            if (formState?.email) {
              return {
                isError: true,
                errorMsg: 'entered email must be valid',
              };
            }
          }
        }
        break;
      case 'password':
        if (formState?.password.length < 8 && formState?.password) {
          return {
            isError: true,
            errorMsg: 'entered password must be greater than 8 characters',
          };
        }

        break;
      case 'confirmPassword':
        if (
          formState?.password !== formState?.confirmPassword &&
          formState?.confirmPassword
        ) {
          return {
            isError: true,
            errorMsg: `re-entered password  must match above password`,
          };
        }

        break;
      default: {
        return {
          isError: false,
          errorMsg: '',
        };
      }
    }
    return {
      isError: false,
      errorMsg: '',
    };
  };

  const getfieldType = (id) => {
    if (id === 'password') {
      return showPassword ? 'text' : 'password';
    } else {
      return showConfirmPassword ? 'text' : 'password';
    }
  };

  const handleClose = () => {
    setToastObj((prevState) => {
      return { ...prevState, open: false };
    });
  };

  return (
    <>
      <Snackbar
        open={toastobj?.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity={toastobj?.isError ? 'error' : 'success'}>
          {toastobj?.isError
            ? toastobj?.msg
            : 'User has been successfully Registered'}
        </Alert>
      </Snackbar>
      <Box sx={styles.wrapper}>
        <img
          src={RegisterBackGround}
          style={{ height: '100vh', width: '100%', position: 'absolute' }}
          alt={'logo-gif'}
        />
        <Container maxWidth='sm' sx={styles.container}>
          <img
            src={Logo}
            style={{ height: '250px', width: '250px' }}
            alt={'logo'}
          />
          <Box sx={styles.logo}>
            {/* <img sx={styles.logoIcon} src={Logo} alt={'logo'}/> */}
            FREE CHAT
          </Box>
          <Box>
            {map(formData, (field) => {
              switch (field?.type) {
                case 'password': {
                  return (
                    <TextField
                      label={field?.title}
                      error={getErrorData(field?.id)?.isError}
                      id='standard-error-helper-text'
                      key={field?.id}
                      variant='outlined'
                      value={formState?.[field?.id]}
                      type={getfieldType(field?.id)}
                      onChange={(event) => handleFormInputs(event, field?.id)}
                      fullWidth
                      helperText={getErrorData(field?.id)?.errorMsg}
                      margin='normal'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={() => handleClickShowPassword(field?.id)}
                              onMouseDown={() =>
                                handleClickShowPassword(field?.id)
                              }
                            >
                              {field?.id === 'password' ? (
                                showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )
                              ) : (
                                <></>
                              )}
                              {field?.id === 'confirmPassword' ? (
                                showConfirmPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )
                              ) : (
                                <></>
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  );
                }
                default: {
                  return (
                    <TextField
                      label={field?.title}
                      error={getErrorData(field?.id)?.isError}
                      id='standard-error-helper-text'
                      key={field?.id}
                      variant='outlined'
                      value={formState?.[field?.id]}
                      type={field?.type}
                      onChange={(event) => handleFormInputs(event, field?.id)}
                      fullWidth
                      helperText={getErrorData(field?.id)?.errorMsg}
                      margin='normal'
                    />
                  );
                }
              }
            })}
            <CustomButton
              variant='contained'
              sx={styles.registerbtn}
              text={'Register'}
              disabled={!isFieldValuesValid}
              onClick={onSubmitClick}
            />
          </Box>
          <Box sx={styles.loginAskMsg}>
            Already have an Account?
            <Link href='/login' sx={styles.login} color='inherit'>
              Login now
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Register;
