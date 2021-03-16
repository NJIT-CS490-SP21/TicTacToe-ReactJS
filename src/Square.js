import React from 'react';
import PropTypes from 'prop-types';

import './Square.css';

function Square(props) {
  const { onClick, index, value } = props;

  function onClickBox() {
    onClick(index);
  }

  return (
    <button type="submit" className="box" onClick={() => onClickBox()}>
      {value}
    </button>
  );
}

function doNothing() {}

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
