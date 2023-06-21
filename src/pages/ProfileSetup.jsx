import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from './ProfileSetup.style';
import ProfileBackground from '../assets/profileBackGround.jpg';
import ProfileBackCover from '../assets/profileBackCover.jpg';
import CustomButton from '../components/common/button/button';
import Logo from '../assets/logo.jpeg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import { config } from '../utils/config';
import axios from 'axios';
import moment from 'moment';

function ProfileSetup() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    dateOfBirth: new Date(),
    about: '',
  });
  const [postImage, setPostImage] = useState({ myFile: '' });
  const [toastobj, setToastObj] = useState({
    open: false,
    isError: false,
    msg: '',
  });
  const loggedInInformation = localStorage.getItem('messenger-app-user');
  const userData = JSON.parse(loggedInInformation);

  useEffect(() => {
    if (isEmpty(loggedInInformation)) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (userData?.isAvatarImageSet) {
      navigate('/');
    }
  }, []);

  const onEditClick = () => {
    document.getElementById('file-upload').click();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage((prevState) => {
      return {
        ...prevState,
        myFile: base64,
      };
    });
  };

  const onSaveClick = async () => {
    const { data } = await axios.post(
      `${config.profileRoute}/${userData?._id}`,
      {
        image: postImage?.myFile,
        dateOfBirth: profileData?.dateOfBirth,
        about: profileData?.about,
      }
    );
    if (data?.isSet) {
      userData.isAvatarImageSet = postImage?.myFile ? true : false;
      userData.avatarImage = data?.image;
      userData.dateOfBirth = data?.dateOfBirth;
      userData.about = data?.about;
      userData.isDataSet = postImage?.myFile ? true : false;
      localStorage.setItem('messenger-app-user', JSON.stringify(userData));
      navigate('/');
    } else {
      setToastObj({
        open: true,
        isError: true,
        msg: 'Error in saving user ddat, please try again!',
      });
    }
  };

  const handleClose = () => {
    setToastObj((prevState) => {
      return { ...prevState, open: false };
    });
  };

  const handleChange = (e, type) => {
    switch (type) {
      case 'calender': {
        setProfileData((prevState) => {
          return { ...prevState, dateOfBirth: convertLocalToUTC(e) };
        });
        break;
      }
      case 'input': {
        setProfileData((prevState) => {
          return { ...prevState, about: e.target.value };
        });
        break;
      }
      default: {
        setProfileData((prevState) => {
          return { ...prevState, about: e.target.value };
        });
      }
    }
  };
  function convertLocalToUTC(date) {
    if (date) {
      const date1 = new Date(date);
      const newDate = moment.utc(date1).format('YYYY-MM-DDTHH:mmZ').valueOf();
      return newDate;
    }
    return '';
  }

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
            : 'User profile data been successfully saved!'}
        </Alert>
      </Snackbar>
      <Box sx={styles.wrapper}>
        <img
          src={ProfileBackCover}
          style={styles.outerWrapper}
          alt={'profile'}
        />
        <img
          src={ProfileBackground}
          style={styles.innerWrapper}
          alt={'profile'}
        />
        <Box sx={styles.profileWrapper}>
          <label htmlFor='file-upload'>
            <img
              src={userData?.avatarImage || postImage?.myFile || avatar}
              alt=''
              style={styles.profileImg}
            />
          </label>
          <input
            type='file'
            lable='Image'
            name='myFile'
            id='file-upload'
            style={{ display: 'none' }}
            accept='.jpeg, .png, .jpg'
            onChange={(e) => handleFileUpload(e)}
          />
          <CustomButton
            variant='whiteOutlined'
            id={'edit-profile'}
            sx={styles.editProfile}
            text={postImage?.myFile ? 'Edit Profile Pic' : 'Upload Profile Pic'}
            onClick={onEditClick}
            size='small'
          />
          <Box sx={styles.editText}>
            You can edit your Profile or upload your new one. (jpg or png)
          </Box>
        </Box>

        <Box sx={styles.profileInfo}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={styles.logoSection}>
              <img
                src={Logo}
                style={{ height: '217px', width: '250px' }}
                alt={'logo'}
              />
              <Box sx={styles.logo}>
                {/* <img sx={styles.logoIcon} src={Logo} alt={'logo'}/> */}
                FREE CHAT
              </Box>
            </Box>
            <Typography variant='h4' sx={{ mt: 2 }}>
              {userData?.userName}
            </Typography>
            <Box style={styles.email}>
              <Typography variant='h6' sx={{ mt: 1 }}>
                {userData?.email}
              </Typography>
              <ForwardToInboxOutlinedIcon sx={{ mt: 1 }} />
            </Box>

            <Box sx={styles.calenderField}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <InputLabel
                  htmlFor={'Date of Birth'}
                  sx={styles.dateTitle}
                  shrink={false}
                >
                  Date of Birth :
                </InputLabel>
                <Box sx={styles.calender}>
                  <DatePicker
                    disableFuture={true}
                    // id={question.id}
                    inputFormat='MM/DD/YYYY'
                    //value={convertLocalToUTC(new Date().toString())}
                    onChange={(value) => handleChange(value, 'calnder')}
                    renderInput={(params) => (
                      <TextField {...params} variant='filled' />
                    )}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
            <Box sx={styles.textAreaWrapper}>
              <FormControl sx={styles.aboutContainer}>
                <TextareaAutosize
                  data-testid='box-change'
                  style={{ textAlign: 'left', padding: '10px 20px' }}
                  hintText='Message Field'
                  maxLength={255}
                  sx={styles.aboutArea}
                  value={profileData?.about || ''}
                  placeholder='About You.'
                  onChange={(e) => {
                    handleChange(e, 'input');
                  }}
                  floatingLabelText='MultiLine and FloatingLabel'
                  minRows={5}
                  maxRows={7}
                />
              </FormControl>
            </Box>
            <Box sx={styles.saveBtnWrapper}>
              <CustomButton
                variant='contained'
                sx={styles.saveBtn}
                text={
                  profileData?.about || postImage?.myFile
                    ? 'Save Changes'
                    : 'Skip'
                }
                size='small'
                onClick={onSaveClick}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ProfileSetup;
