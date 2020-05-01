import React from 'react';
import {Cell} from "@vkontakte/vkui";

export default function HeadCity(props){
    return(
        <Cell
            style={{fontSize: 12, padding: 0}}
            expandable
            onClick={props.changeCity}
            indicator={props.userCity === 'Не определено' ? props.targetCity : props.userCity.title}><span style={{fontSize: 12}}>Выбранный город</span></Cell>
    )
}