import React from 'react';
import VKConnect from '@vkontakte/vkui-connect-mock';
import {Avatar, Button, Cell, List, Panel, Group} from "@vkontakte/vkui"
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import {BACKEND} from '../func/func';

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: ''
            },
            tmpUser: {},
        };
    }
    componentDidMount() {
        VKConnect.subscribe((e) => {

            if (e.detail.type === 'VKWebAppGetUserInfoResult') {
                let user = this.state.user;
                user.vkUid = e.detail.data.id;
                user.firstname = e.detail.data.first_name;
                user.lastname = e.detail.data.last_name;
                user.avatarLink = e.detail.data.photo_200;
                this.setState({user: user});
                fetch(BACKEND.users+'/'+user.vkUid)
                    .then(res => res.json())
                    .then(user => this.setState({tmpUser: user}, () =>
                        this.registerUser(user)
                    ))
                    .catch(error => {
                       console.log(error); // Error: Not Found
                    });
            }
        });
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
    registerUser(user) {
        console.log(user);
        if (user.length === 0) {
            console.log('Пользователь не найден');
            console.log(this.state.user);
            this.postData(BACKEND.users, this.state.user).then(r => console.log(r)); //регитрируем
        }

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
            <Panel id="lk">
                <Group title="Основное">
                    <List>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Личная карточка</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Портфолио</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>График</Cell>
                    </List>
                </Group>
                <Group title="Ближайшие записи">
                    <List>
                        <Cell
                            before={<Avatar size={72} />}
                            size="l"
                            description="Сегодня 13:00"
                            asideContent={<Icon24MoreHorizontal />}
                            bottomContent={
                                <div style={{ display: 'flex' }}>
                                    <Button size="m">Написать</Button>
                                </div>
                            }
                        >
                            Анна Сергеевна</Cell>
                        <Cell
                            before={<Avatar size={72} />}
                            size="l"
                            description="Завтра 10:00"
                            asideContent={<Icon24MoreHorizontal />}
                            bottomContent={
                                <div style={{ display: 'flex' }}>
                                    <Button size="m">Написать</Button>
                                </div>
                            }
                        >
                            Алена Ковалева</Cell>
                    </List>
                </Group>
            </Panel>
        );
    }
}

export default Lk;