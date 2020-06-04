import React from 'react';
import {Div, Separator, CellButton, Avatar, Cell, List, Group, Banner, Button, Switch} from "@vkontakte/vkui"
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

    checkModeration = () => {
        if (this.props.master.moderation.status === false) {
            return (
                <Cell multiline>Ваш профиль на проверке. В течении часа он будет доступен в поиске.</Cell>
            )
        }
    };

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

    addToFavApp = () => {
        bridge.send("VKWebAppAddToFavorites", {}).then(data=>console.log(data));
    };

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
                {this.checkModeration()}
                    <Group title="Основное" separator={'hide'}>
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
                {
                    this.props.isFavourite === 0 ?
                        <Banner
                            header="Мы избранные"
                            subheader="Добавьте Навигатор красоты в список избранных приложений. Мы всего в одном клике от вас."
                            actions={<Button onClick={()=>this.addToFavApp()}>Добавить</Button>}
                        /> :
                        null
                }
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