import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

function Table(props) {
  const { leaders, user } = props;

  const result = [];
  let i;
  for (i = 0; i < leaders.length; i += 1) {
    if (leaders[i][0] === user) {
      result.push(
        <tr className="highlight">
          <td>{leaders[i][0]}</td>
          <td>{leaders[i][1]}</td>
          <br />
        </tr>,
      );
    } else {
      result.push(
        <tr>
          <td>{leaders[i][0]}</td>
          <td>{leaders[i][1]}</td>
          <br />
        </tr>,
      );
    }
  }

  return <tableBody>{result}</tableBody>;
}

Table.propTypes = {
  leaders: PropTypes.arrayOf(String),
  user: PropTypes.string,
};

Table.defaultProps = {
  leaders: [],
  user: '',
};

export default Table;
