import React from 'react';
import {PanelHeader, IOS, PanelHeaderButton, platform} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = platform();

class Head extends React.Component {
    render(){
        return (
            <PanelHeader
                theme="light"
                left={<PanelHeaderButton onClick={this.props.goBack}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</PanelHeaderButton>}
                addon={<PanelHeaderButton onClick={this.props.goBack}>Назад</PanelHeaderButton>}
            >{this.props.title}
            </PanelHeader>
        );
    }
}

export default Head;