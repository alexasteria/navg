import React from 'react';
import {Cell} from "@vkontakte/vkui";

function indicator(city){
    if(city) {
        return city === 'Не определено' ? city : city.title
    }

}

export default function HeadCity(props){
    return(
        <Cell
            style={{fontSize: 12, padding: 0}}
            expandable
            onClick={props.changeCity}
            indicator={indicator(props.targetCity)}
        ><span style={{fontSize: 12}}>Выбранный город</span></Cell>
    )
}