import React from 'react';
import {Select} from "@vkontakte/vkui";


export default function FcarList(props) {
 return (
        <Select name="firm" id="firm">
            <option value="0">Выберите марку авто</option>
            {props.fcars.map(e => {
                return <option value={e.autoruid} key={e.autoruid}>{e.name}</option>
            })}
        </Select>
    )
}
function loadModels(fcar) {
    console.log('грузим модели '+fcar);
}