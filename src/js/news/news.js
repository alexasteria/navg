import React from 'react';
import {
    Placeholder,
    Separator,
    Group,
    Cell,
    Div,
    Avatar, PanelSpinner, Spinner, FixedLayout,CardGrid,Card
} from "@vkontakte/vkui"
import Icon24UserIncoming from '@vkontakte/icons/dist/24/user_incoming';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';

class News extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            feed: [1,2,3,4,5,6,7,8,9]
        };
    }
    feedList = () => {
        return(
            this.state.feed.map(feed=>{
                return (
                    <CardGrid>
                        <Card key={feed} size="l" mode="shadow">
                            <div style={{ height: 96 }} />
                        </Card>
                    </CardGrid>
                )
            })
        )
    };
    render(){
        return (
            <Group>
                <FixedLayout vertical="bottom">
                    <CardGrid>
                        <Card size="l">
                            <Cell expandable
                                  photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                  description={
                                      this.props.user.isMaster === false ? 'Пользователь' : 'Авторизованный мастер'
                                  }
                                  //bottomContent={}
                                  before={<Avatar src={this.props.user.avatarLink} size={50}/>}
                                  size="l"
                            >{this.props.user.firstname} {this.props.user.lastname}
                            </Cell>
                            {this.props.user.isMaster === false &&
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
            // <Div>
            //         <Group>
            //             {
            //                 this.props.user.firstname === '???' ?
            //                     <Placeholder >
            //                         <Spinner size="large" style={{ marginTop: 20 }} />
            //                     </Placeholder> :
            //                     <Placeholder icon={<Avatar src={this.props.user.avatarLink} size={80}/>}>
            //                         Привет, {this.props.user.firstname}!
            //                     </Placeholder>
            //             }
            //             <Cell multiline>
            //                 Ты находишься в сервисе "Навигатор красоты". Здесь ты можешь найти мастера практически по
            //                 любой области косметологии или предложить свои услуги.
            //             </Cell>
            //         </Group>
            //     {this.props.user.isMaster === false &&
            //     <FixedLayout vertical="bottom">
            //         <Cell
            //             multiline
            //             onClick={this.props.openReg}
            //             before={<Icon24UserOutgoing/>}
            //             expandable
            //         >
            //             Если вы - мастер, пройдите простую процедуру регистрации
            //         </Cell>
            //     </FixedLayout>
            //     }
            //     <Separator wide />
            // </Div>
        );
    }
}

export default News;