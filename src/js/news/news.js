import React from 'react';
import {
    Placeholder,
    Group,
    Cell,
    Avatar, Spinner, CardGrid, Card, Button, CellButton, Banner, Counter, PanelHeader, Panel
} from "@vkontakte/vkui"
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";
import {BACKEND} from "../func/func";

class News extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            feed: [1,2,3,4,5,6,7,8,9],
            inGroup: false,
            isFav: 0
        };
    }

    componentDidMount() {
        if (this.props.params){
            this.setState({isFav: Number(this.props.params.vk_is_favorite)})
        }
        fetch('https://mysterious-garden-57052.herokuapp.com/info/landing')
            .then(res => res.json())
            .then(data => {
                this.setState({countMasters: data.countMasters, countUsers: data.countUsers, countCities: data.countCities, cities: data.cities.sort()})
            });
    }

    addToFav = () => {
        bridge.send("VKWebAppAddToFavorites", {})
            .then(data => {
                if (data.result === true){
                    this.setState({isFav: 1})
                }
            })
            .catch(e => console.log(e))
    };

    favApp = () => {
        if (this.state.isFav === 0){
            return (
                <Banner
                    subheader="Добавьте Навигатор красоты в список избранных приложений - все мастера будут всегда под рукой"
                    actions={<Button onClick={()=>this.addToFav()}>В избранные</Button>}
                />
            )
        }
    };

    isMember = () => {
        const data = {
            user_id: this.props.user.vkUid
        };
        fetch(BACKEND.vkapi.isMember,{
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
            body: JSON.stringify(data),
        })
            .then(res=>res.json())
            .then(res=>{
                if (res.ingroup === 1){
                    return null
                } else {
                    return (
                        <Banner
                            header="Будь в курсе новостей!"
                            subheader="Подпишись на наше сообщество ВКонтакте и следи за нововведениями"
                            actions={<Button onClick={()=>this.joinGroup()}>Подписаться</Button>}
                        />
                    )
                }
            })
            .catch(e=>console.log(e));
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
            this.state.feed.map(feed=>{
                return (
                    <CardGrid>
                        <Card key={feed} size="l" mode="shadow">
                            <div style={{ height: 96, backgroundColor: 'aliceblue' }} />
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
                        //bottomContent={}
                        before={<Avatar src={user.avatarLink} size={50}/>}
                        size="l"
                    >{user.firstname} {user.lastname}
                    </Cell>
                    {
                        user.vkUid === '199500866' &&
                        //user.vkUid === '2314852' &&
                        <CellButton onClick={this.props.openModer}>Модерация</CellButton>
                    }
                    {this.props.master === null &&
                    <Cell
                        multiline
                        onClick={this.props.openReg}
                        before={<Icon24UserOutgoing/>}
                        expandable
                    >
                        Если вы - мастер, пройдите простую процедуру регистрации
                    </Cell>
                    }
                </Card>
            </CardGrid>
        )
    };

    nowCounter = () => {
        return (
            <CardGrid>
                <Card size="l" mode="shadow">
                    <div>
                        <Cell>Уже с нами:</Cell>
                        <Cell indicator={this.state.countUsers ? <Counter>{this.state.countUsers}</Counter> : <Spinner size="small"/>}>Пользователей</Cell>
                        <Cell indicator={this.state.countMasters ? <Counter>{this.state.countMasters}</Counter> : <Spinner size="small"/>}>Мастеров</Cell>
                        <Cell indicator={this.state.countCities ? <Counter>{this.state.countCities}</Counter> : <Spinner size="small"/>}>Городов</Cell>
                        <Cell multiline>
                            {
                                this.state.cities &&
                                this.state.cities.map(city=>{
                                    return city+' '
                                })
                            }
                        </Cell>
                    </div>
                </Card>
            </CardGrid>
        )
    };

    render(){
        const {user} = this.props;
        return (
            <Panel id="news">
                <PanelHeader>Новости</PanelHeader>
                    <Group>
                        <Placeholder
                            icon={<Avatar src="https://sun1-28.userapi.com/O4KZM7zfdhZ-zHP-LtRj_xrYiNSRdraBcCQe6Q/PLqKmK-NWTY.jpg?ava=1" size={70}/>}
                            header="Привет!"
                        >
                            У нас ты можешь найти бьюти-мастера или предложить свои услуги. База мастеров в разных городах пополняется ежедневно.
                        </Placeholder>
                        {this.userInfo(user)}
                        {this.nowCounter()}
                        {this.isMember()}
                        {this.favApp()}
                        {/*{this.feedList()}*/}
                        {/*<FixedLayout*/}
                        {/*    vertical="bottom"*/}
                        {/*    style={{marginBottom: 5}}*/}
                        {/*>*/}
                        {/*    */}
                        {/*</FixedLayout>*/}
                    </Group>
            </Panel>
        );
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master
    };
};

const putActionsToProps = (dispatch) => {
    return {

    };
};

export default connect(putStateToProps, putActionsToProps)(News);