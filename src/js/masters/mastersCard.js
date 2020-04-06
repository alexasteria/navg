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
    Spinner, Header, Card, CardGrid, CardScroll
} from "@vkontakte/vkui"
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from '../func/func';

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
            isLoad: false
        };
    }
    componentDidMount() {
        console.log(this.props);
        this.setState({activeMaster: this.props.activeMaster});
        this.loadFavs();
    }
    favStatus = () => {
        if(this.state.isFavourite.status === false) {
            return (
                        <Cell
                            onClick={this.checkFavs}
                            before={<Icon16LikeOutline width={20} height={20} fill="red"/>}
                           // description="на обновления"
                        >
                            Подписаться
                        </Cell>
            )
        } else {
            return (
                <CardGrid style={{padding: 0}}>
                    <Card size="l">
                        <Cell
                            before={<Icon16Like width={20} height={20} fill="red"/>}
                        >В избранных</Cell>
                    </Card>
                </CardGrid>
            )
        }
    }
    openSnackAvatar (text, avatarLink) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    //action="Отменить"
                    //onActionClick={() => this.setState({ text: 'Сообщение Ивану было отменено.' })}
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
                <Div>
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