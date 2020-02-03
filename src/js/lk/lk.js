import React from 'react';
import VKConnect from '@vkontakte/vkui-connect-mock';
import {Separator, CellButton, Avatar, Button, Cell, List, Group} from "@vkontakte/vkui"
import {BACKEND} from '../func/func';

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: '',
                status: ''
            },
            tmpUser: {},
            notMaster: false,
            isMaster: false
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
                this.verifiedUser(this.state.user.vkUid);
            }
        });
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
    verifiedUser(vkUid) {
        fetch(BACKEND.users+'/vkuid/'+vkUid)
            .then(res => res.json())
            .then(user => this.setState({tmpUser: user}, () =>
                this.registerUser()
            ))
            .catch(error => {
                console.log(error); // Error: Not Found
            });

        fetch(BACKEND.masters+'/vkuid/'+vkUid)
            .then(res => res.json())
            .then(user => this.setState({tmpUser: user}, () =>
                this.authMaster()
            ))
            .catch(error => {
                console.log(error); // Error: Not Found
            });
        //console.log(this.state.tmpUser[0]);

    };
    authMaster(){
        if(this.state.tmpUser.length === 1 ){
            this.setState({notMaster: false});
            this.setState({isMaster: true});
            console.log('Авторизован, найден - мастер ');
        } else {
            this.setState({notMaster: true});
            this.setState({isMaster: false});
            console.log('Не найден - не мастер'  +this.state.newUser);
        }
    }
    registerUser() {
        if (this.state.tmpUser.length === 0) {
            console.log('Пользователь не найден');
            //console.log(this.state.user);
            this.postData(BACKEND.users, this.state.user).then(r => console.log(r)); //регитрируем
        }
        let copyUser = this.state.user;
        copyUser.status = this.state.tmpUser[0].status;
        this.setState({user: copyUser});
        //console.log(this.state.user);

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
            <Group>
                <Cell
                    size="l"
                    description={this.state.user.status}
                    before={<Avatar src={this.state.user.avatarLink} size={80}/>}
                >
                    {this.state.user.firstname+' '+this.state.user.lastname}
                </Cell>
                    {this.state.notMaster &&
                    <CellButton onClick={this.props.openReg}>Зарегистрироваться как мастер</CellButton>
                    }
                <Group title="Основное">
                    <Separator style={{ margin: '12px 0' }} />
                    <List>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Избранное</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Мои записи</Cell>
                    </List>
                </Group>
                {this.state.isMaster &&
                <Group title="Меню мастера">
                    <Separator style={{ margin: '12px 0' }} />
                    <List>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Мои заявки</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>График</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Портфолио</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Настройки</Cell>
                    </List>
                </Group>
                }
            </Group>
        );
    }
}

export default Lk;