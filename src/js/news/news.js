import React from 'react';
import {
    Placeholder,
    Separator,
    Group,
    Cell,
    Div,
    Avatar, PanelSpinner, Spinner, FixedLayout
} from "@vkontakte/vkui"
import Icon24UserIncoming from '@vkontakte/icons/dist/24/user_incoming';
import Icon24UserOutgoing from '@vkontakte/icons/dist/24/user_outgoing';

class News extends React.Component {
    constructor (props) {
        super(props);

        this.state = {

        };
    }
    render(){
        return (
            <Div>
                    <Group>
                        {
                            this.props.user.firstname === '???' ?
                                <Placeholder >
                                    <Spinner size="large" style={{ marginTop: 20 }} />
                                </Placeholder> :
                                <Placeholder icon={<Avatar src={this.props.user.avatarLink} size={80}/>}>
                                    Привет, {this.props.user.firstname}!
                                </Placeholder>
                        }
                        <Cell multiline>
                            Ты находишься в сервисе "Навигатор красоты". Здесь ты можешь найти мастера практически по
                            любой области косметологии или предложить свои услуги.
                        </Cell>
                    </Group>
                {this.props.user.isMaster === false &&
                <FixedLayout vertical="bottom">
                    <Cell
                        multiline
                        onClick={this.props.openReg}
                        before={<Icon24UserOutgoing/>}
                        expandable
                    >
                        Если вы - мастер, пройдите простую процедуру регистрации
                    </Cell>
                </FixedLayout>
                }
                <Separator wide />
            </Div>
        );
    }
}

export default News;