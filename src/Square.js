import { useState} from 'react';
import './Square.css'
export function Square(props){
    const [square,setSquare] = useState('');
    
    function onClickBox(){
        props.onClick(props.index)
        setSquare(props.value)
        
    }
    
    
    return (
        <div class="box" onClick={ onClickBox }>
            { props.value } 
        </div>    
    );
}