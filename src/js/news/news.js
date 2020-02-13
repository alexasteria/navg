import React from 'react';
import {
    Placeholder,
    Separator,
    Group,
    HorizontalScroll,
    FixedLayout,
    TabsItem,
    Tabs,
    Panel,
    PanelHeader,
    Cell,
    Div,
    Avatar
} from "@vkontakte/vkui"
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import Icon24UserIncoming from '@vkontakte/icons/dist/24/user_incoming';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';

class News extends React.Component {
    constructor (props) {
        super(props);

        this.state = {

        };
    }
    render(){
        return (
            <Div>
                <Group>
                    <Placeholder icon={<Avatar src={this.props.user.avatarLink} size={80}/>}>
                        Привет, {this.props.user.firstname}!
                    </Placeholder>
                    <Cell multiline>
                        Ты находишься в сервисе "Навигатор красоты". Здесь ты можешь найти мастера практически по любой области косметологии или предложить свои услуги.
                    </Cell>
                    <Cell
                        onClick={()=>this.props.openStory('masters')}
                        before={<Icon24UserIncoming />}
                        expandable
                    >Я клиент - ищу мастера</Cell>
                    <Cell
                        onClick={()=>this.props.openStory('lk')}
                        before={<Icon24UserOutgoing />}
                        expandable
                    >Я мастер - ищу клиентов</Cell>
                </Group>
                <Separator wide />
            </Div>
        );
    }
}

export default News;