import React from 'react';
import {Panel, View, Cell} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';


class Warn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};


    }

    render() {
        return(
            <View>
                <Panel>
                    <Cell>Доступ запрещен</Cell>
                </Panel>
            </View>
        )
    }
}



export default Warn;