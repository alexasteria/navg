import React from 'react';
/*import VKConnect from '@vkontakte/vkui-connect-mock';*/
import connect from '@vkontakte/vk-connect';
import {
    View,
    Panel,
    PanelHeader,
    Tabbar,
    TabbarItem,
    Epic,
    SelectMimicry,
    FormLayout,
    Group, List, Cell, Root, HeaderButton, platform, IOS
} from '@vkontakte/vkui';
import Icon28Notifications from '@vkontakte/icons/dist/28/notification.js';
import Icon28More from '@vkontakte/icons/dist/28/more.js';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon28ServicesOutline from '@vkontakte/icons/dist/28/services_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Sale from './js/sale/sale.js';
import MasterList from './js/masters/masterList.js';
import MasterCard from './js/masters/mastersCard.js';
import Idea from './js/idea/idea.js';
import Lk from './js/lk/lk.js';
import Invite from './js/lk/invite.js';
import Icon24Done from '@vkontakte/icons/dist/24/done';
const osname = platform();


class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeStory: 'sale',
            activePanelMasters: 'cellMasters',
            activeMaster: {},
            activeViewMasters: 'cellMasters',
            categoryMasters: "",
            catRu: {
                Manicure: 'Маникюр',
                Pedicure: 'Педикюр',
                Eyelashes: 'Ресницы',
                Eyebrows: 'Брови',
                Shugaring: 'Шугаринг',
                Hairstyles: 'Уход за волосами'
            },
            mastersList: []
        };
        this.onStoryChange = this.onStoryChange.bind(this);

    }
    openPanelMaster = (name, master) => {
        this.setState({ activePanelMasters: name });
        this.state.activeMaster = master;
        console.log(this.state.activeMaster);
    };
    openMasterPhoto = (name) => {
        this.setState({ activePanelMasters: name });
        console.log(this.state.activePanelMasters);
    };
    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }
    render () {
        connect.send("VKWebAppInit", {});
        connect.send("VKWebAppAllowNotifications", {});
        // Subscribes to event, sended by client
        //connect.subscribe(e => console.log(e));
        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'sale'}
                        data-story="sale"
                        text="Акции"
                    ><Icon28FireOutline /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'masters'}
                        data-story="masters"
                        text="Мастера"
                    ><Icon28ServicesOutline /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'idea'}
                        data-story="idea"
                        text="Идеи"
                    ><Icon28HelpOutline /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'notifications'}
                        data-story="notifications"
                        text="Уведомлен."
                        label="1"
                    ><Icon28Notifications /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'lk'}
                        data-story="lk"
                        text="Кабинет"
                    ><Icon28More /></TabbarItem>
                </Tabbar>
            }>
                <View id="sale" activePanel="sale">
                    <Panel id="sale">
                        <PanelHeader>Акции</PanelHeader>
                        <Sale />
                    </Panel>
                </View>
                <Root id="masters" activeView={this.state.activeViewMasters}>
                    <View id="cellMasters" activePanel={this.state.activePanelMasters}>
                        <Panel id="cellMasters">
                            <FormLayout>
                                <SelectMimicry
                                    top="Выберите категорию"
                                    placeholder="Не выбрана"
                                    onClick={() => this.setState({ activeViewMasters: 'masterCat' })}
                                >{this.state.categoryMasters}</SelectMimicry>
                            </FormLayout>
                            <PanelHeader>Мастера</PanelHeader>
                            <MasterList category={this.state.categoryMasters} openPanelMaster={this.openPanelMaster}/>
                        </Panel>
                        <Panel id="masterInfo">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'cellMasters' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'cellMasters' })}>Назад</HeaderButton>}
                            >
                            </PanelHeader>
                            <MasterCard activeMaster={this.state.activeMaster} openMasterPhoto={this.openMasterPhoto}/>
                        </Panel>
                        <Panel id="masterPhoto">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>Назад</HeaderButton>}
                            >
                            </PanelHeader>
                        </Panel>
                    </View>
                    <View activePanel="masterCat" id="masterCat">
                        <Panel id="masterCat">
                            <PanelHeader>Выбор категории</PanelHeader>
                            <Group>
                                <List>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Manicure', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Manicure' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Маникюр
                                    </Cell>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Pedicure', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Pedicure' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Педикюр
                                    </Cell>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Eyelaches', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Eyelaches' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Ресницы
                                    </Cell>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Eyebrows', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Eyebrows' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Брови
                                    </Cell>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Shugaring', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Shugaring' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Шугаринг
                                    </Cell>
                                    <Cell
                                        onClick={() => this.setState({ categoryMasters: 'Hairstyles', activeViewMasters: 'cellMasters' })}
                                        asideContent={this.state.categoryMasters === 'Hairstyles' ? <Icon24Done fill="var(--accent)" /> : null}
                                    >
                                        Волосы
                                    </Cell>
                                </List>
                            </Group>
                        </Panel>
                    </View>
                </Root>
                <View id="idea" activePanel="idea">
                    <Panel id="idea">
                        <Idea />
                    </Panel>
                </View>
                <View id="notifications" activePanel="notifications">
                    <Panel id="notifications">
                        <PanelHeader>Уведомления</PanelHeader>
                    </Panel>
                </View>
                <Root id="lk" activeView="lk">
                    <View id="lk" activePanel="lk">
                        <Panel id="lk">
                            <PanelHeader>Личный кабинет</PanelHeader>
                            <Invite />
                        </Panel>
                    </View>
                </Root>
            </Epic>
        )
    }
}


export default App;