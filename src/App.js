import React from 'react';
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
//import Sale from './js/sale/sale.js';
import PanelMasterList from './js/masters/panelMasterList.js';
import MasterCard from './js/masters/mastersCard.js';
import MasterPhoto from './js/masters/mastersPhoto.js';
import MasterComments from './js/masters/mastersComments.js';
import Idea from './js/idea/idea.js';
import News from './js/news/news.js';
import Invite from './js/lk/invite.js';
import Lk from './js/lk/lk.js'
import Setting from './js/lk/setting.js';
import Favourite from './js/lk/favourite.js';
import FindModel from "./js/findmodel/findModel";
import FindModelMaster from "./js/lk/findModelMaster";
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {BACKEND} from "./js/func/func";
import VKConnect from "@vkontakte/vkui-connect-mock";
//import connect from '@vkontakte/vk-connect';
const osname = platform();


class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            popout: null,
            activeStory: 'news',
            activePanelFindModels: 'findmodel',
            activePanelMasters: 'mastersList',
            activeMasterId: '',
            activeViewMasters: 'mastersList',
            activeViewLk: 'lk',
            activePanelLk: 'lk',
            targetCategory: '',
            catRu: {
                Manicure: 'Маникюр',
                Pedicure: 'Педикюр',
                Eyelashes: 'Ресницы',
                Eyebrows: 'Брови',
                Shugaring: 'Шугаринг',
                Hairstyles: 'Уход за волосами'
            },
            mastersList: null,
            user: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: '',
                status: '',
                city: {id:1, title: 'СПБ'}
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
    componentWillMount() {
        VKConnect.subscribe((e) => {
            if (e.detail.type === 'VKWebAppGetUserInfoResult') {
                const user = {
                    vkUid: e.detail.data.id,
                    firstname: e.detail.data.first_name,
                    lastname: e.detail.data.last_name,
                    avatarLink: e.detail.data.photo_200,
                    sex: e.detail.data.sex,
                    city: {id: e.detail.data.city.id, title: e.detail.data.city.title},
                    country: {id: e.detail.data.country.id, title: e.detail.data.country.title},
                    isMaster: false
                };
                this.setState({user: user});
                //console.log(this.state.user);
                this.verifiedUser(user);
            }
        });
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
    verifiedUser = (user) => {
        console.log('auth');
        //console.log(BACKEND.users+'/vkuid/'+user.vkUid);
        fetch(BACKEND.users+'/vkuid/'+user.vkUid)
            .then(res => res.json())
            .then(usersArr => {
                if (usersArr.length === 0){
                    console.log('Пользователь ', user, ' не найден');
                    this.postData(BACKEND.users, user); //регитрируем
                } else {
                    console.log('Пришло при авторизации', usersArr[0]);
                    this.setState({user: usersArr[0]});
                }
            })
            .catch(error => {
                console.log(error); // Error: Not Found
            });
    };
    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        fetch(url, {
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
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(data)
            .then(response => console.log(response.json())); // парсит JSON ответ в Javascript объект

    }
    openAlert = () => {
        this.setState({ popout:
                <Alert
                    actionsLayout="vertical"
                    actions={[{
                        title: 'Закрыть',
                        autoclose: true,
                        mode: 'cancel'
                    }]}
                    onClose={this.closeAlert}
                >
                    <h2>Изменения сохранены</h2>
                    <p>Внесенные изменение отобразятся в поиске в течении 2-х минут.</p>
                </Alert>
        });
    };
    closeAlert = () => {
        this.setState({ popout: null });
    };
    closeReg = (master) => {
        console.log('master - ', master);
        this.postData(BACKEND.masters.all, master);
        let user = this.state.user;
        user.isMaster = true;
        this.setState({ user: user });
        //this.verifiedUser(master); //проходит до запроса в БД пофиксить
        this.setState({ activeViewLk: 'lk' });
    };
    change = (story, view, panel) => {
        this.setState({ story: story });
        this.setState({ story: story });
        this.setState({ story: story });
    };
    /*
    *Story (news,masters,findmodel,idea,lk)
    * mastersView -> mastersPanel
    *
    *
    */

    /*
    *
    *
    *
     */
    openPanelMaster = (panelName, master) => {
        this.setState({ activePanelMasters: panelName });
        this.setState({ activeMaster: master });
    };
    openMaster = (master) => {
        this.setState({ activeViewMasters: 'mastersList' });
        this.setState({ activeStory: 'masters' });
        this.setState({ activePanelMasters: 'masterInfo' });
        this.setState({ activeMaster: master });
    };
    openMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID+masterId)
            .then(res => res.json())
            .then(master => {
                this.setState({ activeMaster: master });
                //this.setState({ activeViewMasters: 'mastersList' });
                //this.setState({ activeStory: 'masters' });
                this.setState({ activePanelFindModels: 'masterInfo' });
            });
    };
    openFavMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID+masterId)
            .then(res => res.json())
            .then(master => {
                this.setState({ activeMaster: master });
                //this.setState({ activeViewMasters: 'mastersList' });
                //this.setState({ activeStory: 'masters' });
                this.setState({ activePanelLk: 'masterInfo' });
            });
    };
    activePanelMasters = (name) => {
        this.setState({ activePanelMasters: name });
        console.log(this.state.activePanelMasters);
    };
    openStory = (storyName) => {
        this.setState({ activeStory: storyName })
    }
    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }
    render () {
        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    {
                        /*<TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'sale'}
                            data-story="sale"
                            text="Акции"
                        ><Icon28FireOutline /></TabbarItem>*/
                    }
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'news'}
                        data-story="news"
                        text="News"
                    ><Icon28FireOutline /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'masters'}
                        data-story="masters"
                        text="Мастера"
                    ><Icon28ServicesOutline /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'findmodel'}
                        data-story="findmodel"
                        text="Ищу модель"
                    ><Icon28Notifications /></TabbarItem>
                    {/*<TabbarItem*/}
                    {/*    onClick={this.onStoryChange}*/}
                    {/*    selected={this.state.activeStory === 'idea'}*/}
                    {/*    data-story="idea"*/}
                    {/*    text="Идеи"*/}
                    {/*><Icon28HelpOutline /></TabbarItem>*/}
                    {
                        /*
                        <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'notifications'}
                        data-story="notifications"
                        text="Уведомлен."
                        label="1"
                    ><Icon28Notifications /></TabbarItem>
                        * */
                    }
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'lk'}
                        data-story="lk"
                        text="Кабинет"
                    ><Icon28More /></TabbarItem>
                </Tabbar>
            }>
                {
                    /*<View id="sale" activePanel="sale">
                    <Panel id="sale">
                        <PanelHeader>Акции</PanelHeader>
                        <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })} indicator={this.state.user.city.title}>Выбранный город</Cell>
                        <Sale />
                    </Panel>
                </View>*/
                }
                <View id="news" activePanel="news">
                    <Panel id="news">
                        <PanelHeader>Горячие новости</PanelHeader>
                        <News user={this.state.user} openStory={this.openStory}/>
                    </Panel>
                </View>
                <Root id="masters" activeView={this.state.activeViewMasters}>
                    <View id="mastersList" activePanel={this.state.activePanelMasters}>
                        <Panel id="mastersList">
                            <FormLayout>
                                <Cell
                                    expandable
                                    onClick={() => this.setState({ activePanel: 'nothing' })}
                                    indicator={this.state.user.city.title}>Выбранный город</Cell>
                                <SelectMimicry
                                    top="Выберите категорию"
                                    placeholder="Не выбрана"
                                    onClick={() => this.setState({ activeViewMasters: 'masterCat' })}
                                >{this.state.targetCategory.label}</SelectMimicry>
                            </FormLayout>
                            <PanelHeader>Мастера</PanelHeader>
                            <PanelMasterList category={this.state.targetCategory} city={this.state.user.city} openPanelMaster={this.openPanelMaster}/>
                        </Panel>
                        <Panel id="masterInfo">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'mastersList' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'mastersList' })}>Назад</HeaderButton>}
                            >
                                О мастере
                            </PanelHeader>
                            <MasterCard openPhoto={() => this.setState({ activePanelMasters: 'masterPhoto' })} user={this.state.user} activeMaster={this.state.activeMaster} openComments={() => this.setState({ activePanelMasters: 'masterComments' })}/>
                        </Panel>
                        <Panel id="masterPhoto">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>Назад</HeaderButton>}
                            >
                                Портфолио
                            </PanelHeader>
                            <MasterPhoto activeMasterId={this.state.activeMasterId} />
                        </Panel>
                        <Panel id="masterComments">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelMasters: 'masterInfo' })}>Назад</HeaderButton>}
                            >
                                Отзывы
                            </PanelHeader>
                            <MasterComments user={this.state.user} activeMaster={this.state.activeMaster} />
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
                                                    onClick={() => this.setState({ targetCategory: category, activeViewMasters: 'mastersList' })}
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
                <View id="findmodel" activePanel={this.state.activePanelFindModels}>
                    <Panel id="findmodel">
                        <PanelHeader>Мастер ищет модель</PanelHeader>
                        <FindModel openMasterOnId={this.openMasterOnId} user={this.state.user}/>
                    </Panel>
                    <Panel id="masterInfo">
                        <PanelHeader
                            theme="light"
                            left={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'findmodel' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                            addon={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'findmodel' })}>Назад</HeaderButton>}
                        >
                            О мастере
                        </PanelHeader>
                        <MasterCard openPhoto={() => this.setState({ activePanelFindModels: 'masterPhoto' })} user={this.state.user} activeMaster={this.state.activeMaster} openComments={() => this.setState({ activePanelFindModels: 'masterComments' })}/>
                    </Panel>
                    <Panel id="masterPhoto">
                        <PanelHeader
                            theme="light"
                            left={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                            addon={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'masterInfo' })}>Назад</HeaderButton>}
                        >
                            Портфолио
                        </PanelHeader>
                        <MasterPhoto activeMasterId={this.state.activeMasterId} />
                    </Panel>
                    <Panel id="masterComments">
                        <PanelHeader
                            theme="light"
                            left={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                            addon={<HeaderButton onClick={() => this.setState({ activePanelFindModels: 'masterInfo' })}>Назад</HeaderButton>}
                        >
                            Отзывы
                        </PanelHeader>
                        <MasterComments user={this.state.user} activeMaster={this.state.activeMaster} />
                    </Panel>
                </View>
                <View id="notifications" activePanel="notifications">
                    <Panel id="notifications">
                        <PanelHeader>Уведомления</PanelHeader>
                        <Group>
                            <Cell
                                expandable
                                onClick={() => this.setState({ activePanel: 'nothing' })}
                                indicator={'В разработке'}
                            >Этот раздел</Cell>
                        </Group>
                    </Panel>
                </View>
                <Root id="lk" activeView={this.state.activeViewLk}>
                    <View id="lk" activePanel={this.state.activePanelLk} popout={this.state.popout}>
                        <Panel id="lk">
                            <PanelHeader>Личный кабинет</PanelHeader>
                            <Lk
                                user={this.state.user}
                                openReg={() => this.setState({ activeViewLk: 'masterReg' })}
                                openSetting={() => this.setState({ activePanelLk: 'setting' })}
                                openFavourite={() => this.setState({ activePanelLk: 'favourite' })}
                                openFindModel={() => this.setState({ activePanelLk: 'findModel' })}
                            />
                        </Panel>
                        <Panel id='favourite'>
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>Назад</HeaderButton>}
                            >Избранное</PanelHeader>
                            <Favourite user={this.state.user} openFavMasterOnId={this.openFavMasterOnId}/>
                        </Panel>
                        <Panel id="masterInfo">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'favourite' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'favourite' })}>Назад</HeaderButton>}
                            >
                                О мастере
                            </PanelHeader>
                            <MasterCard openPhoto={() => this.setState({ activePanelLk: 'masterPhoto' })} user={this.state.user} activeMaster={this.state.activeMaster} openComments={() => this.setState({ activePanelLk: 'masterComments' })}/>
                        </Panel>
                        <Panel id="masterPhoto">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'masterInfo' })}>Назад</HeaderButton>}
                            >
                                Портфолио
                            </PanelHeader>
                            <MasterPhoto activeMasterId={this.state.activeMasterId} />
                        </Panel>
                        <Panel id="masterComments">
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'masterInfo' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'masterInfo' })}>Назад</HeaderButton>}
                            >
                                Отзывы
                            </PanelHeader>
                            <MasterComments user={this.state.user} activeMaster={this.state.activeMaster} />
                        </Panel>
                        <Panel id='findModel'>
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>Назад</HeaderButton>}
                            >Мастер ищет модель</PanelHeader>
                            <FindModelMaster user={this.state.user} popout={this.openAlert}/>
                        </Panel>
                        <Panel id='setting'>
                            <PanelHeader
                                theme="light"
                                left={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                                addon={<HeaderButton onClick={() => this.setState({ activePanelLk: 'lk' })}>Назад</HeaderButton>}
                            >Настройки</PanelHeader>
                            <Setting user={this.state.user} popout={this.openAlert}/>
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
                            <Invite user={this.state.user} closeReg={this.closeReg}/>
                        </Panel>
                    </View>
                </Root>
            </Epic>
        )
    }
}


export default App;