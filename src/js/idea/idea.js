import React from 'react';
import {Group, HorizontalScroll, FixedLayout, TabsItem, Tabs, Panel, PanelHeader, Cell} from "@vkontakte/vkui"


class Idea extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'all',
        };
    }
    render(){
        return (
            <Panel id="idea">
                <PanelHeader>Случайная идея</PanelHeader>
                <FixedLayout vertical="top">
                    <Tabs theme="header" type="buttons">
                        <HorizontalScroll>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'all' })}
                                selected={this.state.activeTab === 'all'}
                            >
                                Ногти
                            </TabsItem>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'users' })}
                                selected={this.state.activeTab === 'users'}
                            >
                                Информация о разделе
                            </TabsItem>
                        </HorizontalScroll>
                    </Tabs>
                </FixedLayout>
                <Group>
                    <Cell
                        expandable
                        onClick={() => this.setState({ activePanel: 'nothing' })}
                        indicator={'В разработке'}
                    >Этот раздел</Cell>
                </Group>
            </Panel>
        );
    }
}

export default Idea;