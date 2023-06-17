import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CustomButton = (props) => {
  const { variant, text, startIcon, endIcon, onClick, disabled, size, sx } =
    props;

  const handleKeyPress = useCallback((event) => {
    if (event.keyCode === 13) {
      onClick(event);
    }
  });
  return (
    <>
      <Button
        variant={variant}
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
        size={size}
        sx={sx}
        onClick={onClick}
        onKeyDown={handleKeyPress}
      >
        {text}
      </Button>
    </>
  );
};

CustomButton.propTypes = {
  variant: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.string,
};

CustomButton.defaultProps = {
  variant: '',
  text: '',
  size: '',
  startIcon: '',
  endIcon: '',
  sx: '',
  disabled: false,
  onClick: () => {},
};

export default CustomButton;
