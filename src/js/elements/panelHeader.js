import React from 'react';
import {PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";

const Head = (props) => {
    return (
        <PanelHeader
            theme="light"
            left={<PanelHeaderBack onClick={props.goBack} />}
        >{props.title}
        </PanelHeader>
    )
};

export default Head;