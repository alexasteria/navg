import React from 'react';
import {
    Alert,
    Cell,
    Epic,
    FormLayout,
    Group,
    List,
    Panel,
    PanelHeader,
    Placeholder,
    Root,
    Search,
    SelectMimicry,
    Spinner,
    Tabbar,
    TabbarItem,
    View, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, IOS, ANDROID, platform, Snackbar, Avatar,ModalCard,HorizontalScroll,Button,Counter
} from '@vkontakte/vkui';
import Icon28Notifications from '@vkontakte/icons/dist/28/notification.js';
import Icon28More from '@vkontakte/icons/dist/28/more.js';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon28ServicesOutline from '@vkontakte/icons/dist/28/services_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Head from './js/elements/panelHeader';
//import Sale from './js/sale/sale.js';
import PanelMasterList from './js/masters/panelMasterList.js';
import MasterCard from './js/masters/mastersCard.js';
import MasterPhoto from './js/masters/mastersPhoto.js';
import MasterComments from './js/masters/mastersComments.js';
//import Idea from './js/idea/idea.js';
import News from './js/news/news.js';
import Invite from './js/lk/invite.js';
import Lk from './js/lk/lk.js'
import Portfolio from './js/lk/portfolio.js'
import Setting from './js/lk/setting.js';
import Favourite from './js/lk/favourite.js';
import FindModel from "./js/findmodel/findModel";
import FindModelMaster from "./js/lk/findModelMaster";
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {BACKEND} from "./js/func/func";
import CityList from './js/elements/cityList'
import Modal from './js/elements/modalPage'
//import bridge from "@vkontakte/vk-bridge-mock";
import bridge from '@vkontakte/vk-bridge';
import CityListModal from "./js/elements/cityListModal";
import {postData, patchData} from './js/elements/functions'
import HeadCity from "./js/elements/headCity";
import Masters from './js/masters/masters';

const osname = platform();


