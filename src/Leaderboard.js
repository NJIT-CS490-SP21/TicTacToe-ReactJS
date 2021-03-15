import React, { useState, useEffect } from 'react';

import Table from './Table';
import './Leaderboard.css';

function Leaderboard(props) {
  const socket = props;

  // LEADERBOARD
  const [boolLeaders, setBoolLeaders] = useState(false);
  const [leaders, setLeaders] = useState([]);

  function onClickLeaderboardButton() {
    if (boolLeaders === true) {
      setBoolLeaders(false);
    } else if (boolLeaders === false) {
      setBoolLeaders(true);
    }
  }

  useEffect(() => {
    socket.on('leaderboard', (data) => {
      // console.log('leaderboard event received!');
      // console.log(data);

      setLeaders(data);
    });
  }, []);

  if (boolLeaders) {
    return (
      <div>
        <leaderHeader> Leaderboard:</leaderHeader>
        <button type="submit" className="LeaderboardButton" onClick={onClickLeaderboardButton}>
          Hide
        </button>

        <Table leaders={leaders} user={props.user} />
      </div>
    );
  } if (!boolLeaders) {
    return (
      <div>
        <leaderHeader>Leaderboard:</leaderHeader>
        <button type="submit" className="LeaderboardButton" onClick={onClickLeaderboardButton}>
          Show
        </button>
      </div>
    );
  }
}

export default Leaderboard;
