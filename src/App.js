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
    View, Snackbar, Avatar, Tabs, TabsItem, Separator, ConfigProvider, Spinner
} from '@vkontakte/vkui';
import Icon28Notifications from '@vkontakte/icons/dist/28/notification.js';
import { RouteNode } from 'react-router5'
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
import Moder from "./js/news/moder";
import bridge from "@vkontakte/vk-bridge-mock";
//import bridge from '@vkontakte/vk-bridge';
import {postData, patchData} from './js/elements/functions'
import Masters from './js/masters/masters';
import CategoriesList from './js/elements/categoriesList'
import spinner from './js/elements/img/spinner.svg'
import Rules from './js/lk/rules';
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll, changeFindModelsList, changeFindModelsListScroll,
    loginUser, setMaster, changeActiveMasterOnMasters, changeActiveMasterOnFindModels, changeActiveMasterOnFavs} from "./js/store/actions";
import {bindActionCreators} from "redux";
import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'

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
            scheme: "bright_light",
            activePanelNews: 'news',
            newsHistory: ['news']

        };
        this.onStoryChange = this.onStoryChange.bind(this);
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };

    }

    componentDidMount() {
        window.onpopstate = () => {
            window.history.pushState(null, null);
        };
        bridge.send('VKWebAppGetUserInfo', {})
            .then(data => {this.verificationUser(data)});
        if (this.props.linkParams.masterid) {
            this.setState({activeMasterId: this.props.linkParams.masterid});
            this.openMasterOnLink(this.props.linkParams.masterid);
            //bridge.send("VKWebAppSetLocation", {"location": "masterid="+this.props.linkParams.masterid});
        }
        bridge.subscribe(({ detail: { type, data }}) => {
            if (type === 'VKWebAppUpdateConfig'){
                this.setState({scheme: data.scheme});
            }
            // if (type === 'VKWebAppViewRestore') { // Восстановление из кэша
            //     if (this.props.linkParams.masterid) {
            //         this.setState({activeMasterId: this.props.linkParams.masterid});
            //     }
            // }
            // if (type === 'VKWebAppLocationChanged'){
            //     let id = data.location.split('=');
            //     console.log('В параметры пришел мастер', id[1]);
            //     this.openMasterOnLink(id[1]);
            // }
            // if (type === 'VKWebAppUpdateConfig') { // Получаем тему клиента.
            //     this.setState({scheme: data.scheme})
            // }
        });
        if (this.props.params) {
            fetch(BACKEND.logs.params, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json',},
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(this.props.params)
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({validationParams: res.status})
                })
                .catch(e=>console.log(e));
        }
    }

    goBackNews = () => {
            const newsHistory = [...this.state.newsHistory];
            newsHistory.pop();
            const activePanelNews = newsHistory[newsHistory.length - 1];
            if (activePanelNews === 'news') {
                bridge.send('VKWebAppDisableSwipeBack');
            }
            this.setState({ newsHistory, activePanelNews });
    };

    goForwardNews = (activePanelNews) => {
        const newsHistory = [...this.state.newsHistory];
        newsHistory.push(activePanelNews);
        if (this.state.activePanelNews === 'news') {
            bridge.send('VKWebAppEnableSwipeBack');
        }
        this.setState({ newsHistory, activePanelNews });
    };

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
                this.openSnack('Ваш профиль отправлен на проверку. Не забудьте добавить фотографии в портфолио - так, шансы получить заказ намного выше.');
                this.sendMessage('Благодарим за регистрацию. Ваш профиль будет проходить модерацию в течении часа. Не забудьте добавить фотографии в портфолио в разделе Кабинет->Портфолио. Так же, при необходимости, в разделе Кабинет->Поиск модели - можно создать объявление о поиске модели для пополнения портфолио, либо акционных предложений.');
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
        this.props.changeActiveMasterOnMasters(master);
        this.setState({activePanelMasters: panelName});
    };

    openMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                this.props.changeActiveMasterOnFindModels(master);
                this.setState({activePanelFindModels: 'masterInfo'});
            });
    };
    openMasterOnLink = (masterId) => {
        this.setState({activeMasterId: masterId,activeStory: 'masters',activeViewMasters: 'mastersList',activePanelMasters: 'masterInfo'});
        console.log(masterId);
    };
    openFavMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                this.props.changeActiveMasterOnFavs(master);
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
                <ConfigProvider scheme={this.state.scheme}>
                    <View id="auth" activePanel="auth">
                        <Panel id="auth">
                            <Placeholder
                                stretched
                                icon={<Spinner size="large" style={{ marginTop: 40 }} />}
                                header="Выполняется вход..."
                            >Это может занять несколько секунд
                                {this.state.snackbar}
                            </Placeholder>
                        </Panel>
                    </View>
                </ConfigProvider>
            )
      } //if (this.state.validationParams === false) {
        //     return (
        //         <ConfigProvider scheme={this.state.scheme}>
        //             <View id="warn" activePanel="warn">
        //                 <Panel id="warn">
        //                     <Placeholder
        //                         icon={<Spinner size="large" style={{ marginTop: 40 }} />}
        //                     >
        //                         Все, беда. Кто-то лезет в параметры запуска :(
        //                     </Placeholder>
        //                 </Panel>
        //             </View>
        //         </ConfigProvider>
        //     )
        // }
        else {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                <Epic activeStory={this.state.activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'news'}
                            data-story="news"
                            text="Новости"
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
                    <View id="news" history={this.state.newsHistory} activePanel={this.state.activePanelNews} onSwipeBack={() => this.goBackNews()}>
                        <Panel id="news">
                            <PanelHeader>Новости</PanelHeader>
                            <News
                                params={this.props.params}
                                openReg={() => this.setState({activeViewLk: 'registration', activeStory: 'lk'})}
                                openStory={this.openStory}
                                user={this.props.user}
                                openModer={() => this.goForwardNews('moder')}
                            />
                        </Panel>
                        <Panel id="moder">
                            <Head
                                title={'Модерация'}
                                goBack={() => this.goBackNews()}
                            />
                            <Moder
                                goBack={() => this.goBackNews()}
                                user={this.state.user}
                                openMaster={(id) => {
                                    this.setState({moderId: id});
                                    this.goForwardNews('masterInfo');
                                }}
                            />
                        </Panel>
                        <Panel id="masterInfo">
                            <Head
                                title={'О мастере'}
                                goBack={() => this.goBackNews()}
                            />
                            <MasterCard
                                goBack={() => this.goBackNews()}
                                openPhoto={() => 'null'}
                                openComments={() => 'null'}
                                activeMasterId={this.state.moderId}
                                setActiveMaster={(master)=>this.setState({activeMaster: master})}
                            />
                        </Panel>
                    </View>
                    <Root
                        id="masters"
                        activeView={this.state.activeViewMasters}
                        // modal={
                        //     // <Modal
                        //     //     header={'Выбор города'}
                        //     //     activeModal={this.state.activeModal}
                        //     //     pageId={'cityList'}
                        //     //     onClose={()=>this.setActiveModal(null)}
                        //     //     content={<CityList changeCity={(city)=>this.changeTargetCity(city)}/>}
                        //     //     leftButton={false}
                        //     //     rightButton={false}
                        //     // />
                        // }
                    >
                        <View id="mastersList" activePanel={this.state.activePanelMasters}>
                            <Panel id="mastersList">
                                <Masters
                                    changeCity={()=>this.setState({activePanelMasters: 'changeCity'})}
                                    openSnack={(title)=>this.openSnack(title)}
                                    changeCategory={()=>this.setState({activeViewMasters: 'masterCat'})}
                                    //openPanelMaster={this.openPanelMaster}
                                    openPanelMaster={this.openPanelMaster}
                                />
                                {this.state.snackbar}
                            </Panel>
                            <Panel id='changeCity'>
                                <Head title={'Выбор города'}
                                      goBack={() => this.setState({activePanelMasters: 'mastersList'})}/>
                                <CityList changeCity={(city) => {
                                    this.changeTargetCity(city);
                                    this.setState({activePanelMasters: 'mastersList'})
                                }}/>
                            </Panel>
                            <Panel id="masterInfo">
                                <Head
                                    title={'О мастере'}
                                    goBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                />
                                <MasterCard
                                    goBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                    onSwipeBack={() => this.setState({activePanelMasters: 'mastersList'})}
                                    openPhoto={() => this.setState({activePanelMasters: 'masterPhoto'})}
                                    openComments={() => this.setState({activePanelMasters: 'masterComments'})}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMasterId={this.state.activeMasterId}
                                    //setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                />
                                <MasterPhoto
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title={'Отзывы'}
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                />
                                <MasterComments
                                    goBack={() => this.setState({activePanelMasters: 'masterInfo'})}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    //activeMaster={this.state.activeMaster}
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
                    >
                        <Panel id="findmodel">
                            <PanelHeader>Ишу модель</PanelHeader>
                            <FindModel
                                openMasterOnId={(masterId)=>this.openMasterOnId(masterId)}
                                changeCity={() => this.setState({activePanelFindModels: 'changeCity'})}
                            />
                        </Panel>
                        <Panel id='changeCity'>
                            <Head title={'Выбор города'}
                                  goBack={() => this.setState({activePanelFindModels: 'findmodel'})}/>
                            <CityList changeCity={(city) => {
                                this.setState({activePanelFindModels: 'findmodel'});
                                this.changeTargetCity(city);
                            }}/>
                        </Panel>
                        <Panel id="masterInfo">
                            <Head
                                title={'О мастере'}
                                goBack={() => this.setState({activePanelFindModels: 'findmodel'})}
                            />
                            <MasterCard
                                goBack={() => this.setState({activePanelFindModels: 'findmodel'})}
                                openPhoto={() => this.setState({activePanelFindModels: 'masterPhoto'})}
                                activeMaster={this.props.activeMasterOnFindModels}
                                openComments={() => this.setState({activePanelFindModels: 'masterComments'})}
                                //setActiveMaster={(master)=>this.setState({activeMaster: master})}
                            />
                        </Panel>
                        <Panel id="masterPhoto">
                            <Head
                                title={'Портфолио'}
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                            />
                            <MasterPhoto
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                                activeMaster={this.props.activeMasterOnFindModels}
                                //activeMaster={this.state.activeMaster}
                            />
                        </Panel>
                        <Panel id="masterComments">
                            <Head
                                title={'Отзывы'}
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                            />
                            <MasterComments
                                goBack={() => this.setState({activePanelFindModels: 'masterInfo'})}
                                activeMaster={this.props.activeMasterOnFindModels}
                                //activeMaster={this.state.activeMaster}
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
                                            openSetting={() => this.setActiveModal('setting')}
                                            openFavourite={() => this.setState({activePanelLk: 'favourite'})}
                                            openFindModel={() => this.setState({activePanelLk: 'findModel'})}
                                            openMasterPhoto={() => this.setState({activePanelLk: 'portfolio'})}
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
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
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
                                    goBack={() => this.setState({activePanelLk: 'favourite'})}
                                    openPhoto={() => this.setState({activePanelLk: 'masterPhoto'})}
                                    user={user}
                                    activeMaster={this.props.activeMasterOnFavs}
                                    openComments={() => this.setState({activePanelLk: 'masterComments'})}
                                    setActiveMaster={(master)=>this.setState({activeMaster: master})}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.setState({activePanelLk: 'masterInfo'})}
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
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
                                />
                                <Portfolio
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
                                    user={user}
                                />
                            </Panel>
                            <Panel id="masterComments">
                                <Head
                                    title={'Отзывы'}
                                    goBack={() => this.setState({activePanelLk: 'masterInfo'})}
                                />
                                <MasterComments
                                    goBack={() => this.setState({activePanelLk: 'masterInfo'})}
                                    user={user}
                                    activeMaster={this.props.activeMasterOnFavs}
                                    //activeMaster={this.state.activeMaster}
                                />
                            </Panel>
                            <Panel id='findModel'>
                                <Head
                                    title={'Ищу модель'}
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
                                />
                                <FindModelMaster
                                    goBack={() => this.setState({activePanelLk: 'lk'})}
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
                                    title={'Соглашение'}
                                    goBack={() => this.setState({activePanelReg: 'registration'})}
                                />
                                <Rules
                                    goBack={() => this.setState({activePanelReg: 'registration'})}
                                />
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
        activeMasterOnFavs: state.activeMasterOnFavs
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
        changeActiveMasterOnFavs: bindActionCreators(changeActiveMasterOnFavs, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(App);