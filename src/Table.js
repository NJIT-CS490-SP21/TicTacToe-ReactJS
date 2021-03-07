import React from 'react';
import './Table.css';

export function Table(props) {
    const leaders = props.leaders
    
    let result = [];
    var i;
    for (i = 0; i < leaders.length; i++) {
        if (leaders[i][0] == props.user){
            result.push(
                <tr class='highlight'>
                    <td>{leaders[i][0]}</td>
                    <td>{leaders[i][1]}</td>
                    <br />
                </tr>
            );
        } else {
            result.push(
                <tr>
                    <td>{leaders[i][0]}</td>
                    <td>{leaders[i][1]}</td>
                    <br />
                </tr>
            );
        }
        
    }
    
    return(<tableBody>{result}</tableBody>);
    
} 