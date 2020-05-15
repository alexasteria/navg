import React from 'react';
import {Placeholder,
    Group,
    Cell,
    Avatar, FixedLayout,CardGrid,Card,Button
} from "@vkontakte/vkui"
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";

class News extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            feed: [1,2,3,4,5,6,7,8,9],
            inGroup: true
        };
    }

    componentDidMount() {
        bridge.send("VKWebAppJoinGroup", {
            group_id: 193179174
        }).then(result=>this.setState({inGroup: result}));
    }

    addFav = () => {
        bridge.send("VKWebAppJoinGroup", {
            group_id: 193179174
        }).then(result=>this.setState({inGroup: result}));
    };

    feedList = () => {
        if(this.state.inGroup){
            return(
                <Placeholder
                    icon={<Avatar src="https://sun1-28.userapi.com/O4KZM7zfdhZ-zHP-LtRj_xrYiNSRdraBcCQe6Q/PLqKmK-NWTY.jpg?ava=1" size={70}/>}
                    header="Привет!"
                >
                    Сейчас мы расширяем базу мастеров в разных городах России. Вскоре, список станет более обширным.
                </Placeholder>
            )
        } else {
            return(
                <Placeholder
                    icon={<Avatar src="https://sun1-28.userapi.com/O4KZM7zfdhZ-zHP-LtRj_xrYiNSRdraBcCQe6Q/PLqKmK-NWTY.jpg?ava=1" size={70}/>}
                    header="Привет!"
                    action={<Button onClick={this.addFav} size="l">Вступить в группу</Button>}
                >
                    Сейчас мы расширяем базу мастеров в разных городах России. Вскоре, список станет более обширным. Вступайте в нашу группу Вконтакте, чтобы не пропустить важные обновления!
                </Placeholder>
            )
        }


            // this.state.feed.map(feed=>{
            //     return (
            //         <CardGrid>
            //             <Card key={feed} size="l" mode="shadow">
            //                 <div style={{ height: 96, backgroundColor: 'aliceblue' }} />
            //             </Card>
            //         </CardGrid>
            //     )
            // })
    };
    render(){
        const {user} = this.props;
        return (
            <Group>
                <FixedLayout vertical="bottom">
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
                </FixedLayout>
                {this.feedList()}
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