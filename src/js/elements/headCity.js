import React from 'react';
import {Cell, MiniInfoCell, SimpleCell, Subhead} from "@vkontakte/vkui";
import {connect} from "react-redux"

function indicator(city){
    if(city) {
        return city === 'Не определено' ? city : city.title
    }

}

function HeadCity(props){
    return(
        <SimpleCell
            expandable
            onClick={props.changeCity}
            indicator={<Subhead weight="regular">{indicator(props.targetCity)}</Subhead>}
        ><Subhead weight="regular">Выбранный город</Subhead></SimpleCell>
    )
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity
    };
};


export default connect(putStateToProps)(HeadCity);