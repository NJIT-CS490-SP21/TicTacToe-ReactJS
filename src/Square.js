import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Square.css';

function Square(props) {
  const [square, setSquare] = useState('');
  const { onClick, index, value } = props;

  function onClickBox() {
    onClick(index);
    setSquare(value);
  }

  return (
    <button type="submit" className="box" onClick={() => onClickBox()}>
      {square}
    </button>
  );
}

function doNothing() { }

Square.propTypes = {
  onClick: PropTypes.func,
  index: PropTypes.number,
  value: PropTypes.string,
};

Square.defaultProps = {
  onClick: doNothing(),
  index: 0,
  value: '',
};

export default Square;
