import React from 'react';
import {
    Group,
    Cell,
    Separator,
    Div,
    Avatar,
    Counter,
    Snackbar,
    Spinner, Header, Card, CardGrid, CardScroll, Button, FormLayout
} from "@vkontakte/vkui"
import InputMask from 'react-input-mask';
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from '../func/func';
import bridge from "@vkontakte/vk-bridge";
import {patchData} from "../elements/functions";
import {connect} from "react-redux";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            snackbar: null,
            isChange: false
        };
    }

    componentDidMount() {
        fetch(BACKEND.masters.onID + this.props.activeMasterId)
            .then(res => res.json())
            .then(master => {
                this.props.setActiveMaster(master);
                this.setState({activeMaster: master}, ()=> this.loadFavs())
            });
    }

    componentWillUnmount() {
        if (this.state.isChange){ //если были изменения пишем в бд при разрушении ДОМ дерева
            patchData(BACKEND.users+'/'+this.state.user._id, this.state.user);
            if (this.state.isFavourite === true) {
                let count = {count: 1};
                patchData(BACKEND.masters.subscribers+this.state.activeMaster._id, count);
                //прибавляем счетчик мастера
            } else {
                let count = {count: -1};
                patchData(BACKEND.masters.subscribers+this.state.activeMaster._id, count);
                //убавляем счетчик
            }
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    favStatus = () => {
        if(this.state.isFavourite === false) {
            return (
                            <Div style={{float: 'left', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                                <Icon16LikeOutline width={30} height={30} fill="red"/>
                            </Div>
            )
        } else {
            return (
                    <Div style={{float: 'left', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                        <Icon16Like width={30} height={30} fill="red"/>
                    </Div>
            )
        }
    };
    connectStatus = (title) => {
        return (
            <Button onClick={() => this.getPhone(title)}>Записаться</Button>
        )
    };
    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866#masterid='+this.state.activeMaster._id})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };
    openSnackAvatar (text, avatarLink) {
        if (this.state.snackbar) this.setState({snackbar: null});
        this.setState({ snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    after={<Avatar src={avatarLink} size={32} />}
                >
                    {text}
                </Snackbar>
        });
    }
    loadFavs = () => {
        if (this.props.user.favs){
            if (this.props.user.favs.includes(this.state.activeMaster._id)){
                this.setState({isFavourite: true});
            } else {
                this.setState({isFavourite: false});
            }
        }
        this.setState({countFavs: this.state.activeMaster.subscribers, isLoad: true});
    };
    changeVisible = (index) => {
        this.setState({[index]: !this.state[index]})
    };
    checkFavs = () => {
        if (this.state.isFavourite === false) {
            let user = this.props.user;
            user.favs.push(this.state.activeMaster._id);
            this.setState({isFavourite: true, countFavs: this.state.countFavs+1, isChange: !this.state.isChange, user: user}, ()=>
                this.openSnackAvatar('Вы подписались на обновления мастера.', this.state.activeMaster.avatarLink));
        } else {
            let user = this.props.user;
            let index = this.props.user.favs.indexOf(this.state.activeMaster._id);
            let favs = this.props.user.favs;
            if (index > -1) {
                favs.splice(index, 1);
            } else favs.splice(0, index);
            this.setState({isFavourite: false, countFavs: this.state.countFavs-1, isChange: !this.state.isChange, user: user}, ()=>
                this.openSnackAvatar('Мастер удален из списка избранного.', this.state.activeMaster.avatarLink));
        }

    };
    sendMessage = () => {
        let message = "Привет! "+this.props.user.firstname+' '+this.props.user.lastname+' хочет записаться на '+this.state.sendtitle+'! Информация для связи: Телефон - +'+this.state.phone+', страница VK - http://vk.com/id'+this.props.user.vkUid;
        let token = BACKEND.keyGroup;
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "params": {"random_id": Math.random(), "peer_id": "-193179174", "user_id": this.state.activeMaster.vkUid,"message": message, "v":"5.103", "access_token": token}})
            .then(result => {
                this.setState({ snackbar: null });
                let mess = {
                    userId: this.props.user._id,
                    userVkUid: this.props.user.vkUid,
                    masterId: this.state.activeMaster._id,
                    masterVkUid: this.state.activeMaster.vkUid
                };
                this.postData(BACKEND.message, mess, 'POST');
                this.openSnackAvatar('Мы уведомили мастера, что вы хотите с ним связаться. Ожидайте.', this.state.activeMaster.avatarLink);
            })
            .catch(e => console.log(e))
    };
    getPhone = (title) => {
        this.setState({sendtitle: title});
        bridge.send("VKWebAppGetPhoneNumber", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
            .then(result => {
                this.setState({phone: result.phone_number});
                this.enterNumber(result.phone_number)
            })
            .catch(e => {
                console.log(e);
                if (e.error_data.error_reason==='User denied') {
                    this.enterNumber()
                }
            })
    };
    enterNumber = (number) => {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
                <Snackbar
                    duration='99999999999999'
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                >
                    <h2>Укажите номер телефона</h2>
                    <FormLayout>
                    <Div className="FormField Input Input--center">
                        <InputMask
                            className="Input__el"
                            mask="7 (999) 999-99-99"
                            name='phone'
                            type="text"
                            defaultValue={number || ''}
                            align="center"
                            value={this.state.phone}
                            onChange={this.handleChange}
                        />
                        <Div className="FormField__border"></Div>
                    </Div>
                    <p>Укажите номер телефона. Если мастер не сможет ответить прямо сейчас, он свяжется с вами.</p>
                    <Button onClick={this.sendMessage}>Отправить</Button>
                    </FormLayout>
                </Snackbar>
        });
    };
    postData(url = '', data = {}, method) {
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
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
        if(this.state.isLoad===false){
            return (
                <Spinner size="large" style={{ marginTop: 20 }} />
            )
        } else {
            return (
                <Div style={{padding: 0}}>
                    <Group title="">
                        <Cell
                            photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                            description={
                                this.state.activeMaster.type==='Организация' ? this.state.activeMaster.brand : this.state.activeMaster.type
                            }
                            bottomContent={
                                <Cell>
                                    {this.favStatus()}
                                    <Button onClick={() => this.share()}>Поделиться</Button>
                                </Cell>
                            }
                            before={<Avatar src={this.state.activeMaster.avatarLink} size={90}/>}
                            size="l"
                        >
                            {this.state.activeMaster.firstname} {this.state.activeMaster.lastname}
                        </Cell>
                        <Separator/>
                        <Cell expandable onClick={() => this.props.openComments()} indicator={this.state.activeMaster.comments.length}>Отзывы</Cell>
                        {/*{this.subscribers()}*/}
                        <Cell><Counter mode="primary">Подписчиков: {this.state.countFavs}</Counter></Cell>
                    </Group>
                    <Group title="Портфолио">
                        {
                            this.state.activeMaster.photos.length > 0 &&
                                <Div>
                                    <Cell>Последние работы мастера</Cell>
                                    <CardScroll>
                                        {
                                            this.state.activeMaster.photos.slice(0, 5).map((photoUrl, index) => {
                                                return (
                                                    <Card size="s">
                                                        <div key={index} style={{
                                                            width: 144,
                                                            height: 96,
                                                            backgroundImage: 'url('+photoUrl+')',
                                                            backgroundSize: 'cover'}} />
                                                    </Card>
                                                )
                                            })
                                        }
                                    </CardScroll>
                                </Div>
                        }
                        <Cell
                            expandable
                            onClick={() => this.props.openPhoto()}
                            description={
                                this.state.activeMaster.photos.length > 0 ?
                                    this.state.activeMaster.photos.length+' фото в портфолио' :
                                    'У мастера еще нет фотографий работ'
                            }
                            indicator={this.state.activeMaster.photos.length}
                        >Посмотреть все фото</Cell>
                    </Group>
                    <Group separator="hide">
                        {
                            this.state.activeMaster.priceList.map((item, index) => (
                                    <Cell
                                        key={index}
                                        multiline
                                        onClick={() => this.changeVisible(index)}
                                    >
                                        <CardGrid style={{padding: 0}}>
                                            <Card size="l">
                                                <Cell
                                                    description={'От ' + item.price + " рублей"}
                                                    expandable
                                                    indicator="">
                                                    {this.state.activeMaster.priceList[index].title}
                                                </Cell>
                                                {
                                                    this.state[index] &&
                                                    <Cell description="Краткое описание процедуры"
                                                          multiline>{this.state.activeMaster.priceList[index].body}
                                                    <Cell>{this.connectStatus(this.state.activeMaster.priceList[index].title)}</Cell>
                                                    </Cell>
                                                }
                                                <Separator></Separator>
                                            </Card>
                                        </CardGrid>
                                    </Cell>
                                )
                            )}
                    </Group>
                    <Group separator="hide" header={<Header mode="secondary">Информация о мастере</Header>}>
                        <Cell multiline>
                            {this.state.activeMaster.description}
                        </Cell>
                    </Group>
                    {this.state.snackbar}
                </Div>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(putStateToProps)(MastersCard);