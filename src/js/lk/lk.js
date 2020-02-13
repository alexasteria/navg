import React from 'react';
import {Div, Separator, CellButton, Avatar, Cell, List, Group} from "@vkontakte/vkui"
//import {BACKEND} from '../func/func';
import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon24Story from '@vkontakte/icons/dist/24/story';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import {BACKEND} from "../func/func";

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
        console.log(this.state.user);
        //this.verifiedUser(this.props.user);
    }
    /*verifiedUser = (user) => {
        console.log(BACKEND.users+'/vkuid/'+user.vkUid);
        fetch(BACKEND.users+'/vkuid/'+user.vkUid)
            .then(res => res.json())
            .then(usersArr => {
                if (usersArr.length === 0){
                    console.log('Пользователь ', user, ' не найден');
                    this.postData(BACKEND.users, user); //регитрируем
                } else {
                    console.log('Пришло при авторизации', usersArr[0]);
                    this.setState({user: usersArr[0]});
                }
            })
            .catch(error => {
                console.log(error); // Error: Not Found
            });
    };*/
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
                    before={<Avatar src={this.state.user.avatarLink} size={80}/>}
                >
                    {this.state.user.firstname+' '+this.state.user.lastname}
                </Cell>
                {this.state.user.isMaster === false &&
                    <CellButton
                        onClick={this.props.openReg}
                    >Зарегистрироваться как мастер</CellButton>
                }
                    <Group title="Основное">
                        <Cell
                            expandable
                            onClick={() => this.setState({ activePanel: 'nothing' })}
                            user={this.state.user}
                            indicator={this.state.user.city.title}
                        >Выбранный город</Cell>
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
                        onClick={() => this.setState({ activePanel: 'nothing' })}
                        indicator={'В разработке'}
                    >Портфолио</Cell>
                    <Cell
                        expandable
                        onClick={this.props.openSetting}
                        before={<Icon24Settings />}
                    >Настройки</Cell>
                    </List>
                    </Group>
                }
            </Div>
        );
    }
}

export default Lk;