import { useState, useEffect } from 'react';
import { Table } from './Table.js';
import io from 'socket.io-client';
import './Leaderboard.css';
export function Leaderboard(props) {
    const socket = props.socket;
    
    // LEADERBOARD
    const [boolLeaders, setBoolLeaders] = useState(false);
    const [leaders, setLeaders] = useState([]);
    
    function onClickLeaderboardButton() {
        if (boolLeaders == true) {
            setBoolLeaders(false);
        } else if (boolLeaders == false) {
            setBoolLeaders(true);
        }
    }
    
    
    useEffect(() => {
        socket.on('leaderboard', (data) => {
            console.log('leaderboard event received!');
            console.log(data);
            
            setLeaders(data);
        });
        
    }, []);

    if (boolLeaders) {
        return (
            <div>
                <leaderHeader> Leaderboard:</leaderHeader>
                <button class='LeaderboardButton' onClick={onClickLeaderboardButton}>Hide</button>
                
                <Table leaders={ leaders } user={props.user}/>
            </div>
            
        );
    } else if (!boolLeaders){
        return (
            <div>
                <leaderHeader>Leaderboard:</leaderHeader>
                <button class='LeaderboardButton' onClick={onClickLeaderboardButton}>Show</button>
            </div>
        );
        
    }
    
}