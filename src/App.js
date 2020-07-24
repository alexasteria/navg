import React from 'react';
import {
    Epic,
    Group,
    Panel,
    PanelHeader,
    Placeholder,
    Root,
    Tabbar,
    TabbarItem,
    View, Snackbar, Avatar, Tabs, TabsItem, Separator, ConfigProvider, Spinner
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
import Moder from "./js/news/moder";
//import bridge from "@vkontakte/vk-bridge-mock";
import bridge from '@vkontakte/vk-bridge';
import {patchData} from './js/elements/functions'
import Masters from './js/masters/masters';
import CategoriesList from './js/elements/categoriesList'
import Rules from './js/lk/rules';
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll, changeFindModelsList, changeFindModelsListScroll,
    loginUser, setMaster, changeActiveMasterOnMasters, changeActiveMasterOnFindModels, changeActiveMasterOnFavs, changeLaunchParams, changeStory, goTo, goForward} from "./js/store/actions";
import {bindActionCreators} from "redux";
import HeadCity from "./js/elements/headCity";

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
            activeTabLk: 'about',
            scheme: "bright_light"

        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    componentDidMount() {
        if (this.props.launchParams.sign !== undefined) {
            this.setState({validLaunchParams: true});
            console.log('Параметры пришли');
            this.props.changeLaunchParams(this.props.launchParams);
            this.auth(this.props.launchParams);
        } else {
            this.setState({validLaunchParams: false});
            this.openSnack('Ошибка. Не переданы параметры запуска.');
        }
        bridge.subscribe(({ detail: { type, data }}) => {
            if (type === 'VKWebAppUpdateConfig'){
                this.setState({scheme: data.scheme});
            }
        });
        window.onpopstate = () => {
            this.goBack(this.props.activeStory)
        };
    }

    auth = (params) => {
        fetch(BACKEND.users.auth, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(data=>{
                this.setState({validLaunchParams: true});
                this.props.loginUser(data.user);
                if (data.master !== null){
                    this.props.setMaster(data.master)
                }
            })
            .catch(e=>{
                console.log(e);
                this.openSnack('Ошибка подключения к серверу.')
                this.setState({validLaunchParams: false});
            })
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
                this.openSnack('Ваш профиль отправлен на проверку. Не забудьте добавить фотографии в портфолио - так, шансы получить заказ намного выше.');
                //this.sendMessage('Благодарим за регистрацию. Ваш профиль будет проходить модерацию в течении часа. Не забудьте добавить фотографии в портфолио в разделе Кабинет->Портфолио. Так же, при необходимости, в разделе Кабинет->Поиск модели - можно создать объявление о поиске модели для пополнения портфолио, либо акционных предложений.');
            })
        .catch(e=>{
            console.log(e);
            this.openSnack(e.message);
            //this.setState({activeViewLk: 'lk'});
        })
    };

    openMasterOnLink = (masterId) => {
        this.setState({activeMasterId: masterId,activeStory: 'masters',activeViewMasters: 'mastersList',activePanelMasters: 'masterInfo'});
        console.log(masterId);
    };

    goTo = (story, panel) => {
        window.history.pushState({panel: panel}, panel);
        this.props.goTo(story, panel)
        let hist = this.props[story+'History'];
        console.log(hist);
    };

    goBack = (story) => {
        if (this.props[story+'History'].length === 1){
            bridge.send('VKWebAppClose', {'status': 'sucsess'});
        } else {
            this.props.goForward(story)
            let hist = this.props[story+'History'];
            console.log(hist);
        }
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
        user.params = this.props.params;
    }

    render() {
        const {user, loginStatus} = this.props;
        if (this.state.validLaunchParams === false) {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <View id="warn" activePanel="warn">
                        <Panel id="warn">
                            <Placeholder
                                icon={<Spinner size="large" style={{ marginTop: 40 }} />}
                            >
                                Все, беда. Кто-то лезет в параметры запуска :(
                            </Placeholder>
                        </Panel>
                    </View>
                </ConfigProvider>
            )
        } else if (loginStatus === false) {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <Placeholder
                        stretched
                        icon={<Spinner size="large" style={{ marginTop: 40 }} />}
                        header="Выполняется вход..."
                    >Это может занять несколько секунд
                        {this.state.snackbar}
                    </Placeholder>
                </ConfigProvider>
            )
      } else {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                <Epic activeStory={this.props.activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={()=>this.props.changeStory('news')}
                            selected={this.props.activeStory === 'news'}
                            data-story="news"
                            text="Новости"
                        ><Icon28FireOutline/></TabbarItem>
                        <TabbarItem
                            onClick={()=>this.props.changeStory('masters')}
                            selected={this.props.activeStory === 'masters'}
                            data-story="masters"
                            text="Мастера"
                        ><Icon28ServicesOutline/></TabbarItem>
                        <TabbarItem
                            onClick={()=>this.props.changeStory('findmodel')}
                            selected={this.props.activeStory === 'findmodel'}
                            data-story="findmodel"
                            text="Ищу модель"
                        ><Icon28Notifications/></TabbarItem>
                        <TabbarItem
                            onClick={()=>this.props.changeStory('lk')}
                            selected={this.props.activeStory === 'lk'}
                            data-story="lk"
                            text="Кабинет"
                        ><Icon28More/></TabbarItem>
                    </Tabbar>
                }>
                    <View id="news" history={this.props.newsHistory} onSwipeBack={() => this.goBack('news')} activePanel={this.props.activePanelnews}>
                            <News
                                id="news"
                                params={this.props.params}
                                openReg={()=>{
                                    this.props.changeStory('lk');
                                    this.setState({activeViewLk: 'registration'})
                                }}
                                //openReg={() => this.setState({activeViewLk: 'registration', activeStory: 'lk'})}
                                openStory={this.openStory}
                                user={this.props.user}
                                // openModer={() => this.goForwardNews('moder')}
                                openModer={() => this.goTo('news', 'moder')}
                            />
                            <Moder
                                id="moder"
                                goBack={() => this.goBack('news')}
                                user={this.state.user}
                                openMaster={(master) => {
                                    this.setState({activeMaster: master});
                                    this.goTo('news', 'masterInfo');
                                    //this.goForwardNews('masterInfo');
                                }}
                            />
                            <Panel id="masterInfo">
                                <MasterCard
                                    goBack={() => this.goBack('news')}
                                    openPhoto={() => 'null'}
                                    openComments={() => 'null'}
                                    activeMaster={this.state.activeMaster}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                    </View>
                        <View id="masters" activePanel={this.props.activePanelmasters} history={this.props.mastersHistory} onSwipeBack={() => this.goBack('masters')}>
                            <Masters
                                id="mastersList"
                                    //changeCity={()=>this.setState({activePanelMasters: 'changeCity'})}
                                    changeCity={()=> this.goTo('masters', 'changeCity')}
                                    openSnack={(title)=>this.openSnack(title)}
                                    //changeCategory={()=>this.setState({activePanelMasters: 'masterCat'})}
                                    changeCategory={()=>this.goTo('masters', 'masterCat')}
                                    openPanelMaster={(master)=>{
                                        this.props.changeActiveMasterOnMasters(master);
                                        this.goTo('masters', 'masterInfo');
                                    }}
                                    snackbar={this.state.snackbar}
                            />
                            <Panel id='changeCity'>
                                <Head title={'Выбор города'}
                                      goBack={() => this.props.goBack()}/>
                                    <CityList
                                            id='changeCity'
                                            // goBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                            goBack={() => this.goBack('masters')}
                                            changeCity={(city) => {
                                            this.changeTargetCity(city);
                                            this.goBack('masters');
                                            //this.setState({activePanelMasters: 'mastersList'})
                                        }}
                                    />
                            </Panel>
                            <Panel id="masterInfo">
                                <MasterCard
                                    id="masterInfo"
                                    // goBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                    goBack={() => this.goBack('masters')}
                                    //onSwipeBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                    //openPhoto={() => this.setState({activePanelMasters: 'masterPhoto'})}
                                    openPhoto={() => this.goTo('masters', 'masterPhoto')}
                                    openComments={() => this.goTo('masters', 'masterComments')}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMasterId={this.state.activeMasterId}
                                    //setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    // goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                    goBack={() => this.goBack('masters')}
                                />
                                <MasterPhoto
                                    // goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                    goBack={() => this.goBack('masters')}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title={'Отзывы'}
                                    goBack={() => this.goBack('masters')}
                                />
                                <MasterComments
                                    goBack={() => this.goBack('masters')}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id="masterCat">
                                <Head
                                    title={'Выбор категории'}
                                    goBack={() => this.goBack('masters')}
                                />
                                <Group>
                                    <CategoriesList
                                        setCategory={(category) => {
                                            this.props.changeTargetCategory(category);
                                            this.goBack('masters');
                                            //this.setState({activePanelMasters: 'mastersList'});
                                        }}
                                    />
                                </Group>
                            </Panel>
                        </View>
                    <View
                        id="findmodel"
                        activePanel={this.props.activePanelfindmodel}
                        history={this.props.findmodelHistory} onSwipeBack={() => this.goBack('findmodel')}
                    >
                        <Panel id="findmodel">
                            <PanelHeader>Ишу модель</PanelHeader>
                            <FindModel
                                //openMasterOnId={(masterId)=>this.openMasterOnId(masterId)}
                                openMasterOnId={(masterId)=>{
                                    fetch(BACKEND.masters.onID + masterId)
                                        .then(res => res.json())
                                        .then(master => {
                                            this.props.changeActiveMasterOnFindModels(master);
                                            console.log(master);
                                            this.goTo('findmodel', 'masterInfo')
                                        });
                                }}
                                // changeCity={() => this.setState({activePanelFindModels: 'changeCity'})}
                                changeCity={() => this.goTo('findmodel', 'changeCity')}
                            />
                        </Panel>
                        <Panel id='changeCity'>
                            <Head title={'Выбор города'}
                                  goBack={() => this.props.goBack()}/>
                        <CityList
                                id='changeCity'
                                goBack={() => this.goBack('findmodel')}
                                changeCity={(city) => {
                                    this.changeTargetCity(city);
                                    this.goBack('findmodel')
                            }}
                        />
                        </Panel>
                        <Panel id="masterInfo">
                            <MasterCard
                                id="masterInfo"
                                goBack={() => this.goBack('findmodel')}
                                openPhoto={() => this.goTo('findmodel', 'masterPhoto')}
                                activeMaster={this.props.activeMasterOnFindModels}
                                openComments={() => this.goTo('findmodel', 'masterComments')}
                                //setActiveMaster={(master)=>this.setState({activeMaster: master})}
                            />
                        </Panel>
                        <Panel id="masterPhoto">
                            <Head
                                title={'Портфолио'}
                                goBack={() => this.goBack('findmodel')}
                            />
                            <MasterPhoto
                                goBack={() => this.goBack('findmodel')}
                                activeMaster={this.props.activeMasterOnFindModels}
                                //activeMaster={this.state.activeMaster}
                            />
                        </Panel>
                        <Panel id="masterComments">
                            <Head
                                title={'Отзывы'}
                                goBack={() => this.goBack('findmodel')}
                            />
                            <MasterComments
                                goBack={() => this.goBack('findmodel')}
                                activeMaster={this.props.activeMasterOnFindModels}
                                //activeMaster={this.state.activeMaster}
                            />
                        </Panel>
                    </View>

                    <Root id="lk" activeView={this.state.activeViewLk}>
                        <View id="lk" activePanel={this.props.activePanellk} history={this.props.lkHistory} onSwipeBack={() => this.goBack('lk')}>
                            <Panel id="lk">
                                <PanelHeader separator={false}>Кабинет</PanelHeader>
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
                                            master={this.props.master}
                                            user={user}
                                            openSetting={() => this.goTo('lk', 'setting')}
                                            openFavourite={() => this.goTo('lk', 'favourite')}
                                            openFindModel={() => this.goTo('lk', 'findModel')}
                                            openMasterPhoto={() => this.goTo('lk', 'portfolio')}
                                            isFavourite={this.props.params.vk_is_favorite}
                                        /> :
                                        <Partners />
                                }
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='setting'>
                                <Head
                                    title='Настройки'
                                    goBack={() => this.goBack('lk')}
                                />
                                <Setting
                                    snackbar={(message) => this.openSnack(message)}
                                    modalBack={this.modalBack}
                                    activeModal={this.state.activeModal}
                                    changeModal={(name) => this.setActiveModal(name)}
                                />
                            </Panel>
                            <Panel id='favourite'>
                                <Head
                                    title='Избранное'
                                    goBack={() => this.goBack('lk')}
                                />
                                <Favourite
                                    goBack={() => this.goBack('lk')}
                                    user={user}
                                    openFavMasterOnId={(masterId)=>{
                                        fetch(BACKEND.masters.onID + masterId)
                                            .then(res => res.json())
                                            .then(master => {
                                                this.props.changeActiveMasterOnFavs(master);
                                                this.goTo('lk', 'masterInfo')
                                            });
                                    }}
                                />
                            </Panel>
                            <Panel id="masterInfo">
                                <MasterCard
                                    id="masterInfo"
                                    goBack={() => this.goBack('lk')}
                                    openPhoto={() => this.goTo('lk', 'masterPhoto')}
                                    user={user}
                                    activeMaster={this.props.activeMasterOnFavs}
                                    openComments={() => this.goTo('lk', 'masterComments')}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.goBack('lk')}
                                />
                                <MasterPhoto
                                    goBack={() => this.setState({activePanelLk: 'masterInfo'})}
                                    activeMaster={this.props.activeMasterOnFavs}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id="portfolio">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.goBack('lk')}
                                />
                                <Portfolio
                                    goBack={() => this.goBack('lk')}
                                    user={user}
                                />
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title='Отзывы'
                                    goBack={() => this.goBack('lk')}
                                />
                                <MasterComments
                                    goBack={() => this.goBack('lk')}
                                    user={user}
                                    activeMaster={this.props.activeMasterOnFavs}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id='findModel'>
                                <Head
                                    title='Ищу модель'
                                    goBack={() => this.goBack('lk')}
                                />
                                <FindModelMaster
                                    goBack={() => this.goBack('lk')}
                                    user={user} popout={this.openAlert}
                                />
                            </Panel>
                        </View>
                        <View activePanel={this.state.activePanelReg} id='registration'>
                            <Panel id='registration'>
                                <Head
                                    title={'Регистрация'}
                                    goBack={() => this.setState({activeViewLk: 'lk'})}
                                />
                                <Invite
                                    goBack={() => this.setState({activeViewLk: 'lk'})}
                                    closeReg={this.closeReg}
                                    changeCity={() => this.setState({activePanelReg: 'changeCity'})}
                                    openRules={() => this.setState({activePanelReg: 'rules'})}
                                    snackbar={(message) => this.openSnack(message)}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='rules'>
                                <Head
                                    title='Соглашение'
                                    goBack={() => this.setState({activePanelReg: 'registration'})}
                                />
                                <Rules
                                    goBack={() => this.setState({activePanelReg: 'registration'})}
                                />
                            </Panel>
                            <Panel id='changeCity'>
                                <Head title={'Выбор города'}
                                      goBack={() => this.props.goBack()}/>
                            <CityList
                                    id='changeCity'
                                    goBack={() => this.setState({activePanelReg: 'registration'})}
                                    changeCity={(city) => {
                                    this.changeTargetCity(city);
                                    this.setState({activePanelReg: 'registration'})
                                }}
                            />
                            </Panel>
                        </View>
                    </Root>
                </Epic>
                </ConfigProvider>
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
        loginStatus: state.loginStatus,
        master: state.master,
        activeMasterOnMasters: state.activeMasterOnMasters,
        activeMasterOnFindModels: state.activeMasterOnFindModels,
        activeMasterOnFavs: state.activeMasterOnFavs,
        params: state.params,
        activePanelnews: state.activePanelnews,
        activePanelmasters: state.activePanelmasters,
        activePanelfindmodel: state.activePanelfindmodel,
        activePanellk: state.activePanellk,
        activeStory: state.activeStory,
        newsHistory: state.newsHistory,
        mastersHistory: state.mastersHistory,
        findmodelHistory: state.findmodelHistory,
        lkHistory: state.lkHistory
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
        setMaster: bindActionCreators(setMaster, dispatch),
        changeActiveMasterOnMasters: bindActionCreators(changeActiveMasterOnMasters, dispatch),
        changeActiveMasterOnFindModels: bindActionCreators(changeActiveMasterOnFindModels, dispatch),
        changeActiveMasterOnFavs: bindActionCreators(changeActiveMasterOnFavs, dispatch),
        changeLaunchParams: bindActionCreators(changeLaunchParams, dispatch),
        changeStory: bindActionCreators(changeStory, dispatch),
        goTo: bindActionCreators(goTo, dispatch),
        goForward: bindActionCreators(goForward, dispatch)

    };
};

export default connect(putStateToProps, putActionsToProps)(App);