import React from 'react';

function ListItem(props) {
  const name = props;
  return (
    <li>
      {' '}
      {name}
      {' '}
    </li>
  );
}

export default ListItem;
