import React from 'react';
import spinner from "./img/spinner.svg";

export default function Spin(props){
    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <img src={spinner}/>
        </div>
    )
}