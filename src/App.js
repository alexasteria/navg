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
import MasterComments from './js/masters/mastersComments.js';
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
//import bridge from "@vkontakte/vk-bridge-mock";
import bridge from '@vkontakte/vk-bridge';
import {postData, patchData} from './js/elements/functions'
import Masters from './js/masters/masters';
import CategoriesList from './js/elements/categoriesList'
import spinner from './js/elements/img/spinner.svg'
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll, changeFindModelsList, changeFindModelsListScroll,
    loginUser, setMaster} from "./js/store/actions";
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
        bridge.send('VKWebAppGetUserInfo', {})
            .then(data => {this.verificationUser(data)});
        if (this.props.params) {postData(BACKEND.logs.params, this.props.params)}
        if (this.props.linkParams.masterid) {
            console.log('В параметры пришел мастер');
            this.openMasterOnLink(this.props.linkParams.masterid)
        }
    }

    verificationUser = (vkUser) => {
         fetch(BACKEND.users + '/vkuid/' + vkUser.id)
            .then(res => res.json())
            .then(usersArr => {
                if (usersArr.length === 0) {
                    const user = {
                        vkUid: vkUser.id,
                        firstname: vkUser.first_name,
                        lastname: vkUser.last_name,
                        avatarLink: vkUser.photo_200,
                        sex: vkUser.sex,
                        location: {
                            country: vkUser.country || 'Не определен',
                            city: vkUser.city || 'Не определен'
                        },
                        isMaster: false,
                        favs: []
                    };
                    fetch(BACKEND.users, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {'Content-Type': 'application/json',},
                        redirect: 'follow',
                        referrer: 'no-referrer',
                        body: JSON.stringify(user)
                    })
                        .then(res => res.json())
                        .then(newUser => {
                            this.props.loginUser(newUser);
                        });
                } else {
                    if (usersArr[0].isMaster === true) {
                        fetch(BACKEND.masters.vkuid + usersArr[0].vkUid)
                            .then(res => res.json())
                            .then(master => {
                                if (master.length === 0) {
                                    console.log('Мастер удален');
                                    return null
                                } else {
                                    this.props.setMaster(master[0]);
                                }
                            });
                    }
                    this.props.loginUser(usersArr[0]);
                }
            })
            .catch(error => {
                this.openSnack('Отсутствует соединение с базой пользователей.');
                console.log(error); // Error: Not Found
            });
    };

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
        if (this.state.snackbar) this.setState({snackbar: null});
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

    closeReg = (master) => {
        fetch(BACKEND.masters.all, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(master)
        })
            .then(res => res.json())
            .then(newMaster => {
                this.props.setMaster(newMaster);
                this.setState({activeViewLk: 'lk'});
                this.openSnack('Вы успешно зарегистрированы. Не забудьте добавить фотографии в портфолио - так, шансы получить заказ намного выше.');
                this.sendMessage('Благодарим за регистрацию. Не забудьте добавить фотографии в портфолио в разделе Кабинет->Портфолио. Так же, при необходимости, в разделе Кабинет->Поиск модели - можно создать объявление о поиске модели для пополнения портфолио, либо акционных предложений.');
            })
        .catch(e=>{
            console.log(e);
            this.openSnack('Ошибка при регистрации');
            this.setState({activeViewLk: 'lk'});
        })
    };

    sendMessage = (message) => {
        let token = BACKEND.keyGroup;
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "params": {"random_id": Math.random(), "peer_id": "-193179174", "user_id": this.props.user.vkUid,"message": message, "v":"5.103", "access_token": token}})
            .then(result => console.log(result))
            .catch(e => console.log(e))
    };

    openPanelMaster = (panelName, master) => {
        this.setState({activeMaster: master, activeMasterId: master._id, activePanelMasters: panelName});
    };

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
        let user = this.props.user;
        user.location.city = city;
        this.props.changeTargetCity(city);
        patchData(BACKEND.users+'/'+user._id, user);
        this.setActiveModal(null)
    }

    render() {
        const {user, loginStatus} = this.props;
        if (loginStatus === false) {
            return (
                <Placeholder icon={<img alt={'Загрузка'} src={spinner}/>}>
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
                            <News
                                openReg={() => this.setState({activeViewLk: 'registration', activeStory: 'lk'})}
                                openStory={this.openStory}
                            />
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
                                    changeCity={() => this.setActiveModal('cityList')}
                                    openSnack={(title)=>this.openSnack(title)}
                                    changeCategory={()=>this.setState({activeViewMasters: 'masterCat'})}
                                    openPanelMaster={this.openPanelMaster}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id="masterInfo">
                                <Head
                                    title={'О мастере'}
                                    goBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                />
                                <MasterCard
                                    openPhoto={() => this.setState({activePanelMasters: 'masterPhoto'})}
                                    openComments={() => this.setState({activePanelMasters: 'masterComments'})}
                                    activeMasterId={this.state.activeMasterId}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                />
                                <MasterPhoto activeMaster={this.state.activeMaster}/>
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title={'Отзывы'}
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                />
                                <MasterComments
                                    activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                        </View>
                        <View activePanel="masterCat" id="masterCat">
                            <Panel id="masterCat">
                                <PanelHeader>Выбор категории</PanelHeader>
                                <Group>
                                    <CategoriesList
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
                                changeCity={() => this.setActiveModal('cityList')}
                            />
                        </Panel>
                        <Panel id="masterInfo">
                            <Head
                                title={'О мастере'}
                                goBack={() => this.setState({activePanelFindModels: 'findmodel'})}
                            />
                            <MasterCard
                                openPhoto={() => this.setState({activePanelFindModels: 'masterPhoto'})}
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
                                            user={user}
                                            openSetting={() => this.setActiveModal('setting')}
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
                                    user={user}
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
                                    user={user}
                                    activeMasterId={this.state.activeMasterId}
                                    openComments={() => this.setState({activePanelLk: 'masterComments'})}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head title={'Портфолио'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <Portfolio user={user}/>
                            </Panel>
                            <Panel id="masterComments">
                                <Head title={'Отзывы'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <MasterComments user={user} activeMaster={this.state.activeMaster}/>
                            </Panel>
                            <Panel id='findModel'>
                                <Head title={'Мастер ищет модель'} goBack={() => this.setState({activePanelLk: 'lk'})}/>
                                <FindModelMaster user={user} popout={this.openAlert}/>
                            </Panel>
                        </View>
                        <View activePanel={this.state.activePanelReg} id="registration">
                            <Panel id='registration'>
                                <Head title={'Регистрация'} goBack={() => this.setState({activeViewLk: 'lk'})}/>
                                <Invite
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
        findModelsListScroll: state.findModelsListScroll,
        user: state.user,
        loginStatus: state.loginStatus
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeMastersList: bindActionCreators(changeMastersList, dispatch),
        changeTargetCategory: bindActionCreators(changeTargetCategory, dispatch),
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
        changeMasterslistScroll: bindActionCreators(changeMasterslistScroll, dispatch),
        changeFindModelsList: bindActionCreators(changeFindModelsList, dispatch),
        changeFindModelsListScroll: bindActionCreators(changeFindModelsListScroll, dispatch),
        loginUser: bindActionCreators(loginUser, dispatch),
        setMaster: bindActionCreators(setMaster, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(App);