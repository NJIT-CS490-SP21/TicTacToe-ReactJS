import React, { useState } from 'react';

import './Square.css';

function Square(props) {
  const [square, setSquare] = useState('');
  const onClick = props.onClick();
  const { index } = props;
  const { value } = props;

  function onClickBox() {
    onClick(index);
    setSquare(value);
  }

  return (
    <div className="box" onClick={() => onClickBox()}>
      {square}
    </div>
  );
}

export default Square;
