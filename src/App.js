import React from 'react'
import {
    Avatar,
    Button,
    ConfigProvider,
    Epic,
    Group,
    Panel,
    PanelHeader,
    Placeholder,
    Root,
    Separator,
    Snackbar,
    Spinner,
    Tabbar,
    TabbarItem,
    Tabs,
    TabsItem,
    View
} from '@vkontakte/vkui'
import Icon28More from '@vkontakte/icons/dist/28/more.js'
import '@vkontakte/vkui/dist/vkui.css'
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline'
import Icon28ServicesOutline from '@vkontakte/icons/dist/28/services_outline'
import Icon16Done from '@vkontakte/icons/dist/16/done'
import Icon28Search from '@vkontakte/icons/dist/28/search'
import Head from './js/elements/panelHeader'
import MasterCard from './js/masters/mastersCard.js'
import MasterPhoto from './js/masters/mastersPhoto.js'
import MasterComments from './js/masters/mastersComments.js'
import News from './js/news/news.js'
import Invite from './js/lk/invite.js'
import Lk from './js/lk/lk.js'
import History from './js/lk/history.js'
import Portfolio from './js/lk/portfolio.js'
import Setting from './js/lk/setting.js'
import Favourite from './js/lk/favourite.js'
import FindModel from "./js/findmodel/findModel"
import FindModelMaster from "./js/lk/findModelMaster"
import Partners from "./js/lk/partners"
import {BACKEND} from "./js/func/func"
import CityList from './js/elements/cityList'
import Moder from "./js/news/moder"
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss'
import bridge from '@vkontakte/vk-bridge'
import Masters from './js/masters/masters'
import CategoriesList from './js/elements/categoriesList'
import Rules from './js/lk/rules'
import {connect} from "react-redux"
import {
    changeActiveMasterOnFavs,
    changeActiveMasterOnFindModels,
    changeActiveMasterOnMasters,
    changeActiveViewLk,
    changeFindModelsList,
    changeFindModelsListScroll,
    changeLaunchParams,
    changeMastersList,
    changeMasterslistScroll,
    changeStory,
    changeTargetCategory,
    changeTargetCity,
    goForward,
    goTo,
    loginUser,
    setMaster
} from "./js/store/actions"
import {bindActionCreators} from "redux"
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            popoutLk: null,
            popoutInvite: null,
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
            warnConnection: false,
            mastersModal: null,
            findModal: null,
            lkModal: null,
            snackbarInvite: null
        }
        this.onStoryChange = this.onStoryChange.bind(this)
    }

    componentDidMount() {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                this.setState({scheme: data.scheme})
                if (data.scheme === 'space_gray') bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light"})
                if (data.scheme === 'bright_light') bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark"})
            }
        })
        if (this.props.launchParams.sign !== undefined) {
            this.setState({validLaunchParams: true})
            console.log('Параметры пришли')
            this.props.changeLaunchParams(this.props.launchParams)
            this.auth(this.props.launchParams)
        } else {
            this.setState({validLaunchParams: false})
            this.openSnack('Ошибка. Не переданы параметры запуска.')
        }

        if (this.props.linkParams.masterid) {
            this.openMasterOnId(this.props.linkParams.masterid)
            this.props.changeStory('masters')
        }
        if (this.props.linkParams.history) {
            this.goTo('lk', 'history')
        }
        window.onpopstate = () => {
            this.goBack(this.props.activeStory)
        }
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
            .then(data => {
                if (this.state.warnConnection === true) {
                    this.setState({warnConnection: false, snackbar: null})
                }
                this.setState({validLaunchParams: true})
                this.props.loginUser(data.user)
                if (data.master !== null) {
                    this.props.setMaster(data.master)
                }
            })
            .catch(e => {
                console.log(e)
                this.setState({
                    snackbar:
                        <Snackbar
                            duration="3000"
                            layout="vertical"
                            onClose={() => this.setState({snackbar: null})}
                            before={<Icon24Dismiss/>}
                        >
                            Ошибка подключения к серверу. Страшно, очень страшно, мы не знаем что это такое, если бы мы
                            знали что это такое, то мы бы знали, что это такое.
                        </Snackbar>
                })
                this.setState({warnConnection: true})
            })
    };

    openSnack(text) {
        const blueBackground = {
            backgroundColor: 'var(--accent)'
        }
        if (this.state.snackbar) this.setState({snackbar: null})
        this.setState({
            snackbar:
                <Snackbar
                    duration="3000"
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14}
                                                                                 height={14}/></Avatar>}
                >
                    {text}
                </Snackbar>
        })
    }

    openSnackInvite(text) {
        if (this.state.snackbarInvite) this.setState({snackbarInvite: null})
        this.setState({
            snackbarInvite:
                <Snackbar
                    duration="3000"
                    layout="vertical"
                    onClose={() => this.setState({snackbarInvite: null})}
                    before={<Icon24Dismiss/>}
                >
                    {text}
                </Snackbar>
        })
    }

    openMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                if (master.error) master = null
                this.props.changeActiveMasterOnMasters(master)
                this.goTo('masters', 'masterInfo')
            })
    };

    openFindMasterOnId = (masterId) => {
        fetch(BACKEND.masters.onID + masterId)
            .then(res => res.json())
            .then(master => {
                this.props.changeActiveMasterOnFindModels(master)
                this.goTo('findmodel', 'masterInfo')
            })
    };

    openSnackLk(text) {
        const blueBackground = {
            backgroundColor: 'var(--accent)'
        }
        if (this.state.snackbarLk) this.setState({snackbarLk: null})
        this.setState({
            snackbarLk:
                <Snackbar
                    duration="3000"
                    layout="vertical"
                    onClose={() => this.setState({snackbarLk: null})}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14}
                                                                                 height={14}/></Avatar>}
                >
                    {text}
                </Snackbar>
        })
    }

    openSnackLkDismiss(text) {
        if (this.state.snackbarLk) this.setState({snackbarLk: null})
        this.setState({
            snackbarLk:
                <Snackbar
                    duration="3000"
                    layout="vertical"
                    onClose={() => this.setState({snackbarLk: null})}
                    before={<Icon24Dismiss/>}
                >
                    {text}
                </Snackbar>
        })
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
                if (newMaster.error) {
                    this.openSnack(newMaster.error)
                } else {
                    this.props.setMaster(newMaster)
                    this.goTo('lk', 'lk')
                }
            })
            .catch(e => {
                console.log(e)
                //this.openSnack(e.message)
            })
    };

    goTo = (story, panel) => {
        window.history.pushState({panel: panel}, panel)
        this.props.goTo(story, panel)
        let hist = this.props[story + 'History']
    };

    goBack = (story) => {
        if (this.props[story + 'History'].length === 1) {
            bridge.send('VKWebAppClose', {'status': 'sucsess'})
        } else {
            this.props.goForward(story)
            let hist = this.props[story + 'History']
        }
    };

    activePanelMasters = (name) => {
        this.setState({activePanelMasters: name})
    };

    openStory = (storyName) => {
        this.setState({activeStory: storyName})
    };

    onStoryChange(e) {
        this.setState({activeStory: e.currentTarget.dataset.story})
    }

    changeTargetCity(geo) {
        let user = this.props.user
        user.location.city = geo.city
        user.location.country = geo.country
        this.props.changeTargetCity(geo.city)
        user.params = this.props.params
        return fetch(BACKEND.users.changeCity, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(user),
        })
            .then(res => res.json())
            .then(res => {
                console.log('ok')
            })
            .catch(e => console.log(e))
    }

    render() {
        const {user, loginStatus} = this.props
        if (this.state.warnConnection === true) {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <View id="loading" activePanel="loading">
                        <Panel id="loading">
                            <Placeholder
                                stretched
                                icon={<Icon56WifiOutline/>}
                                header={'Что-то не так!'}
                                action={<Button size="l" onClick={() => this.auth(this.props.launchParams)}>Повторить
                                    авторизацию</Button>}
                            >
                                Проверьте интернет-соединение.
                            </Placeholder>
                            {this.state.snackbar}
                        </Panel>
                    </View>
                </ConfigProvider>
            )
        } else if (this.state.validLaunchParams === false) {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <View id="warn" activePanel="warn">
                        <Panel id="warn">
                            <Placeholder
                                icon={<Spinner size="large" style={{marginTop: 40}}/>}
                            >
                                Всё, беда! Вы все сломали :(
                            </Placeholder>
                            {this.state.snackbar}
                        </Panel>
                    </View>
                </ConfigProvider>
            )
        } else if (loginStatus === false) {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <View id="loading" activePanel="loading">
                        <Panel id="loading">
                            <Placeholder
                                stretched
                                icon={<Spinner size="large" style={{marginTop: 40}}/>}
                                header="Выполняется вход..."
                            >Это может занять несколько секунд
                                {this.state.snackbar}
                            </Placeholder>
                        </Panel>
                    </View>
                </ConfigProvider>
            )
        } else {
            return (
                <ConfigProvider scheme={this.state.scheme}>
                    <Epic activeStory={this.props.activeStory} tabbar={
                        <Tabbar>
                            <TabbarItem
                                onClick={() => {
                                    if (this.props.activeStory === 'news') {
                                        this.goTo('news', 'news')
                                    } else {
                                        this.props.changeStory('news')
                                    }
                                }}
                                selected={this.props.activeStory === 'news'}
                                data-story="news"
                                text="Новости"
                            ><Icon28FireOutline/></TabbarItem>
                            <TabbarItem
                                onClick={() => {
                                    if (this.props.activeStory === 'masters') {
                                        this.goTo('masters', 'mastersList')
                                    } else {
                                        this.props.changeStory('masters')
                                    }
                                }}
                                selected={this.props.activeStory === 'masters'}
                                data-story="masters"
                                text="Мастера"
                            ><Icon28ServicesOutline/></TabbarItem>
                            <TabbarItem
                                onClick={() => {
                                    if (this.props.activeStory === 'findmodel') {
                                        this.goTo('findmodel', 'findmodel')
                                    } else {
                                        this.props.changeStory('findmodel')
                                    }
                                }}
                                selected={this.props.activeStory === 'findmodel'}
                                data-story="findmodel"
                                text="Ищу модель"
                            ><Icon28Search/></TabbarItem>
                            <TabbarItem
                                onClick={() => {
                                    this.setState({snackbarLk: null})
                                    if (this.props.activeStory === 'lk') {
                                        this.goTo('lk', 'lk')
                                    } else {
                                        this.props.changeStory('lk')
                                    }
                                }}
                                selected={this.props.activeStory === 'lk'}
                                data-story="lk"
                                text="Кабинет"
                            ><Icon28More/></TabbarItem>
                        </Tabbar>
                    }>
                        <View id="news" history={this.props.newsHistory} onSwipeBack={() => this.goBack('news')}
                              activePanel={this.props.newsHistory[this.props.newsHistory.length - 1]}>
                            <News
                                id="news"
                                params={this.props.params}
                                openReg={() => {
                                    this.props.changeStory('lk')
                                    this.goTo('lk', 'registration')
                                }}
                                openStory={this.openStory}
                                user={this.props.user}
                                openModer={() => this.goTo('news', 'moder')}
                            />
                            <Moder
                                id="moder"
                                goBack={() => this.goBack('news')}
                                user={this.state.user}
                                openMaster={(master) => {
                                    this.setState({activeMaster: master})
                                    this.goTo('news', 'masterInfo')
                                }}
                            />
                            <Panel id="masterInfo">
                                <MasterCard
                                    goBack={() => this.goBack('news')}
                                    openPhoto={() => 'null'}
                                    openComments={() => 'null'}
                                    activeMaster={this.state.activeMaster}
                                    setActiveMaster={(master) => this.setState({activeMaster: master})}
                                    openModal={(content) => {this.setState({mastersModal: content})}}
                                />
                            </Panel>
                        </View>
                        <View id="masters" modal={this.state.mastersModal}
                              activePanel={this.props.mastersHistory[this.props.mastersHistory.length - 1]}
                              history={this.props.mastersHistory} onSwipeBack={() => this.goBack('masters')}>
                            <Masters
                                id="mastersList"
                                changeCity={() => this.goTo('masters', 'changeCity')}
                                openSnack={(title) => this.openSnack(title)}
                                changeCategory={() => this.goTo('masters', 'masterCat')}
                                openPanelMaster={(master) => {
                                    this.props.changeActiveMasterOnMasters(master)
                                    this.goTo('masters', 'masterInfo')
                                }}
                                snackbar={this.state.snackbar}
                            />
                            <Panel id="changeCity">
                                <Head title={'Выбор города'}
                                      goBack={() => this.goBack('masters')}/>
                                <CityList
                                    id="changeCity"
                                    goBack={() => this.goBack('masters')}
                                    changeCity={(city) => {
                                        this.changeTargetCity(city)
                                        this.goBack('masters')
                                    }}
                                />
                            </Panel>
                            <Panel id="masterInfo">
                                <MasterCard
                                    id="masterInfo"
                                    goBack={() => this.goBack('masters')}
                                    openPhoto={() => this.goTo('masters', 'masterPhoto')}
                                    openComments={() => this.goTo('masters', 'masterComments')}
                                    activeMaster={this.props.activeMasterOnMasters}
                                    openModal={(content) => {
                                        this.setState({mastersModal: content})
                                    }}
                                />
                            </Panel>
                            <Panel id="masterPhoto">
                                <Head
                                    title={'Портфолио'}
                                    goBack={() => this.goBack('masters')}
                                />
                                <MasterPhoto
                                    goBack={() => this.goBack('masters')}
                                    activeMaster={this.props.activeMasterOnMasters}
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
                                />
                            </Panel>
                            <Panel id="masterCat">
                                <Head
                                    title={'Выбор категории'}
                                    goBack={() => this.goBack('masters')}
                                />
                                <Group>
                                    <CategoriesList
                                        scheme={this.state.scheme}
                                        setCategory={(category) => {
                                            this.props.changeTargetCategory(category)
                                            this.goBack('masters')
                                        }}
                                    />
                                </Group>
                            </Panel>
                        </View>
                        <View
                            id="findmodel"
                            activePanel={this.props.findmodelHistory[this.props.findmodelHistory.length - 1]}
                            history={this.props.findmodelHistory} onSwipeBack={() => this.goBack('findmodel')}
                            modal={this.state.findModal}
                        >
                            <Panel id="findmodel">
                                <PanelHeader>Ищу модель</PanelHeader>
                                <FindModel
                                    openMasterOnId={(masterId) => this.openFindMasterOnId(masterId)}
                                    changeCity={() => this.goTo('findmodel', 'changeCity')}
                                />
                            </Panel>
                            <Panel id="changeCity">
                                <Head title={'Выбор города'}
                                      goBack={() => this.goBack('findmodel')}/>
                                <CityList
                                    id="changeCity"
                                    goBack={() => this.goBack('findmodel')}
                                    changeCity={(city) => {
                                        this.changeTargetCity(city)
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
                                    openModal={(content) => {
                                        this.setState({findModal: content})
                                    }}
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
                                />
                            </Panel>
                        </View>
                        <Root id="lk" activeView={this.props.activeViewLk} modal={this.state.lkModal}>
                            <View id="lk" popout={this.state.popoutLk}
                                  activePanel={this.props.lkHistory[this.props.lkHistory.length - 1]}
                                  history={this.props.lkHistory} onSwipeBack={() => this.goBack('lk')}>
                                <Panel id="lk">
                                    <PanelHeader separator={false}>Кабинет</PanelHeader>
                                    <Tabs>
                                        <TabsItem
                                            onClick={() => this.setState({activeTabLk: 'about'})}
                                            selected={this.state.activeTabLk === 'about'}
                                        >
                                            О пользователе
                                        </TabsItem>
                                        <TabsItem
                                            onClick={() => this.setState({activeTabLk: 'partners'})}
                                            selected={this.state.activeTabLk === 'partners'}
                                        >
                                            Партнёрам
                                        </TabsItem>
                                    </Tabs>
                                    <Separator/>
                                    {
                                        this.state.activeTabLk === 'about' ?
                                            <Lk
                                                master={this.props.master}
                                                user={user}
                                                openSetting={() => this.goTo('lk', 'setting')}
                                                openFavourite={() => this.goTo('lk', 'favourite')}
                                                openFindModel={() => this.goTo('lk', 'findModel')}
                                                openMasterPhoto={() => this.goTo('lk', 'portfolio')}
                                                openHistory={() => this.goTo('lk', 'history')}
                                                isFavourite={this.props.params.vk_is_favorite}
                                            /> :
                                            <Partners/>
                                    }
                                    {this.state.snackbarLk}
                                </Panel>
                                <Panel id="setting">
                                    <Setting
                                        setAlert={(alert) => this.setState({popoutLk: alert})}
                                        snackbar={(message) => this.openSnackLk(message)}
                                        snackbarDismiss={(message) => this.openSnackLkDismiss(message)}
                                        modalBack={this.modalBack}
                                        activeModal={this.state.activeModal}
                                        changeCity={() => this.goTo('lk', 'changeCity')}
                                        goBack={() => this.goBack('lk')}
                                        snackbarLk={this.state.snackbarLk}
                                    />
                                </Panel>
                                <Panel id="changeCity">
                                    <Head title={'Выбор города'}
                                          goBack={() => this.goBack('lk')}/>
                                    <CityList
                                        id="changeCity"
                                        goBack={() => this.goBack('lk')}
                                        changeCity={(geo) => {
                                            let master = this.props.master
                                            master.location.city = geo.city
                                            master.location.country = geo.country
                                            master.changed = true
                                            this.props.setMaster(master)
                                            this.goBack('lk')
                                        }}
                                    />
                                </Panel>
                                <Panel id="favourite">
                                    <Favourite
                                        goBack={() => this.goBack('lk')}
                                        user={user}
                                        openFavMasterOnId={(master) => {
                                            this.props.changeActiveMasterOnFavs(master)
                                            this.goTo('lk', 'masterInfo')
                                        }}
                                    />
                                </Panel>
                                <Panel id="history">
                                    <History
                                        goBack={() => this.goBack('lk')}
                                        user={user}
                                    />
                                </Panel>
                                <Panel id="masterInfo">
                                    <MasterCard
                                        goBack={() => this.goBack('lk')}
                                        openPhoto={() => this.goTo('lk', 'masterPhoto')}
                                        user={user}
                                        activeMaster={this.props.activeMasterOnFavs}
                                        openComments={() => this.goTo('lk', 'masterComments')}
                                        setActiveMaster={(master) => this.setState({activeMaster: master})}
                                        openModal={(content) => {
                                            this.setState({lkModal: content})
                                        }}
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
                                    />
                                </Panel>
                                <Panel id="portfolio">
                                    <Portfolio
                                        id="portfolio"
                                        setAlert={(alert) => this.setState({popoutLk: alert})}
                                        goBack={() => this.goBack('lk')}
                                        user={user}
                                    />
                                </Panel>
                                <Panel id="masterComments">
                                    <Head
                                        title="Отзывы"
                                        goBack={() => this.goBack('lk')}
                                    />
                                    <MasterComments
                                        goBack={() => this.goBack('lk')}
                                        user={user}
                                        activeMaster={this.props.activeMasterOnFavs}
                                    />
                                </Panel>
                                <Panel id="findModel">
                                    <Head
                                        title="Ищу модель"
                                        goBack={() => this.goBack('lk')}
                                    />
                                    <FindModelMaster
                                        goBack={() => this.goBack('lk')}
                                        user={user} popout={this.openAlert}
                                    />
                                </Panel>

                                {/*reg*/}
                                <Panel id="registration">
                                    <Head
                                        title={'Регистрация'}
                                        goBack={() => {
                                            this.goBack('lk')
                                        }}
                                    />
                                    <Invite
                                        setAlert={(alert) => this.setState({popoutLk: alert})}
                                        goBack={() => this.props.changeActiveViewLk('lk')}
                                        closeReg={this.closeReg}
                                        changeCity={() => this.goTo('lk', 'changeCityReg')}
                                        openRules={() => this.goTo('lk', 'rules')}
                                        snackbar={(message) => this.openSnackInvite(message)}
                                    />
                                    {this.state.snackbarInvite}
                                </Panel>
                                <Panel id="rules">
                                    <Head
                                        title="Соглашение"
                                        goBack={() => this.goBack('lk')}
                                    />
                                    <Rules
                                        goBack={() => this.goBack('lk')}
                                    />
                                </Panel>
                                <Panel id="changeCityReg">
                                    <Head title={'Выбор города'}
                                          goBack={() => this.goBack('lk')}/>
                                    <CityList
                                        id="changeCityReg"
                                        goBack={() => this.goBack('lk')}
                                        changeCity={(city) => {
                                            this.changeTargetCity(city)
                                            this.goBack('lk')
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
        lkHistory: state.lkHistory,
        activeViewLk: state.activeViewLk,
        activePanelregistration: state.activePanelregistration,
        registrationHistory: state.registrationHistory
    }
}

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
        goForward: bindActionCreators(goForward, dispatch),
        changeActiveViewLk: bindActionCreators(changeActiveViewLk, dispatch)

    }
}

export default connect(putStateToProps, putActionsToProps)(App)