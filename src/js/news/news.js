import React from 'react'
import {
    Placeholder,
    Group,
    Cell,
    Avatar,
    Spinner,
    CardGrid,
    Card,
    Button,
    CellButton,
    Banner,
    Counter,
    PanelHeader,
    Panel,
    Footer,
    PromoBanner,
    CardScroll,
    MiniInfoCell, Gradient, Header, Title
} from "@vkontakte/vkui"
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing'
import bridge from "@vkontakte/vk-bridge"
import {connect} from "react-redux"
import {BACKEND} from "../func/func"
import Icon56LikeOutline from '@vkontakte/icons/dist/56/like_outline'
import Icon56UserAddOutline from '@vkontakte/icons/dist/56/user_add_outline';

class News extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            feed: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            inGroup: false,
            isFav: 0,
            promo: null
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        if (this.props.params) {
            this.setState({isFav: Number(this.props.params.vk_is_favorite)})
        }
        fetch('https://mysterious-garden-57052.herokuapp.com/info/landing')
            .then(res => res.json())
            .then(data => {
                this.setState({countMasters: data.countMasters, countUsers: data.countUsers})
            })
        bridge.subscribe(e => {
            if (!e.detail) {
                return
            }

            const {type, data} = e.detail

            if (type === 'VKWebAppGetAdsResult') {
                this.setState({promo: data})
            }

        })
        bridge.send("VKWebAppGetAds", {})
            .then(data => console.log('ads'))
            .catch(e => console.log(e))
    }

    addToFav = () => {
        bridge.send("VKWebAppAddToFavorites", {})
            .then(data => {
                if (data.result === true) {
                    this.setState({isFav: 1})
                }
            })
            .catch(e => console.log(e))
    };

    favApp = () => {
        if (this.state.isFav === 0) {
            return (
                <Banner
                    before={<Avatar size={96}><Icon56LikeOutline fill={'#9fc6f3'}/></Avatar>}
                    subheader="Добавьте Навигатор красоты в список избранных приложений - все мастера будут всегда под рукой"
                    actions={<Button onClick={() => this.addToFav()}>Добавить в избранное</Button>}
                />
            )
        } else {
            return <Footer/>
        }
    };

    isMember = () => {
        fetch(BACKEND.vkapi.isMember, {
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
                if (res.ingroup === 1) {
                    return null
                } else {
                    return (
                        <Banner
                            before={<Avatar size={96}><Icon56UserAddOutline fill={'#9fc6f3'} /></Avatar>}
                            header="Будь в курсе новостей!"
                            subheader="Подпишись на наше сообщество ВКонтакте и следи за нововведениями"
                            actions={<Button onClick={() => this.joinGroup()}>Подписаться</Button>}
                        />
                    )
                }
            })
            .catch(e => console.log(e))
    };

    joinGroup = () => {
        bridge.send("VKWebAppJoinGroup", {
            group_id: 193179174
        })
            .then(this.isMember)
            .catch(e => console.log(e))
    };

    feedList = () => {
        return (
            this.state.feed.map(feed => {
                return (
                    <CardGrid>
                        <Card key={feed} size="l" mode="shadow">
                            <div style={{height: 96, backgroundColor: 'aliceblue'}}/>
                        </Card>
                    </CardGrid>
                )
            })
        )
    };

    userInfo = (user) => {
        return (
            <CardGrid>
                <Card size="l">
                    <Cell
                        photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                        description={
                            this.props.master === null ? 'Пользователь' : 'Авторизованный мастер'
                        }
                        before={<Avatar src={user.avatarLink} size={50}/>}
                        size="l"
                    >{user.firstname} {user.lastname}
                    </Cell>
                    {this.props.master === null &&
                    <Cell
                        style={{borderRadius: '0 0 10px 10px'}}
                        multiline
                        onClick={this.props.openReg}
                        before={<Icon24UserOutgoing/>}
                        expandable
                    >
                        Если Вы — мастер, пройдите простую процедуру регистрации
                    </Cell>
                    }
                </Card>
            </CardGrid>
        )
    };

    nowCounter = () => {
        return (
            <Group header={<Header mode="secondary">С нами уже</Header>}>
                <CardGrid>
                    <Card size="m">
                        <div style={{height: 50}}>
                            <div style={{textAlign: 'center', padding: '12%'}}>
                                {this.state.countUsers ? <Title style={{color: "#a9a9a9"}} level="1" weight="heavy">{this.state.countUsers}</Title> : <Spinner size="small" />}
                            </div>
                        </div>
                        <Footer style={{margin: 5}}>Пользователей</Footer>
                    </Card>
                    <Card size="m">
                        <div style={{ height: 50, position: 'relative' }}>
                            <div style={{textAlign: 'center', padding: '12%'}}>
                                {this.state.countMasters ? <Title style={{color: "#a9a9a9"}} level="1" weight="heavy">{this.state.countMasters}</Title> : <Spinner size="small" />}
                            </div>
                        </div>
                        <Footer style={{margin: 5}}>Мастеров</Footer>
                    </Card>
                </CardGrid>
            </Group>
        )
    };

    render() {
        const {user} = this.props
        return (
            <Panel id="news">
                <PanelHeader>Новости</PanelHeader>
                <Group>
                    <Placeholder
                        //style={{background: 'linear-gradient(#FFF, #f5e2e2, #FFF)'}}
                        icon={<Avatar
                            src="https://sun1-28.userapi.com/O4KZM7zfdhZ-zHP-LtRj_xrYiNSRdraBcCQe6Q/PLqKmK-NWTY.jpg?ava=1"
                            size={70}/>}
                        header="Привет!"
                    >
                        У нас можно найти бьюти-мастера или предложить свои услуги. База мастеров в разных городах
                        пополняется ежедневно.
                    </Placeholder>
                    {this.userInfo(user)}
                    {this.nowCounter()}
                    {this.isMember()}
                    {this.favApp()}
                    {/*{this.feedList()}*/}
                    {
                        user.vkUid === '199500866' &&
                        <CellButton onClick={this.props.openModer}>Модерация</CellButton>
                    }
                    {
                        this.state.promo !== null ?
                            <Card size="l" mode="shadow">
                                <PromoBanner bannerData={this.state.promo}
                                             onClose={() => this.setState({promo: null})}/>
                            </Card> :
                            null
                    }
                </Group>
            </Panel>
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

export default connect(putStateToProps)(News)