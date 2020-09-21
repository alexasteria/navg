import React from 'react'
import {
    Separator,
    Avatar,
    Cell,
    List,
    Group,
    Banner,
    Button,
    Card,
    CardGrid,
    RichCell,
    Caption, Switch, Spinner, Header, Div, MiniInfoCell, CardScroll, Placeholder, Panel
} from "@vkontakte/vkui"
import Icon24Story from '@vkontakte/icons/dist/24/story'
import Icon24Like from '@vkontakte/icons/dist/24/like'
import Icon24Search from '@vkontakte/icons/dist/24/search'
import Icon24Write from '@vkontakte/icons/dist/24/write'
import bridge from "@vkontakte/vk-bridge"
import {connect} from "react-redux"
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline'
import Icon24StoryOutline from '@vkontakte/icons/dist/24/story_outline'
import {BACKEND} from "../func/func"
import Icon24List from '@vkontakte/icons/dist/24/list'
import Icon24Notification from '@vkontakte/icons/dist/24/notification'
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline'
import Icon16Down from '@vkontakte/icons/dist/16/down'
import Icon16Up from '@vkontakte/icons/dist/16/up'
import html2canvas from 'html2canvas'

class Lk extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            connection: false,
            tmpUser: [],
            isMaster: false,
            isUser: false,
            favsArr: [],
            mastersArr: [],
            countFavs: 0,
            promo: null,
            notifyStatus: null
        }
    }

    componentDidMount() {
        fetch(BACKEND.vkapi.notyStatus, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify({params: this.props.params}),
        })
            .then(res => res.json())
            .then(res => {
                this.setState({notifyStatus: res})
            })
            .catch(e => console.log(e))

        bridge.subscribe(e => {
            if (!e.detail) {
                return
            }

            const {type, data} = e.detail

            if (type === 'VKWebAppGetAdsResult') {
                this.setState({promo: data})
            }

            if (type === 'VKWebAppGetAdsFailed') {
                console.log(data.error_data)
            }

            if (type === 'VKWebAppShowWallPostBoxResult') {
                fetch(BACKEND.vkapi.repost,{
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json',},
                    redirect: 'follow',
                    referrer: 'no-referrer',
                    body: JSON.stringify({params: this.props.params}),
                })
            }

            if (type === 'VKWebAppShowStoryBoxLoadFinish') {
                fetch(BACKEND.vkapi.stories,{
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json',},
                    redirect: 'follow',
                    referrer: 'no-referrer',
                    body: JSON.stringify({params: this.props.params}),
                })
            }

            if (type === 'VKWebAppDenyNotificationsResult') {
                this.setState({notifyStatus: false})
            }

            if (type === 'VKWebAppAllowNotificationsResult') {
                if (data.result === true) {
                    this.setState({notifyStatus: true})
                    fetch(BACKEND.vkapi.push,{
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {'Content-Type': 'application/json',},
                        redirect: 'follow',
                        referrer: 'no-referrer',
                        body: JSON.stringify({params: this.props.params}),
                    })
                }
            }
        })
        bridge.send("VKWebAppGetAds", {})
            .then(data => console.log('Ads'))
            .catch(e => console.log(e))
    }

    notifyChange = () => {
        if (this.state.notifyStatus) {
            bridge.send("VKWebAppDenyNotifications")
        } else {
            bridge.send("VKWebAppAllowNotifications")
        }
    }

    wallPost = () => {
        const link = 'https://vk.com/app7170938'
        let prodsArr = this.props.master.priceList.map(prod => {
            return '&#9989;' + prod.title + '\n'
        })
        let prods = prodsArr.join('')
        bridge.send("VKWebAppShowWallPostBox", {
            "attachments": link + "#masterid=" + this.props.master._id,
            "message": "&#128522; Приглашаю записаться на: \n" + prods + "по специальным условиям в приложении Навигатор красоты. \n",
            "owner_id": this.props.master.vkUid,
            "copyright": link
        })
    }

    storiesPost = () => {
        bridge.send("VKWebAppShowStoryBox", {
            "background_type": "image",
            "url": "https://sun9-76.userapi.com/9CA7Ap-SWJm-bdeu9OWh1iXJP5BkaSbtx3zfKA/jcRS6sqPaP0.jpg",
            "locked": true,
            "attachment": {
                "text": "view",
                "type": "url",
                "url": "https://vk.com/app7170938#masterid=" + this.props.master._id
            },
            "stickers": [
                {
                    "sticker_type": "renderable",
                    "sticker": {
                        "transform": {
                            "relation_width": 0.9,
                            "translation_y": 0.25
                        },
                        "can_delete": 0,
                        "content_type": "image",
                        "url": "https://sun9-11.userapi.com/W7ljJxZlpaMD9EPafPeujRRV61xv7evo4P3DrA/f1HJkZgc7W0.jpg",
                        "clickable_zones": [
                            {
                                // "action_type": "app",
                                "action_type": "link",
                                "action": {
                                    "link": "https://vk.com/app7170938#masterid=" + this.props.master._id,
                                    "tooltip_text_key": "tooltip_open_page"
                                },
                                "clickable_area": [
                                    {
                                        "x": 0,
                                        "y": 0
                                    },
                                    {
                                        "x": 884,
                                        "y": 0
                                    },
                                    {
                                        "x": 884,
                                        "y": 196
                                    },
                                    {
                                        "x": 0,
                                        "y": 196
                                    }
                                ]
                            }
                        ]
                    }
                }]
        })
    }

    checkModeration = () => {
        const warningGradient = 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)'
        if (this.props.master.moderation.status === false) {
            if (this.props.master.moderation.reasons.length > 0) {
                return (
                    <Banner
                        before={
                            <Avatar size={28} style={{ backgroundImage: warningGradient }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                        }
                        header="Обнаружены ошибки:"
                        subheader={
                            <React.Fragment>
                                {
                                    this.props.master.moderation.reasons.map((reason, index) => {
                                        return <Div>{reason}</Div>
                                    })
                                }
                            </React.Fragment>
                        }
                        actions={<Button mode="tertiary" onClick={this.props.openSetting} >Исправить</Button>}
                    />
                )
            } else {
                return (
                    <Banner
                        before={
                            <Avatar size={28} style={{ backgroundImage: warningGradient }}>
                                <span style={{ color: '#fff' }}>!</span>
                            </Avatar>
                        }
                        header="Профиль на модерации"
                        subheader={
                            <React.Fragment>
                                Ваш профиль на проверке. В течение суток он будет доступен в поиске.
                            </React.Fragment>
                        }
                        //actions={<Button mode="tertiary">Отменить заявку</Button>}
                    />
                )
            }
        }
    };

    postData(url = '', data = {}) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(response => console.log('ok'))

    }

    addToFavApp = () => {
        bridge.send("VKWebAppAddToFavorites", {}).then(data => console.log(data))
    };

    render() {
        return (
            <React.Fragment>
                <Group separator={'hide'}>
                    {this.props.master !== null && this.checkModeration()}
                    <CardGrid>
                        <Card size="l">
                            <RichCell
                                disabled
                                multiline
                                before={<Avatar src={this.props.user.avatarLink} size={45}/>}
                                text={
                                    <Caption level="2" weight="regular">
                                        {this.props.master ? this.props.master.type : 'Пользователь'}
                                    </Caption>
                                }
                                after={this.props.master !== null && <Icon24Write onClick={this.props.openSetting}/>}
                            >
                                {this.props.user.firstname + ' ' + this.props.user.lastname}
                            </RichCell>
                        </Card>
                    </CardGrid>
                </Group>
                <Group title="Основное" separator={'hide'}>
                    <List>
                        <Cell
                            expandable
                            before={<Icon24Like/>}
                            onClick={this.props.openFavourite}
                        >Избранное</Cell>
                    </List>
                </Group>
                {
                    this.props.isFavourite === 0 ?
                        <Banner
                            header="Мы избранные"
                            subheader="Добавьте Навигатор красоты в список избранных приложений. Мы всего в одном клике от вас."
                            actions={<Button onClick={() => this.addToFavApp()}>Добавить</Button>}
                        /> :
                        null
                }
                {this.props.master !== null &&
                <React.Fragment>
                <Separator style={{margin: '12px 0'}}/>
                <Group header={<Header mode="secondary">Меню мастера</Header>}>
                    <List>
                        <Cell
                            before={<Icon24Notification/>}
                            asideContent={
                                this.state.notifyStatus === null ?
                                    <Spinner size="small"/> :
                                    <Switch
                                        name={'notify'}
                                        onChange={this.notifyChange}
                                        checked={this.state.notifyStatus}/>
                            }>
                            Уведомления о заявках
                        </Cell>
                        <Cell
                            expandable
                            before={<Icon24List/>}
                            onClick={this.props.openHistory}
                        >История заявок</Cell>
                        <Cell
                            expandable
                            before={<Icon24Story/>}
                            onClick={this.props.openMasterPhoto}
                        >Портфолио</Cell>
                        <Cell
                            expandable
                            before={<Icon24Search/>}
                            onClick={this.props.openFindModel}
                        >Поиск модели</Cell>
                    </List>
                    <Group header={<Header mode="secondary">Хотите больше просмотров?</Header>}>
                        <Div style={{display: 'flex'}}>
                            <Button before={<Icon24ShareOutline/>} size="m" stretched mode="primary" style={{ marginRight: 8 }} onClick={() => this.wallPost()}>На стену</Button>
                            <Button before={<Icon24StoryOutline/>} size="m" stretched mode="primary" onClick={() => this.storiesPost()}>В историю</Button>
                        </Div>
                    </Group>
                </Group>
                </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master,
        params: state.params
    }
}

export default connect(putStateToProps)(Lk)