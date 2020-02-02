import React from 'react';
import {HorizontalScroll, FixedLayout, TabsItem, Tabs, Panel, PanelHeader} from "@vkontakte/vkui"


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
                                Локти
                            </TabsItem>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'groups' })}
                                selected={this.state.activeTab === 'groups'}
                            >
                                Ни ногти ни локти(
                            </TabsItem>
                        </HorizontalScroll>
                    </Tabs>
                </FixedLayout>
            </Panel>
        );
    }
}

export default Idea;