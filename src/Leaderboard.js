import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

export function Leaderboard(props) {
    const socket = props.socket;
    
    // LEADERBOARD
    const [boolLeaders, setBoolLeaders] = useState(true)
    const [leaders, setLeaders] = useState(null);
    
    function onClickLeaderboardButton() {
        if (boolLeaders == true) {
            setBoolLeaders(false)
        } else if (boolLeaders == false) {
            setBoolLeaders(true)
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
                'Leaderboard:'
                hahahahahahah
                { leaders }
                
                <button class='LeaderboardButton' onClick={onClickLeaderboardButton}>Hide</button>
            </div>
            
        );
    } else if (!boolLeaders){
        return (
            <div>
                'Leaderboard:'
                <button class='LeaderboardButton' onClick={onClickLeaderboardButton}>Show</button>
            </div>
        );
        
    }
    
}