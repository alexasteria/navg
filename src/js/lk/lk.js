import React from 'react';
import {Div, Separator, CellButton, Avatar, Cell, List, Group, Banner, Button} from "@vkontakte/vkui"
import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon24Story from '@vkontakte/icons/dist/24/story';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import bridge from "@vkontakte/vk-bridge";

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connection: false,
            user: this.props.user,
            tmpUser: [],
            isMaster: false,
            isUser: false,
            favsArr: [],
            mastersArr: [],
            countFavs: 0
        };
    }

    componentDidMount() {

    }
    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => console.log(response.json())); // парсит JSON ответ в Javascript объект

    }
    render(){
        return (
            <Div>
                <Cell
                    size="l"
                    description={this.state.user.status}
                    bottomContent={this.state.user.isMaster && <CellButton
                        onClick={this.props.openSetting}
                        before={<Icon24Write />}
                    >Редактировать</CellButton>}
                    before={<Avatar src={this.state.user.avatarLink} size={80}/>}
                >
                    {this.state.user.firstname+' '+this.state.user.lastname}
                </Cell>
                    <Group title="Основное" separator={'hide'}>
                        {/*<Cell*/}
                        {/*    //expandable*/}
                        {/*    onClick={() => this.setState({ activePanel: 'nothing' })}*/}
                        {/*    user={this.state.user}*/}
                        {/*    indicator={this.state.user.location.city.title}*/}
                        {/*>Ваш город</Cell>*/}
                        <Separator style={{ margin: '12px 0' }} />
                        <List>
                            <Cell
                                expandable
                                before={<Icon24Like />}
                                onClick={this.props.openFavourite}
                            >Избранное</Cell>
                            <Cell
                                expandable
                                before={<Icon24Recent />}
                                onClick={() => this.setState({ activePanel: 'nothing' })}
                                indicator={'В разработке'}
                            >Мои записи</Cell>
                        </List>
                    </Group>
                <Banner
                    before={<Avatar size={96} mode="image" src="https://sun9-32.userapi.com/uFzLOK55iY7pC0DHjneEdP9G6gXcXi2Mxj9wVA/wnTmzh_blNM.jpg" />}
                    header="Установите в ваше сообщество"
                    subheader="Если вы являетесь владельцем сообщества со схожей тематикой нашего приложения, установите Навигатор красоты в свою группу. Ваши подписчики смогут получить удобный инструмент для поиска мастеров."
                    actions={<Button>Установить в сообщество</Button>}
                />
                {this.state.user.isMaster &&
                    <Group title="Меню мастера">
                    <Separator style={{ margin: '12px 0' }} />
                    <List>
                    <Cell
                        expandable
                        before={<Icon24Users />}
                        onClick={() => this.setState({ activePanel: 'nothing' })}
                        indicator={'В разработке'}
                    >Мои заявки</Cell>
                    <Cell
                        expandable
                        before={<Icon24UserOutgoing />}
                        onClick={() => this.setState({ activePanel: 'nothing' })}
                        indicator={'В разработке'}
                    >График</Cell>
                    <Cell
                        expandable
                        before={<Icon24Story />}
                        onClick={this.props.openMasterPhoto}
                    >Портфолио</Cell>
                        <Cell
                            expandable
                            before={<Icon24Search />}
                            onClick={this.props.openFindModel}
                        >Поиск модели</Cell>
                    </List>
                    </Group>
                }
            </Div>
        );
    }
}

export default Lk;