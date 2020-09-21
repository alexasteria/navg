import React from 'react'
import {
    Avatar, RichCell, Spinner, Placeholder, Link, Cell, Footer, Group, Div, Header, Button
} from "@vkontakte/vkui"
import '@vkontakte/vkui/dist/vkui.css'
import {BACKEND} from "../func/func"
import Head from "../elements/panelHeader"
import {connect} from "react-redux"
import Icon56PhoneOutline from '@vkontakte/icons/dist/56/phone_outline'
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline'
import Icon24StoryOutline from '@vkontakte/icons/dist/24/story_outline'
import bridge from "@vkontakte/vk-bridge";

class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            connectionList: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch(BACKEND.masters.history, {
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
            .then(res => this.setState({connectionList: res, isLoaded: true}))
            .catch(e => console.log(e))
    }

    getDate(comDate) {
        let date = new Date(comDate)
        let hours = date.getHours()
        if (hours < 10) hours = '0' + hours
        let minutes = date.getMinutes()
        if (minutes < 10) minutes = '0' + minutes
        let date1 = date.getDate()
        if (date1 < 10) date1 = '0' + date1
        let month = date.getMonth()
        if (month < 10) month = '0' + month
        return date1 + '.' + month + '.' + date.getFullYear() + ' в ' + hours + ':' + minutes
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


    render() {
        if (this.state.isLoaded === false) {
            return (
                <React.Fragment>
                    <Head
                        title="История заявок"
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        stretched
                        icon={<Spinner size="large" style={{marginTop: 20}}/>}
                        header={'Ищем-ищем...'}
                    />
                </React.Fragment>
            )
        } else if (this.state.connectionList.length === 0){
            return (
                <React.Fragment>
                    <Head
                        title="История заявок"
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        icon={<Icon56PhoneOutline />}
                        header="История заявок пуста"
                        action={<Div style={{display: 'flex'}}>
                            <Button before={<Icon24ShareOutline/>} size="m" stretched mode="primary" style={{ marginRight: 8 }} onClick={() => this.wallPost()}>На стену</Button>
                            <Button before={<Icon24StoryOutline/>} size="m" stretched mode="primary" onClick={() => this.storiesPost()}>В историю</Button>
                            </Div>}
                        stretched
                    >
                        Поделитесь со своими подписчиками Вашим профилем в приложении "Навигатор красоты"
                    </Placeholder>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Head
                        title="История"
                        goBack={() => this.props.goBack()}
                    />
                    <Group separator="hide">
                        {
                            this.state.connectionList.map(connect => {
                                return (
                                    <Div>
                                        <RichCell
                                            before={<Avatar size={72} src={connect.user.avatarLink}/>}
                                            text={connect.prod}
                                            caption={this.getDate(connect.date)}
                                            //bottom={<Button mode="destructive">В черный список</Button>}
                                        >
                                            {connect.user.name}
                                        </RichCell>
                                        <Cell><Link href={"https://vk.com/id" + connect.user.vkUid}>Ссылка на страницу
                                            ВКонтакте</Link></Cell>
                                        <Cell>Номер телефона - {connect.user.phone}</Cell>
                                    </Div>
                                )
                            })
                        }
                        <Footer style={{webkitUserSelect: 'none', userSelect: 'none'}}>На этом все. Записей всего
                            - {this.state.connectionList.length}.</Footer>
                    </Group>
                </React.Fragment>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master,
        params: state.params
    }
}

export default connect(putStateToProps)(History)