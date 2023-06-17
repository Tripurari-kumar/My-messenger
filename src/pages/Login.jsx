import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomButton from '../components/common/button/button';
import Logo from '../assets/logo.jpeg';
import RegisterBackGround from '../assets/registerBackground.jpg';
import styles from './Login.style';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [formState, setFormState] = useState({
    userName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [disableLoginBtn, setDisableLoginBtn] = useState(true);

  const handleFormInputs = (event, id) => {
    setFormState((prevState) => {
      return { ...prevState, [id]: event.target.value };
    });
  };
  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (!formState?.userName || !formState?.password) {
      setDisableLoginBtn(true);
    } else {
      setDisableLoginBtn(false);
    }
  }, [formState?.userName, formState?.password]);

  return (
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
        <Box sx={styles.logo}>FREE CHAT</Box>
        <TextField
          label={'UserName'}
          variant='outlined'
          value={formState?.userName}
          type={'text'}
          onChange={(event) => handleFormInputs(event, 'userName')}
          fullWidth
          margin='normal'
        />
        <TextField
          label={'Password'}
          variant='outlined'
          value={formState?.password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => handleFormInputs(event, 'password')}
          fullWidth
          margin='normal'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <CustomButton
            variant='contained'
            text={'Login'}
            sx={styles.loginBtn}
            disabled={disableLoginBtn}
            // onClick={onSubmitClick}
          />
        </Box>
        <Box sx={styles.loginAskMsg}>
          Don't have an Account?
          <Link href='/Register' sx={styles.login} color='inherit'>
            Register Now
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
