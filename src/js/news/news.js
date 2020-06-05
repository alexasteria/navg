import React from 'react';
import {
    Placeholder,
    Group,
    Cell,
    Avatar, FixedLayout, CardGrid, Card, Button, CellButton, Banner, Counter
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
        fetch(BACKEND.masters.all+'all')
            .then(res => res.json())
            .then(mastersCount => {
                this.setState({mastersCount: mastersCount.length})
            });
        fetch(BACKEND.users)
            .then(res => res.json())
            .then(usersCount => {
                this.setState({usersCount: usersCount.length})
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
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "groups.isMember",
            "params": {"group_id": "193179174","user_id": this.props.user.vkUid, "v":"5.103", "access_token": BACKEND.keyGroup}})
            .then(result => {
                if (result.response === 1){
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
                            user.isMaster === false ? 'Пользователь' : 'Авторизованный мастер'
                        }
                        //bottomContent={}
                        before={<Avatar src={user.avatarLink} size={50}/>}
                        size="l"
                    >{user.firstname} {user.lastname}
                    </Cell>
                    {
                        //user.vkUid === '199500866' &&
                        user.vkUid === '2314852' &&
                        <CellButton onClick={this.props.openModer}>Модерация</CellButton>
                    }
                    {user.isMaster === false &&
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
                        <Cell indicator={<Counter>{this.state.mastersCount}</Counter>}>Мастеров</Cell>
                        <Cell indicator={<Counter>{this.state.usersCount}</Counter>}>Пользователей</Cell>
                    </div>
                </Card>
            </CardGrid>
        )
    };

    render(){
        const {user} = this.props;
        return (
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
        );
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user
    };
};

const putActionsToProps = (dispatch) => {
    return {

    };
};

export default connect(putStateToProps, putActionsToProps)(News);;