class App extends React.Component {
    constructor(props) {
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
            user: '',
            mastersList: null,
            categories: [
                {id: '5e37537a58b85c13bcffb8b4', label: 'Маникюр'},
                {id: '5e3753be58b85c13bcffb8b5', label: 'Педикюр'},
                {id: '5e3753c458b85c13bcffb8b6', label: 'Ресницы'},
                {id: '5e3753c858b85c13bcffb8b7', label: 'Брови'},
                {id: '5e3753cd58b85c13bcffb8b8', label: 'Шугаринг'},
                {id: '5e3753d558b85c13bcffb8b9', label: 'Уход за волосами'},
                {id: '5e3753dc58b85c13bcffb8ba', label: 'Косметология'},
            ],
            activePanelReg: 'registration',
            baseCities: '',
            searchCity: '',
            activeModal: null,
            modalHistory: [],
            targetCity: 'Не выбрано'

        };
        this.onStoryChange = this.onStoryChange.bind(this);
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };

    }

    componentDidMount() {
        bridge.send('VKWebAppGetUserInfo', {})
            .then(data => {
                //console.log(data);
                //this.setState({vkuser: data});
                this.verifiedUser(data);
            });
        if (this.props.params) {
            postData(BACKEND.logs.params, this.props.params);
        }
        if (this.props.linkParams.masterid) {
            console.log('В параметры пришел мастер');
            this.openMasterOnLink(this.props.linkParams.masterid)
        }
        this.loadCategories();
    }

    verifiedUser = (vkUser) => {
        return fetch(BACKEND.users + '/vkuid/' + vkUser.id)
            .then(res => res.json())
            .then(usersArr => {
                if (usersArr.length === 0) {
                    console.log('Пользователь зашел впервые');
                    this.regNewUser();
                } else {
                    console.log('Пользователь уже заходил в приложение');
                    let targetCity = usersArr[0].city !== typeof Object ? 'Не выбрано' : usersArr[0].city;
                    this.setState({user: usersArr[0], targetCity: targetCity});
                    console.log('Таргет город '+this.state.targetCity)
                }
            })
            .catch(error => {
                console.log(error); // Error: Not Found
            });
    }

    setActiveModal(activeModal) {
        activeModal = activeModal || null;
        let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];

        if (activeModal === null) {
            modalHistory = [];
        } else if (modalHistory.indexOf(activeModal) !== -1) {
            modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
        } else {
            modalHistory.push(activeModal);
        }

        this.setState({
            activeModal,
            modalHistory
        });
    };

    openSnack(text) {
        const blueBackground = {
            backgroundColor: 'var(--accent)'
        };
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14}
                                                                                 height={14}/></Avatar>}
                >
                    {text}
                </Snackbar>
        });
    }

    loadCategories = () => {
        fetch(BACKEND.category.getAll)
            .then(res => res.json())
            .then(categories => {
                // let catArr = categories.map(category => {
                //     return {id: category._id, label: category.label}
                // });
                categories.unshift({_id: 'all', label: 'Мастера всех категорий'});
                console.log(categories);
                this.setState({categories: categories})
            })
            .catch(error => {
                console.log(error); // Error: Not Found
            });
    }
    // changeCity = (e) => {
    //     this.setState({searchCity: e.target.value});
    // };
    regNewUser = () => {
        bridge.send('VKWebAppGetUserInfo', {}).then(data => {
            console.log('Данные с моста', data);
            const user = {
                vkUid: data.id,
                firstname: data.first_name,
                lastname: data.last_name,
                avatarLink: data.photo_200,
                sex: data.sex,
                location: {
                    country: data.country || 'Не определен',
                    city: data.city || 'Не определен'
                },
                isMaster: false
            };
            this.setState({user: user});
            postData(BACKEND.users, user); //регитрируем
        });
    };

    openAlert = (title, body, action) => {
        this.setState({
            popout:
                <Alert
                    actionsLayout="vertical"
                    actions={[{
                        title: action || 'Закрыть',
                        autoclose: true,
                        mode: 'cancel'
                    }]}
                    onClose={() => this.setState({popout: null})}
                >
                    <h2>{title || 'Изменения сохранены'}</h2>
                    <p>{body || 'Изменения вступят в силу в течении 2-х минут'}</p>
                </Alert>
        });
    };
    // closeAlert = () => {
    //     this.setState({ popout: null });
    // };
    closeReg = (master) => {
        console.log(master);
        postData(BACKEND.masters.all, master);
        let user = this.state.user;
        user.isMaster = true;
        this.setState({user: user, activeViewLk: 'lk'});
        // //this.verifiedUser(master); //проходит до запроса в БД пофиксить
    };
    // change = (story, view, panel) => {
    //     this.setState({ story: story });
    //     this.setState({ story: story });
    //     this.setState({ story: story });
    // };
    openPanelMaster = (panelName, master) => {
        this.setState({activePanelMasters: panelName});
        this.setState({activeMaster: master});
    };
    // openMaster = (master) => {
    //     this.setState({ activeViewMasters: 'mastersList' });
    //     this.setState({ activeStory: 'masters' });
    //     this.setState({ activePanelMasters: 'masterInfo' });
    //     this.setState({ activeMaster: master });
    // };
    openMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                console.log(master);
                this.setState({activeMaster: master});
                //this.setState({ activeViewMasters: 'mastersList' });
                //this.setState({ activeStory: 'masters' });
                this.setState({activePanelFindModels: 'masterInfo'});
            });
    };
    openMasterOnLink = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                console.log(master);
                this.setState({activeMaster: master});
                this.setState({activeStory: 'masters'});
                this.setState({activeViewMasters: 'mastersList'});
                this.setState({activePanelMasters: 'masterInfo'});
            });
    };
    openFavMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                this.setState({activeMaster: master});
                //this.setState({ activeViewMasters: 'mastersList' });
                //this.setState({ activeStory: 'masters' });
                this.setState({activePanelLk: 'masterInfo'});
            });
    };
    activePanelMasters = (name) => {
        this.setState({activePanelMasters: name});
        console.log(this.state.activePanelMasters);
    };
    openStory = (storyName) => {
        this.setState({activeStory: storyName})
    };

    onStoryChange(e) {
        this.setState({activeStory: e.currentTarget.dataset.story})
    }

    changeTargetCity(city){
        let user = this.state.user;
        user.location.city = city;
        this.setState({targetCity: city, user:user}, () => this.setActiveModal(null));
        patchData(BACKEND.users+'/'+user._id, user).then(result=>console.log(result));
    }

    render() {
        const setting = (
            <Setting
                snackbar={(message) => this.openSnack(message)}
                modalBack={this.modalBack}
                activeModal={this.state.activeModal}
                user={this.state.user}
                changeModal={(name) => this.setActiveModal(name)}
            />
        );
        const searchFilter = (
            <ModalRoot
                activeModal={this.state.activeModal}
                onClose={()=>this.setActiveModal(null)}
            >
                <ModalPage dynamicContentHeight
                           id={'cityChange'}
                           onClose={()=>this.setActiveModal(null)}
                           header={<ModalPageHeader>Выберите город</ModalPageHeader>}
                >
                    <CityListModal changeTargetCity={(city)=>this.changeTargetCity(city)}/>
                </ModalPage>
                <ModalCard
                    id={'filter'}
                    onClose={() => this.setActiveModal(null)}
                    //icon={<Icon56NotificationOutline />}
                    header="Фильтры1"
                    actions={[{
                        title: 'Запретить',
                        mode: 'secondary',
                        action: () => this.setActiveModal(null)
                    }, {
                        title: 'Разрешить',
                        mode: 'primary',
                        action: () => this.setActiveModal(null)
                    }]}
                />
            </ModalRoot>
        );
        if (this.state.user === '') {
            return (
                <Placeholder icon={<Spinner size="large" style={{marginTop: 20}}/>}>
                    Выполняется вход...
                </Placeholder>
            )
        } else {
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
                        ><Icon28FireOutline/></TabbarItem>
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'masters'}
                            data-story="masters"
                            text="Мастера"
                        ><Icon28ServicesOutline/></TabbarItem>
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'findmodel'}
                            data-story="findmodel"
                            text="Ищу модель"
                        ><Icon28Notifications/></TabbarItem>
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
                        ><Icon28More/></TabbarItem>
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
                            <PanelHeader>Навигатор красоты</PanelHeader>
                            <News openReg={() => this.setState({activeViewLk: 'registration', activeStory: 'lk'})}
                                  user={this.state.user} openStory={this.openStory}/>
                        </Panel>
                    </View>
                    <Root
                        id="masters"
                        activeView={this.state.activeViewMasters}
                        modal={
                            <Modal
                                header={'Выбор города'}
                                activeModal={this.state.activeModal}
                                pageId={'cityList'}
                                onClose={()=>this.setActiveModal(null)}
                                content={<CityList changeCity={(city)=>this.changeTargetCity(city)}/>}
                            />
                        }
                    >
                        <View id="mastersList" activePanel={this.state.activePanelMasters}>
                            <Panel id="mastersList">
                                <Masters
                                    user={this.state.user}
                                    changeCity={() => this.setActiveModal('cityList')}
                                    openSnack={(title)=>this.openSnack(title)}
                                    changeCategory={()=>this.setState({activeViewMasters: 'masterCat'},()=>console.log('ok'))}
                                    targetCategory={this.state.targetCategory}
                                    openPanelMaster={this.openPanelMaster}
                                />
                                {/*<HeadCity*/}
                                {/*    userCity={this.state.user.location.city}*/}
                                {/*    changeCity={()=>this.props.changeCity()}*/}
                                {/*/>*/}
                                {/*    <SelectMimicry*/}
                                {/*        //disabled={this.state.user.location.city === 'Не определено' ? true : false}*/}
                                {/*        top="Выберите категорию"*/}
                                {/*        placeholder="Показаны мастера всех категорий"*/}
                                {/*        onClick={this.state.user.location.city === 'Не определено' ?*/}
                                {/*            () => this.openSnack('Сначала выберите город') :*/}
                                {/*            () => this.setState({activeViewMasters: 'masterCat'})*/}
                                {/*        }*/}
                                {/*        //after={<Icon24Filter />}*/}
                                {/*    >{this.state.targetCategory.label}</SelectMimicry>*/}
                                {/*<PanelHeader>Мастера</PanelHeader>*/}
                                {/*<PanelMasterList*/}
                                {/*    category={this.state.targetCategory}*/}
                                {/*    city={this.state.user.location.city === 'Не определено' ? this.state.targetCity : this.state.user.location.city}*/}
                                {/*    openPanelMaster={this.openPanelMaster}*/}
                                {/*/>*/}
                                {this.state.snackbar}
                            </Panel>
                            <Panel id="masterInfo">
                                <Head title={'О мастере'}
                                      goBack={() => this.setState({activePanelMasters: 'mastersList'})}/>
                                <MasterCard openPhoto={() => this.setState({activePanelMasters: 'masterPhoto'})}
                                            user={this.state.user} activeMaster={this.state.activeMaster}
                                            openComments={() => this.setState({activePanelMasters: 'masterComments'})}/>
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head title={'Портфолио'}
                                      goBack={() => this.setState({activePanelMasters: 'masterInfo'})}/>
                                <MasterPhoto activeMaster={this.state.activeMaster}/>
                            </Panel>
                            <Panel id="masterComments">
                                <Head title={'Отзывы'}
                                      goBack={() => this.setState({activePanelMasters: 'masterInfo'})}/>
                                <MasterComments user={this.state.user} activeMaster={this.state.activeMaster}/>
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
                                                        key={category._id}
                                                        onClick={() => this.setState({
                                                            targetCategory: category,
                                                            activeViewMasters: 'mastersList'
                                                        })}
                                                        asideContent={this.state.targetCategory === category ?
                                                            <Icon24Done fill="var(--accent)"/> : null}
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
                    <View
                        id="findmodel"
                        activePanel={this.state.activePanelFindModels}
                        modal={
                            <Modal
                                header={'Выбор города'}
                                activeModal={this.state.activeModal}
                                pageId={'cityList'}
                                onClose={()=>this.setActiveModal(null)}
                                content={<CityList changeCity={(city)=>this.changeTargetCity(city)}/>}
                            />
                        }
                    >
                        <Panel id="findmodel">
                            <PanelHeader>Мастер ищет модель</PanelHeader>
                            <FindModel
                                openMasterOnId={this.openMasterOnId}
                                user={this.state.user}
                                changeCity={() => this.setActiveModal('cityList')}
                            />
                        </Panel>
                        <Panel id="masterInfo">
                            <Head title={'О мастере'}
                                  goBack={() => this.setState({activePanelFindModels: 'findmodel'})}/>
                            <MasterCard openPhoto={() => this.setState({activePanelFindModels: 'masterPhoto'})}
                                        user={this.state.user} activeMaster={this.state.activeMaster}
                                        openComments={() => this.setState({activePanelFindModels: 'masterComments'})}/>
                        </Panel>
                        <Panel id="masterPhoto">
                            <Head title={'Портфолио'}
                                  goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}/>
                            <MasterPhoto activeMaster={this.state.activeMaster}/>
                        </Panel>
                        <Panel id="masterComments">
                            <Head title={'Отзывы'} goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}/>
                            <MasterComments user={this.state.user} activeMaster={this.state.activeMaster}/>
                        </Panel>
                    </View>

                    <Root id="lk" activeView={this.state.activeViewLk}>
                        <View id="lk" activePanel={this.state.activePanelLk} popout={this.state.popout} modal={setting}>
                            <Panel id="lk">
                                <PanelHeader>Личный кабинет</PanelHeader>
                                <Lk
                                    user={this.state.user}
                                    openSetting={() => this.setActiveModal('setting')}
                                    //openSetting={() => this.setState({activePanelLk: 'setting'})}
                                    openFavourite={() => this.setState({activePanelLk: 'favourite'})}
                                    openFindModel={() => this.setState({activePanelLk: 'findModel'})}
                                    openMasterPhoto={() => this.setState({activePanelLk: 'masterPhoto'})}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='favourite'>
                                <Head title={'Избранное'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <Favourite user={this.state.user} openFavMasterOnId={this.openFavMasterOnId}/>
                            </Panel>
                            <Panel id="masterInfo">
                                <Head title={'О мастере'} goBack={() => this.setState({activePanelLk: 'favourite'})}/>
                                <MasterCard openPhoto={() => this.setState({activePanelLk: 'masterPhoto'})}
                                            user={this.state.user} activeMaster={this.state.activeMaster}
                                            openComments={() => this.setState({activePanelLk: 'masterComments'})}/>
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head title={'Портфолио'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <Portfolio user={this.state.user}/>
                            </Panel>
                            <Panel id="masterComments">
                                <Head title={'Отзывы'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <MasterComments user={this.state.user} activeMaster={this.state.activeMaster}/>
                            </Panel>
                            <Panel id='findModel'>
                                <Head title={'Мастер ищет модель'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <FindModelMaster user={this.state.user} popout={this.openAlert}/>
                            </Panel>
                            <Panel id='setting'>
                                <Head title={'Настройки'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <Setting
                                    targetCity={this.state.targetCity}
                                    user={this.state.user}
                                    popout={this.openAlert}
                                    changeCity={() => this.setState({activePanelLk: 'changeCity'})}
                                />
                            </Panel>
                            <Panel id='changeCity'>
                                <Head title={'Выбор города'}
                                      goBack={() => this.setState({activePanelLk: 'setting'})}/>
                                <CityList changeTargetCity={(city) => this.setState({
                                    targetCity: city,
                                    activePanelLk: 'setting'
                                })}/>
                            </Panel>
                        </View>
                        <View activePanel={this.state.activePanelReg} id="registration">
                            <Panel id='registration'>
                                <Head title={'Регистрация'} goBack={() => this.setState({activeViewLk: 'lk'})}/>
                                <Invite targetCity={this.state.targetCity}
                                        user={this.state.user}
                                        closeReg={this.closeReg}
                                        changeCity={() => this.setState({activePanelReg: 'changeCity'})}
                                        snackbar={(message) => this.openSnack(message)}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='changeCity'>
                                <Head title={'Выбор города'}
                                      goBack={() => this.setState({activePanelReg: 'registration'})}/>
                                <CityList changeTargetCity={(city) => this.setState({
                                    targetCity: city,
                                    activePanelReg: 'registration'
                                })}/>
                            </Panel>
                        </View>
                    </Root>
                </Epic>
            )
        }
    }
}


export default App;