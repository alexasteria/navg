import React from 'react';
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
    Group, List, Cell, Root, HeaderButton, platform, IOS, Alert
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
import Invite from './js/lk/invite.js';
import Lk from './js/lk/lk.js'
import Icon24Done from '@vkontakte/icons/dist/24/done';
const osname = platform();


class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activeStory: 'sale',
            activePanelMasters: 'cellMasters',
            activeMasterId: '',
            activeViewMasters: 'cellMasters',
            activeViewLk: 'lk',
            targetCategory: '',
            catRu: {
                Manicure: 'Маникюр',
                Pedicure: 'Педикюр',
                Eyelashes: 'Ресницы',
                Eyebrows: 'Брови',
                Shugaring: 'Шугаринг',
                Hairstyles: 'Уход за волосами'
            },
            mastersList: [],
            user: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: '',
                status: ''
            },
            categories: [
                {id: '5e37537a58b85c13bcffb8b4', label: 'Маникюр'},
                {id: '5e3753be58b85c13bcffb8b5', label: 'Педикюр'},
                {id: '5e3753c458b85c13bcffb8b6', label: 'Ресницы'},
                {id: '5e3753c858b85c13bcffb8b7', label: 'Брови'},
                {id: '5e3753cd58b85c13bcffb8b8', label: 'Шугаринг'},
                {id: '5e3753d558b85c13bcffb8b9', label: 'Уход за волосами'},
                {id: '5e3753dc58b85c13bcffb8ba', label: 'Косметология'},
            ]
        };
        this.onStoryChange = this.onStoryChange.bind(this);

    }
    openReg () {
        this.setState({ popout:
                <Alert
                    actionsLayout="vertical"
                    actions={[{
                        title: 'Понятненько',
                        autoclose: true,
                        mode: 'cancel'
                    }]}
                    onClose={this.closePopout}
                >
                    <h2>Успешная регистрация</h2>
                    <p>Вы успшно зарегистрированы, как мастер. Теперь вам доступна регистрация портфолио, а так же прием и обработка заказов.</p>
                </Alert>
        });
    }

    closePopout () {
        this.setState({ popout: null });
    }
    openPanelMaster = (panelName, masterId) => {
        this.setState({ activePanelMasters: panelName });
        this.setState({ activeMasterId: masterId });
        //this.state.activeMaster = master;
        //console.log(this.state.activeMaster);
    };
    openMasterPhoto = (name) => {
        this.setState({ activePanelMasters: name });
        console.log(this.state.activePanelMasters);
    };
    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }
    render () {
        connect.send("VKWebAppInit", {}).then(err => console.log(err));
        connect.send("VKWebAppAllowNotifications", {}).then(err => console.log(err));
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
                                >{this.state.targetCategory.label}</SelectMimicry>
                            </FormLayout>
                            <PanelHeader>Мастера</PanelHeader>
                            <MasterList category={this.state.targetCategory} openPanelMaster={this.openPanelMaster}/>
                        </Panel>
                        <Panel id="masterInfo">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'cellMasters' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'cellMasters' })}>Назад</HeaderButton>}
                            >
                            </PanelHeader>
                            <MasterCard activeMasterId={this.state.activeMasterId} openMasterPhoto={this.openMasterPhoto}/>
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
                                    {
                                        this.state.categories.map(category => {
                                            //console.log(category);
                                            return (
                                                <Cell
                                                    key={category.id}
                                                    onClick={() => this.setState({ targetCategory: category, activeViewMasters: 'cellMasters' })}
                                                    asideContent={this.state.targetCategory === category ? <Icon24Done fill="var(--accent)" /> : null}
                                                >
                                                    {category.label}
                                                </Cell>
                                            )
                                        })
                                    }
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
                <Root id="lk" activeView={this.state.activeViewLk}>
                    <View id="lk" activePanel="lk">
                        <Panel id="lk">
                            <PanelHeader>Личный кабинет</PanelHeader>
                            <Lk openReg={() => this.setState({ activeViewLk: 'masterReg' })}/>
                        </Panel>
                    </View>
                    <View activePanel="masterReg" id="masterReg">
                        <Panel id="masterReg">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activeViewLk: 'lk' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activeViewLk: 'lk' })}>Назад</HeaderButton>}
                            >Регистрация мастера
                            </PanelHeader>
                            <Invite closePopup={() => this.setState({ activeViewLk: 'lk' })}/>
                        </Panel>
                    </View>
                </Root>
            </Epic>
        )
    }
}


export default App;