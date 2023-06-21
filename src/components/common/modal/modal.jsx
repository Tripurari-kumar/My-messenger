import * as React from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CustomButton from '../button/button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import styles from './modal.style.js';

export default function Modal (props) {
  const {
    open,
    showBackBtn,
    showClose,
    handleClose,
    title,
    desc,
    url,
    btnText1,
    btnText2,
    handleContinue,
    backBtnText,
    formContent,
    footerContent,
    handleCloseIcon,
    btnDisabled1,
    btnDisabled2, } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      {showBackBtn &&
        <Box className='back_btn_area' sx={styles.backBtnArea}>
          <ArrowBackIcon />
          {backBtnText}
        </Box>
      }
      {showClose &&
        <Box className='close_icon' sx={styles.closeIcon}
          onClick={handleCloseIcon}>
          <CloseIcon />
        </Box>
      }
      <DialogTitle variant='heading3'>
        {title}
      </DialogTitle>
      <DialogContent sx={formContent && styles.formContentArea}>
        <DialogContentText variant='bodyL'>
          {desc}
        </DialogContentText>
        {url &&
          <DialogContentText variant='bodyLBold' sx={styles.urlContainer}>
            {url}
          </DialogContentText>
        }
        {formContent &&
          <Box>
            {formContent}
          </Box>
        }
      </DialogContent>
      <DialogActions>
        {footerContent &&
          <Box sx={styles.footerContentArea}>
            {footerContent}
          </Box>
        }
        <CustomButton
          variant='outlined'
          size='large'
          text={btnText1}
          disabled={btnDisabled1}
          onClick={handleClose} />
        <CustomButton
          variant='contained'
          size='large'
          text={btnText2}
          disabled={btnDisabled2}
          onClick={handleContinue}
          sx={styles.marginLeft} />
      </DialogActions>
    </Dialog>
  );
}
Modal.propTypes = {
  open: PropTypes.bool,
  backBtnText: PropTypes.string,
  formContent: PropTypes.object,
  footerContent: PropTypes.object,
  title: PropTypes.string,
  desc: PropTypes.string,
  url: PropTypes.string,
  btnText1: PropTypes.string,
  btnText2: PropTypes.string,
  handleClose: PropTypes.func,
  handleContinue: PropTypes.func,
  showBackBtn: PropTypes.bool,
  showClose: PropTypes.bool,
  handleCloseIcon: PropTypes.func,
  btnDisabled1: PropTypes.bool,
  btnDisabled2: PropTypes.bool,
};

Modal.defaultProps = {
  open: false,
  backBtnText: '',
  formContent: '',
  footerContent: '',
  title: '',
  desc: '',
  url: '',
  btnText1: '',
  btnText2: '',
  showBackBtn: false,
  showClose: false,
  handleClose: () => { },
  handleContinue: () => { },
  handleCloseIcon: () => { },
  btnDisabled1: false,
  btnDisabled2: false,
};