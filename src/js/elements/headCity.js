import React from 'react';
import {Cell} from "@vkontakte/vkui";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

function indicator(city){
    if(city) {
        return city === 'Не определено' ? city : city.title
    }

}

function HeadCity(props){
    return(
        <Cell
            style={{fontSize: 12, padding: 0}}
            expandable
            onClick={props.changeCity}
            indicator={indicator(props.targetCity)}
        ><span style={{fontSize: 12}}>Выбранный город</span></Cell>
    )
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity
    };
};


export default connect(putStateToProps)(HeadCity);