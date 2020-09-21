import React from 'react'
import {
    Group,
    Cell,
    Separator,
    Div,
    Avatar,
    Snackbar,
    Spinner,
    Header,
    Card,
    CardGrid,
    CardScroll,
    Button,
    FormLayout,
    RichCell,
    CellButton,
    Placeholder,
    Panel,
    ModalCard, ModalRoot, Caption
} from "@vkontakte/vkui"
import InputMask from 'react-input-mask'
import Icon16Like from '@vkontakte/icons/dist/16/like'
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline'
import {BACKEND} from '../func/func'
import bridge from "@vkontakte/vk-bridge"
import {postData} from "../elements/functions"
import {connect} from "react-redux"
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline'
import Icon24Phone from '@vkontakte/icons/dist/24/phone'
import Head from "../elements/panelHeader"
import {bindActionCreators} from "redux"
import {loginUser, changeMastersList, changeActiveMasterOnFindModels} from "../store/actions"
import Icon56AccessibilityOutline from '@vkontakte/icons/dist/56/accessibility_outline'
import Icon16Down from '@vkontakte/icons/dist/16/down'
import Icon16Up from '@vkontakte/icons/dist/16/up'

class MastersCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoad: false,
            snackbar: null,
            isChange: false,
            activeMaster: {},
            phone: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }


    componentDidMount() {
        window.scrollTo(0, 0)
        this.setState({activeMaster: this.props.activeMaster}, () => {
            if (this.props.activeMaster !== null) {
                this.loadFavs()
            }
        })
    }

    componentWillUnmount() {
        this.props.openModal(null)
        if (this.state.isChange) { //если были изменения пишем в бд при разрушении ДОМ дерева
            let mastersList = this.props.mastersList
            let newMastersList = mastersList.map(master => {
                if (master._id === this.state.activeMaster._id) {
                    if (master.subscribers.includes(this.props.user._id)) {
                        master.subscribers = master.subscribers.filter(item => item !== this.props.user._id)
                    } else {
                        master.subscribers.push(this.props.user._id)
                    }
                    return master
                } else {
                    return master
                }
            })
            this.props.changeMastersList(newMastersList)
            if (this.props.activeMasterOnFindModels._id === this.state.activeMaster._id) {
                let master = this.props.activeMasterOnFindModels
                if (master.subscribers.includes(this.props.user._id)) {
                    master.subscribers = master.subscribers.filter(item => item !== this.props.user._id)
                } else {
                    master.subscribers.push(this.props.user._id)
                }
                this.props.changeActiveMasterOnFindModels(master)
            }
            postData(BACKEND.users.like + this.state.activeMaster._id, this.props.params)
        }
    }

    handleChange = (event) => {

        this.setState({[event.target.name]: event.target.value})
    };

    changeNumber = (event) => {

        this.setState({[event.target.name]: event.target.value}, this.openModal)
    };

    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log(data))
    }

    sendMessage = () => {
        let data = {
            params: this.props.params,
            title: this.state.sendtitle,
            phone: this.state.phone
        }
        fetch(BACKEND.masters.connect + this.state.activeMaster._id, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    this.props.openModal(null)
                    this.openSnackAvatar(res.error, this.state.activeMaster.avatarLink)
                } else {
                    this.props.openModal(null)
                    this.openSnackAvatar('Мы уведомили мастера, что вы хотите с ним связаться. Ожидайте.', this.state.activeMaster.avatarLink)
                }
            })
            .catch(e => {
                this.props.openModal(null)
                this.openSnackAvatar(e.message, this.state.activeMaster.avatarLink)
            })
    };

    favStatus = () => {
        if (this.state.isFavourite === false) {
            return (
                <Div style={{float: 'right', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                    <Icon16LikeOutline width={30} height={30} fill="red"/>
                </Div>
            )
        } else {
            return (
                <Div style={{float: 'right', padding: 0, marginRight: 20}} onClick={this.checkFavs}>
                    <Icon16Like width={30} height={30} fill="red"/>
                </Div>
            )
        }
    };
    connectStatus = (title) => {
        return (
            <CellButton
                before={<Icon24Phone/>}
                onClick={() => this.enterNumber(title)}
            >Записаться
            </CellButton>
        )
    };
    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938#masterid=' + this.state.activeMaster._id})
            .then(result => {
                if (result.type === 'VKWebAppShareResult') {
                    this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink)
                }
            })
    };

    openSnackAvatar(text, avatarLink) {
        if (this.state.snackbar) this.setState({snackbar: null})
        this.setState({
            snackbar:
                <Snackbar
                    duration="3000"
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                    after={<Avatar src={avatarLink} size={32}/>}
                >
                    {text}
                </Snackbar>
        })
    }

    loadFavs = () => {
        if (this.props.user.favs) {
            if (this.props.user.favs.includes(this.state.activeMaster._id)) {
                this.setState({isFavourite: true})
            } else {
                this.setState({isFavourite: false})
            }
        }
        this.setState({countFavs: this.state.activeMaster.subscribers.length, isLoad: true})
    };
    changeVisible = (index) => {
        this.setState({[index]: !this.state[index]})
    };
    checkFavs = () => {
        if (this.state.isFavourite === false) {
            let user = this.props.user
            user.favs.push(this.state.activeMaster._id)
            this.props.loginUser(user)
            this.setState({
                isFavourite: true,
                countFavs: this.state.countFavs + 1,
                isChange: !this.state.isChange
            }, () =>
                this.openSnackAvatar('Мастер добавлен в список избранных.', this.state.activeMaster.avatarLink))
        } else {
            let user = this.props.user
            let index = this.props.user.favs.indexOf(this.state.activeMaster._id)
            let favs = this.props.user.favs
            if (index > -1) {
                favs.splice(index, 1)
            } else favs.splice(0, index)
            this.props.loginUser(user)
            this.setState({
                isFavourite: false,
                countFavs: this.state.countFavs - 1,
                isChange: !this.state.isChange
            }, () =>
                this.openSnackAvatar('Мастер удален из списка избранных.', this.state.activeMaster.avatarLink))
        }

    };

    getPhone = () => {
        console.log('Запрашиваю номер')
        bridge.send("VKWebAppGetPhoneNumber", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
            .then(result => {
                this.setState({phone: result.phone_number}, () => this.openModal())
            })
            .catch(e => {
                console.log(e)
                this.openModal()
            })
    };

    enterNumber = async (title) => {
        this.setState({sendtitle: title})
        this.openModal()
    };

    openModal = () => {
        console.log('Открываю модалку')
        this.props.openModal(
            <ModalRoot
                activeModal={'phoneNumber'}
                onClose={() => this.props.openModal(null)}
            >
                <ModalCard
                    id={'phoneNumber'}
                    onClose={() => this.props.openModal(null)}
                    header="Укажите номер телефона"
                    caption={
                        <FormLayout>
                            <Div className="FormField Input Input--center">
                                <InputMask
                                    className="Input__el"
                                    //mask="7 (999) 999-99-99"
                                    name="phone"
                                    type="number"
                                    //defaultValue={number || ''}
                                    align="center"
                                    value={this.state.phone}
                                    onChange={this.changeNumber}
                                    novalidate
                                />
                                <Div className="FormField__border"></Div>
                            </Div>
                            {
                                this.state.phone === '' &&
                                <CellButton onClick={() => {
                                    this.getPhone()
                                }}>Запросить номер</CellButton>
                            }
                            <p>Укажите номер телефона, начиная с 7 (в формате 7ХХХХХХХХХХ). Если мастер не сможет
                                ответить прямо сейчас, он свяжется с вами.</p>
                            <Button onClick={this.sendMessage}>Отправить</Button>
                        </FormLayout>
                    }
                >

                </ModalCard>
            </ModalRoot>
        )
    }

    postData(url = '', data = {}, method) {
        return fetch(url, {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(response => console.log('ok'))
    }

    render() {
        if (this.props.activeMaster === null) {
            return (
                <Panel id="masterInfo">
                    <Head
                        title={'О мастере'}
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        icon={<Icon56AccessibilityOutline/>}
                        header="Мы не знаем таких мастеров."
                    >
                        Мастер с таким идентификатором не найден.
                    </Placeholder>
                </Panel>
            )
        } else if (this.props.activeMaster.error) {
            return (
                <Panel id="masterInfo">
                    <Head
                        title={'О мастере'}
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        icon={<Icon56AccessibilityOutline/>}
                        header="Тут никого нет :)"
                    >
                        Мастер с таким идентификатором не найден.
                    </Placeholder>
                </Panel>
            )
        }
        if (this.state.isLoad === false) {
            return (
                <Spinner size="large" style={{marginTop: 20}}/>
            )
        }
        if (this.state.activeMaster.visible === false) {
            return (
                <Panel id="masterInfo">
                    <Head
                        title={'О мастере'}
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        icon={<Icon56AccessibilityOutline/>}
                        header="Тут никого нет :)"
                    >
                        Мастер предпочел скрыть свой профиль.
                    </Placeholder>
                </Panel>
            )
        } else {
            return (
                <Panel id="masterInfo">
                    <Head
                        title={'О мастере'}
                        goBack={() => this.props.goBack()}
                    />
                    <React.Fragment>
                        <Group separator={'hide'}>
                            <CardGrid>
                                <Card size="l">
                                    <RichCell
                                        disabled
                                        multiline
                                        before={<Avatar src={this.state.activeMaster.avatarLink} size={90}/>}
                                        text={
                                            <Caption level="2" weight="regular" style={{marginBottom: 15}}>
                                                {this.state.activeMaster.type === 'Организация' ? this.state.activeMaster.brand : this.state.activeMaster.type}
                                            </Caption>
                                        }
                                        caption={
                                            <React.Fragment>
                                                <Button onClick={() => this.share()}>Поделиться</Button>
                                                {
                                                    this.props.user.vkUid === this.state.activeMaster.vkUid
                                                        ?
                                                        null
                                                        :
                                                        this.favStatus()
                                                }
                                            </React.Fragment>
                                        }
                                    >
                                        {this.state.activeMaster.firstname} {this.state.activeMaster.lastname}
                                    </RichCell>
                                </Card>
                            </CardGrid>
                        </Group>
                        <Group>
                            <Cell
                                expandable
                                onClick={() => this.props.openComments()}
                                indicator={this.state.activeMaster.meta.comments || 0}
                                description={'Подписчиков: ' + this.state.countFavs}
                            >
                                Отзывы
                            </Cell>
                        </Group>
                        <Group title="Портфолио">
                            {
                                this.state.activeMaster.photos.length > 0 ?
                                    <Group header={<Header mode="secondary">Выполненые работы мастера</Header>}>
                                        <CardScroll>
                                            {
                                                this.state.activeMaster.photos.map((photoUrl, index) => {
                                                    return (
                                                        <Card
                                                            style={{padding: 2, borderRadius: 13, margin: 0}}
                                                            size="s"
                                                            mode="shadow"
                                                            key={index}
                                                            onClick={() => this.openShowImages(this.state.activeMaster.photos, index)}
                                                        >
                                                            <div style={{
                                                                width: 144,
                                                                height: 96,
                                                                backgroundImage: 'url(' + photoUrl + ')',
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center 35%',
                                                                backgroundRepeat: 'no-repeat',
                                                                borderRadius: 13
                                                            }}/>
                                                        </Card>
                                                    )
                                                })
                                            }
                                        </CardScroll>
                                        <Cell
                                            expandable
                                            onClick={() => this.props.openPhoto()}
                                            description={this.state.activeMaster.photos.length + ' фото в портфолио'}
                                            indicator={this.state.activeMaster.photos.length}
                                        >Посмотреть сеткой</Cell>
                                    </Group> :
                                    <Placeholder
                                        icon={<Icon56GalleryOutline/>}
                                        header="Нет фотографий"
                                    />
                            }
                        </Group>
                        <Group separator="hide" header={<Header mode="secondary">Запись к мастеру</Header>}
                               description={'Выберите необходимую процедуру и нажмите на кнопку записи к мастеру. Мастер свяжется с Вами.'}>
                            {
                                this.state.activeMaster.priceList.map((item, index) => (
                                        <CardGrid key={index}>
                                            <Card size="l" onClick={() => this.changeVisible(index)}>
                                                <Cell
                                                    description={
                                                        item.price !== '' ? 'От ' + item.price + " руб." : 'Стоимость не указана'
                                                    }
                                                    asideContent={this.state[index] ? <Icon16Up/> : <Icon16Down/>}
                                                    indicator=""
                                                >
                                                    {this.state.activeMaster.priceList[index].title}
                                                </Cell>
                                                {
                                                    this.state[index] &&
                                                    <React.Fragment>
                                                        <Cell description="Краткое описание процедуры"
                                                              multiline>{this.state.activeMaster.priceList[index].body}
                                                        </Cell>
                                                        {this.connectStatus(this.state.activeMaster.priceList[index].title)}
                                                    </React.Fragment>
                                                }
                                                <Separator/>
                                            </Card>
                                        </CardGrid>
                                        // </Cell>
                                    )
                                )}
                        </Group>
                        <Group separator="hide" header={<Header mode="secondary">Информация о мастере</Header>}>
                            <Cell multiline>
                                {this.state.activeMaster.description}
                            </Cell>
                        </Group>
                        {this.state.snackbar}
                    </React.Fragment>
                </Panel>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        params: state.params,
        mastersList: state.mastersList,
        activeMasterOnFindModels: state.activeMasterOnFindModels
    }
}

const putActionsToProps = (dispatch) => {
    return {
        loginUser: bindActionCreators(loginUser, dispatch),
        changeMastersList: bindActionCreators(changeMastersList, dispatch),
        changeActiveMasterOnFindModels: bindActionCreators(changeActiveMasterOnFindModels, dispatch)
    }
}

export default connect(putStateToProps, putActionsToProps)(MastersCard)