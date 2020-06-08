import React from 'react';
import {PanelHeader, PanelHeaderBack, PanelHeaderButton, platform} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = platform();

class Head extends React.Component {
    render(){
        return (
            <PanelHeader
                theme="light"
                left={<PanelHeaderBack onClick={this.props.goBack} />}
            >{this.props.title}
            </PanelHeader>
        );
    }
}

export default Head;