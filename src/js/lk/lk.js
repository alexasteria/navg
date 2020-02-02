import React from 'react';
import {Avatar, Button, Cell, List, Panel, Group} from "@vkontakte/vkui"
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';

class Lk extends React.Component {
    render(){
        return (
            <Panel>
                <Group title="Основное">
                    <List>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Личная карточка</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>Портфолио</Cell>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })}>График</Cell>
                    </List>
                </Group>
                <Group title="Ближайшие записи">
                    <List>
                        <Cell
                            before={<Avatar size={72} />}
                            size="l"
                            description="Сегодня 13:00"
                            asideContent={<Icon24MoreHorizontal />}
                            bottomContent={
                                <div style={{ display: 'flex' }}>
                                    <Button size="m">Написать</Button>
                                </div>
                            }
                        >
                            Анна Сергеевна</Cell>
                        <Cell
                            before={<Avatar size={72} />}
                            size="l"
                            description="Завтра 10:00"
                            asideContent={<Icon24MoreHorizontal />}
                            bottomContent={
                                <div style={{ display: 'flex' }}>
                                    <Button size="m">Написать</Button>
                                </div>
                            }
                        >
                            Алена Ковалева</Cell>
                    </List>
                </Group>
            </Panel>
        );
    }
}

export default Lk;