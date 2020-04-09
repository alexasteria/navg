import React from 'react';
import {
    Group,
    List,
    Cell,
    Separator,
    Div,
    Avatar,
    Counter,
    Gallery,
    Snackbar,
    UsersStack,
    Spinner, Header, Card, CardGrid, CardScroll, Button, Alert, Input,FormLayout
} from "@vkontakte/vkui"
import InputMask from 'react-input-mask';
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from '../func/func';
import bridge from "@vkontakte/vk-bridge";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {
                priceList: []
            },
            favsArr: [
                {vkUid:12523452}
            ],
            isFavourite: {
                status: false
            },
            isLoad: false,
            snackbar: null
        };
    }
    componentDidMount() {
        console.log(this.props);
        this.setState({activeMaster: this.props.activeMaster});
        this.loadFavs();
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        console.log(this.state);
    };
    favStatus = () => {
        if(this.state.isFavourite.status === false) {
            return (
                        <Cell>
                            <Div style={{float: 'left', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                                <Icon16LikeOutline width={30} height={30} fill="red"/>
                            </Div>
                            <Button onClick={() => this.getPhone()}>Записаться</Button>
                        </Cell>
            )
        } else {
            return (
                <Cell>
                    <Div style={{float: 'left', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                        <Icon16Like width={30} height={30} fill="red"/>
                    </Div>
                    <Button onClick={() => this.getPhone()}>Записаться</Button>
                </Cell>
            )
        }
    }
    openSnackAvatar (text, avatarLink) {
        if (this.state.snackbar) return;
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
    // subscribers = () => {
    //     return (
    //         <UsersStack
    //         photos={[
    //             'https://sun9-1.userapi.com/c850624/v850624456/9f63e/c2_IbBit7I8.jpg?ava=1',
    //             'https://sun9-6.userapi.com/c851528/v851528416/e0360/1UfQ8aSIGVA.jpg?ava=1'
    //         ]}
    //         size="s"
    //     >Настя и Jean и еще {this.state.countFavs} подписчиков</UsersStack>
    //     )
    // }
    loadFavs = () => {
        //console.log(BACKEND.favs.master+this.props.activeMaster._id);
        fetch(BACKEND.favs.master+this.props.activeMaster._id)
            .then(res => res.json())
            .then(favsArr => {
                this.setState({favsArr: favsArr});
                let count = favsArr.length;
                this.setState({countFavs: count});
                this.setState({isLoad: true})
                this.state.favsArr.map(fav => {
                    if (fav.userId === this.props.user._id) {
                        this.setState({isFavourite: {status: true, id: fav._id}});
                        //console.log('У тебя в избранном');
                    } else {
                        this.setState({isFavourite: {status: false}})
                        //console.log('Нет в избранном');
                    }
                });
            });
    }
    changeVisible = (index) => {
        this.setState({[index]: !this.state[index]})
    }
    checkFavs = () => {
        console.log('прежний статус '+this.state.isFavourite.status);
        if (this.state.isFavourite.status === false) {
            let fav = {
                userId: this.props.user._id,
                userVkUid: this.props.user.vkUid,
                masterId: this.state.activeMaster._id,
                masterVkUid: this.state.activeMaster.vkUid
            };
            this.postData(BACKEND.favs.new, fav, 'POST');
            this.setState({isFavourite: {status: true}});
            this.setState({countFavs: this.state.countFavs+1});
            this.openSnackAvatar('Вы подписались на обновления мастера. Отменить подписку можно во вкладке Кабинет, в разделе Избранное.', this.state.activeMaster.avatarLink);
        }

    };
    sendMessage = () => {
        let message = "Привет! "+this.props.user.firstname+' '+this.props.user.lastname+' хочет записаться к тебе! Информация для связи: Телефон - +'+this.state.phone+', страница VK - http://vk.com/id'+this.props.user.vkUid;
        let token = "f663eda6fd8aa562fdfc872f13411acc87a73fe01a5d9b8de8c99557a1ecb9a34d9b0aaced498c8daecdf";
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "params": {"random_id": Math.random(), "peer_id": "-193179174", "user_id": this.state.activeMaster.vkUid,"message": message, "v":"5.103", "access_token": token}})
            .then(result => {
                console.log(result);
                this.setState({ snackbar: null })
                this.openSnackAvatar('Мы уведомили мастера, что вы хотите с ним связаться. Ожидайте.', this.state.activeMaster.avatarLink);
            })
            .catch(e => console.log(e))
    };
    getPhone = () => {
        bridge.send("VKWebAppGetPhoneNumber", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
            .then(result => {
                console.log(result);
                this.setState({phone: result.phone_number});
                //this.sendMessage();
                this.enterNumber(result.phone_number)
            })
            .catch(e => {
                console.log(e);
                if (e.error_data.error_reason==='User denied') {
                    this.enterNumber()
                }
            })
    }
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
                    {/*<Input*/}
                    {/*    mask="7 (999) 999-99-99"*/}
                    {/*    inputmask="7 (999) 999-99-99"*/}
                    {/*    name='phone'*/}
                    {/*    type="text"*/}
                    {/*    defaultValue={number || ''}*/}
                    {/*    align="center"*/}
                    {/*    value={this.state.phone}*/}
                    {/*    onChange={this.handleChange}*/}
                    {/*/>*/}
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
                                this.favStatus()
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
                                                          multiline>{this.state.activeMaster.priceList[index].body}</Cell>
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

export default MastersCard;