import React from 'react';
import {Group, Div, Cell, Avatar, List} from "@vkontakte/vkui"

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            comments: {
                id: '1',
                body: 'ТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТест',
                author: 'Тест Тестович',
                date: Date.now()
            }
        };
    }
    componentDidMount() {
        console.log('comments ', this.state.activeMasterId)
    }

    render(){
        return (
            <Group title="">
                <Div>
                    <List>
                        <Cell before={ <Avatar size={40} src="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg" /> }>{this.state.comments.author}</Cell>
                        <Cell multiline>{this.state.comments.body}</Cell>
                        <Cell>{Date.now()}</Cell>
                    </List>
                </Div>
            </Group>
        );
    }
}

export default MastersCard;