import React from 'react';
import {
    Alert,
    Epic,
    Group,
    Panel,
    PanelHeader,
    Placeholder,
    Root,
    Tabbar,
    TabbarItem,
    View, Snackbar, Avatar, Tabs, TabsItem, Separator
} from '@vkontakte/vkui';
import Icon28Notifications from '@vkontakte/icons/dist/28/notification.js';
import Icon28More from '@vkontakte/icons/dist/28/more.js';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon28ServicesOutline from '@vkontakte/icons/dist/28/services_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Head from './js/elements/panelHeader';
import MasterCard from './js/masters/mastersCard.js';
import MasterPhoto from './js/masters/mastersPhoto.js';
import MasterComments from './/js/masters/mastersComments.js';
//import Idea from './js/ideaidea.js';
import News from './js/news/news.js';
import Invite from './js/lk/invite.js';
import Lk from './js/lk/lk.js'
import Portfolio from './js/lk/portfolio.js'
import Setting from './js/lk/setting.js';
import Favourite from './js/lk/favourite.js';
import FindModel from "./js/findmodel/findModel";
import FindModelMaster from "./js/lk/findModelMaster";
import Partners from "./js/lk/partners";
import {BACKEND} from "./js/func/func";
import CityList from './js/elements/cityList'
import Modal from './js/elements/modalPage'
import bridge from "@vkontakte/vk-bridge-mock";
//import bridge from '@vkontakte/vk-bridge';
import CityListModal from "./js/elements/cityListModal";
import {postData, patchData} from './js/elements/functions'
import Masters from './js/masters/masters';
import CategoriesList from './js/elements/categoriesList'
import spinner from './js/elements/img/spinner.svg'
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll, changeFindModelsList, changeFindModelsListScroll} from "./store/actions";
import {bindActionCreators} from "redux";

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
            targetCity: 'Не выбрано',
            activeTabLk: 'about'

        };
        this.onStoryChange = this.onStoryChange.bind(this);
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };

    }

    componentDidMount() {
        console.log(this.props);
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
    }

    verifiedUser = (vkUser) => {
         fetch(BACKEND.users + '/vkuid/' + vkUser.id)
            .then(res => res.json())
            .then(usersArr => {
                if (usersArr.length === 0) {
                    this.regNewUser();
                } else {
                    let targetCity = typeof usersArr[0].location.city !== 'object' ? 'Не выбрано' : usersArr[0].location.city;
                    this.props.changeTargetCity(targetCity);
                    this.setState({user: usersArr[0]});
                }
            })
            .catch(error => {
                this.openSnack('Отсутствует соединение с базой пользователей.');
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
        this.setState({activeMaster: master, activeMasterId: master._id, activePanelMasters: panelName});
    };
    // openMaster = (master) => {
    //     this.setState({ activeViewMasters: 'mastersList' });
    //     this.setState({ activeStory: 'masters' });
    //     this.setState({ activePanelMasters: 'masterInfo' });
    //     this.setState({ activeMaster: master });
    // };
    openMasterOnId = (masterId) => {
        this.setState({activePanelFindModels: 'masterInfo', activeMasterId: masterId});
    };
    openMasterOnLink = (masterId) => {
        this.setState({activeMasterId: masterId,activeStory: 'masters',activeViewMasters: 'mastersList',activePanelMasters: 'masterInfo'});
    };
    openFavMasterOnId = (masterId) => {
        this.setState({activeMasterId: masterId, activePanelLk: 'masterInfo'});
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
        this.setState({user:user}, () => this.setActiveModal(null));
        patchData(BACKEND.users+'/'+user._id, user);
        this.props.changeTargetCity(city);
    }

    render() {
        const {mastersList} = this.props;
        if (this.state.user === '') {
            return (
                // <Placeholder icon={<Spinner size="large" style={{marginTop: 20}}/>}>
                <Placeholder icon={<img src={spinner}/>}>
                    Выполняется вход...
                    {this.state.snackbar}
                </Placeholder>
            )
        } else {
            return (
                <Epic activeStory={this.state.activeStory} tabbar={
                    <Tabbar>
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
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'lk'}
                            data-story="lk"
                            text="Кабинет"
                        ><Icon28More/></TabbarItem>
                    </Tabbar>
                }>
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
                                leftButton={false}
                                rightButton={false}
                            />
                        }
                    >
                        <View id="mastersList" activePanel={this.state.activePanelMasters}>
                            <Panel id="mastersList">
                                <Masters
                                    user={this.state.user}
                                    changeCity={() => this.setActiveModal('cityList')}
                                    targetCity={this.props.targetCity}
                                    openSnack={(title)=>this.openSnack(title)}
                                    changeCategory={()=>this.setState({activeViewMasters: 'masterCat'})}
                                    targetCategory={this.props.targetCategory}
                                    openPanelMaster={this.openPanelMaster}
                                    mastersList={mastersList}
                                    changeMastersList={(newMastersList)=>this.props.changeMastersList(newMastersList)}
                                    changeMasterslistScroll={(scroll)=>this.props.changeMasterslistScroll(scroll)}
                                    scroll={this.props.mastersListScroll}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id="masterInfo">
                                <Head title={'О мастере'}
                                      goBack={() => this.setState({activePanelMasters: 'mastersList'})}/>
                                <MasterCard
                                    openPhoto={() => this.setState({activePanelMasters: 'masterPhoto'})}
                                    user={this.state.user}
                                    openComments={() => this.setState({activePanelMasters: 'masterComments'})}
                                    activeMasterId={this.state.activeMasterId}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head title={'Портфолио'}
                                      goBack={() => this.setState({activePanelMasters: 'masterInfo'})}/>
                                <MasterPhoto activeMaster={this.state.activeMaster}/>
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title={'Отзывы'}
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                />
                                <MasterComments
                                    user={this.state.user}
                                    activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                        </View>
                        <View activePanel="masterCat" id="masterCat">
                            <Panel id="masterCat">
                                <PanelHeader>Выбор категории</PanelHeader>
                                <Group>
                                    <CategoriesList
                                        targetCategory={this.props.targetCategory}
                                        setCategory={(category) => {
                                            this.props.changeTargetCategory(category);
                                            this.setState({activeViewMasters: 'mastersList'});
                                        }}
                                    />
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
                                leftButton={false}
                                rightButton={false}
                            />
                        }
                    >
                        <Panel id="findmodel">
                            <PanelHeader>Мастер ищет модель</PanelHeader>
                            <FindModel
                                openMasterOnId={(masterId)=>this.openMasterOnId(masterId)}
                                user={this.state.user}
                                changeCity={() => this.setActiveModal('cityList')}
                                targetCity={this.props.targetCity}
                                changeFindModelsList={(find)=>this.props.changeFindModelsList(find)}
                                findModelsList={this.props.findModelsList}
                                scroll={this.props.findModelsListScroll}
                                changeFindModelsListScroll={(scroll)=>this.props.changeFindModelsListScroll(scroll)}
                            />
                        </Panel>
                        <Panel id="masterInfo">
                            <Head
                                title={'О мастере'}
                                goBack={() => this.setState({activePanelFindModels: 'findmodel'})}
                            />
                            <MasterCard
                                openPhoto={() => this.setState({activePanelFindModels: 'masterPhoto'})}
                                user={this.state.user}
                                activeMasterId={this.state.activeMasterId}
                                openComments={() => this.setState({activePanelFindModels: 'masterComments'})}
                                setActiveMaster={(master)=>this.setState({activeMaster: master})}
                            />
                        </Panel>
                        <Panel id="masterPhoto">
                            <Head
                                title={'Портфолио'}
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                            />
                            <MasterPhoto activeMaster={this.state.activeMaster}/>
                        </Panel>
                        <Panel id="masterComments">
                            <Head
                                title={'Отзывы'}
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                            />
                            <MasterComments
                                user={this.state.user}
                                activeMaster={this.state.activeMaster}
                            />
                        </Panel>
                    </View>

                    <Root id="lk" activeView={this.state.activeViewLk}>
                        <View id="lk" activePanel={this.state.activePanelLk} popout={this.state.popout} modal={
                            <Setting
                                snackbar={(message) => this.openSnack(message)}
                                modalBack={this.modalBack}
                                activeModal={this.state.activeModal}
                                user={this.state.user}
                                changeModal={(name) => this.setActiveModal(name)}
                            />
                        }>
                            <Panel id="lk">
                                <PanelHeader>Личный кабинет</PanelHeader>
                                <Tabs>
                                    <TabsItem
                                        onClick={() => this.setState({ activeTabLk: 'about' })}
                                        selected={this.state.activeTabLk === 'about'}
                                    >
                                        О пользователе
                                    </TabsItem>
                                    <TabsItem
                                        onClick={() => this.setState({ activeTabLk: 'partners' })}
                                        selected={this.state.activeTabLk === 'partners'}
                                    >
                                        Партнерам
                                    </TabsItem>
                                </Tabs>
                                <Separator />
                                {
                                    this.state.activeTabLk === 'about' ?
                                        <Lk
                                            user={this.state.user}
                                            openSetting={() => this.setActiveModal('setting')}
                                            //openSetting={() => this.setState({activePanelLk: 'setting'})}
                                            openFavourite={() => this.setState({activePanelLk: 'favourite'})}
                                            openFindModel={() => this.setState({activePanelLk: 'findModel'})}
                                            openMasterPhoto={() => this.setState({activePanelLk: 'masterPhoto'})}
                                            isFavourite={this.props.params.vk_is_favorite}
                                        /> :
                                        <Partners />
                                }
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='favourite'>
                                <Head
                                    title={'Избранное'}
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
                                />
                                <Favourite
                                    user={this.state.user}
                                    openFavMasterOnId={this.openFavMasterOnId}
                                />
                            </Panel>
                            <Panel id="masterInfo">
                                <Head
                                    title={'О мастере'}
                                    goBack={() => this.setState({activePanelLk: 'favourite'})}
                                />
                                <MasterCard
                                    openPhoto={() => this.setState({activePanelLk: 'masterPhoto'})}
                                    user={this.state.user}
                                    activeMasterId={this.state.activeMasterId}
                                    openComments={() => this.setState({activePanelLk: 'masterComments'})}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
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
                            {/*<Panel id='setting'>*/}
                            {/*    <Head title={'Настройки'} goBack={() => this.setState({activePanelLk: 'lk'})}/>*/}
                            {/*    <Setting*/}
                            {/*        targetCity={this.props.targetCity}*/}
                            {/*        user={this.state.user}*/}
                            {/*        popout={this.openAlert}*/}
                            {/*        changeCity={() => this.setState({activePanelLk: 'changeCity'})}*/}
                            {/*    />*/}
                            {/*</Panel>*/}
                            {/*<Panel id='changeCity'>*/}
                            {/*    <Head title={'Выбор города'}*/}
                            {/*          goBack={() => this.setState({activePanelLk: 'setting'})}/>*/}
                            {/*    <CityList changeCity={(city) => this.setState({*/}
                            {/*        targetCity: city,*/}
                            {/*        activePanelLk: 'setting'*/}
                            {/*    })}/>*/}
                            {/*</Panel>*/}
                        </View>
                        <View activePanel={this.state.activePanelReg} id="registration">
                            <Panel id='registration'>
                                <Head title={'Регистрация'} goBack={() => this.setState({activeViewLk: 'lk'})}/>
                                <Invite targetCity={this.props.targetCity}
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
                                <CityList changeCity={(city) => {
                                    this.changeTargetCity(city);
                                    this.setState({activePanelReg: 'registration'})
                                }}/>
                            </Panel>
                        </View>
                    </Root>
                </Epic>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        mastersList: state.mastersList,
        targetCategory: state.targetCategory,
        targetCity: state.targetCity,
        mastersListScroll: state.mastersListScroll,
        findModelsList: state.findModelsList,
        findModelsListScroll: state.findModelsListScroll
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeMastersList: bindActionCreators(changeMastersList, dispatch),
        changeTargetCategory: bindActionCreators(changeTargetCategory, dispatch),
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
        changeMasterslistScroll: bindActionCreators(changeMasterslistScroll, dispatch),
        changeFindModelsList: bindActionCreators(changeFindModelsList, dispatch),
        changeFindModelsListScroll: bindActionCreators(changeFindModelsListScroll, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(App);