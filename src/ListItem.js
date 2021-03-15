import React from 'react';
import PropTypes from 'prop-types';

function ListItem(props) {
  const { name } = props;
  return (
    <li>
      {' '}
      {name}
      {' '}
    </li>
  );
}

ListItem.propTypes = {
  name: PropTypes.string,
};

ListItem.defaultProps = {
  name: '',
};

export default ListItem;
