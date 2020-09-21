import React from 'react'
import {
    Group,
    Div,
    Avatar,
    Cell,
    FormLayout,
    Textarea,
    Switch,
    FormLayoutGroup,
    Button,
    CellButton,
    Input,
    CardGrid,
    Card,
    List,
    Alert,
    platform, withModalRootContext, Snackbar, Placeholder, Spinner, Select, RichCell, Separator, Banner, Header
} from "@vkontakte/vkui"
import '@vkontakte/vkui/dist/vkui.css'
import {BACKEND} from '../func/func'
import Icon24Add from '@vkontakte/icons/dist/24/add'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {setMaster} from "../store/actions"
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss'
import Head from "../elements/panelHeader"
import Icon16Down from '@vkontakte/icons/dist/16/down'
import Icon16Up from '@vkontakte/icons/dist/16/up'
import HeadCity from "../elements/headCity"
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline'

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            about: 'non info',
            tooltip: true,
            popout: null,
            vkuid: '',
            count: {
                manicureStatus: 0,
                pedicureStatus: 0,
                eyelashesStatus: 0,
                eyebrowsStatus: 0,
                shugaringStatus: 0,
                hairStatus: 0,
                cosmeticStatus: 0
            },
            category: [],
            isLoad: false,
            isMaster: false,
            snackbar: null,
            newProdTitle: '',
            newProdBody: '',
            newProdPrice: '',
            editProdTitle: '',
            editProdBody: '',
            editProdPrice: '',
            isChange: false,
            type: 'Частный мастер',
            brand: ''
        }
    }

    componentDidMount() {
        if (this.props.user.isMaster === true) {
            if (this.props.master.brand !== null) this.setState({brand: this.props.master.brand})
            this.setState({
                master: this.props.master,
                description: this.props.master.description,
                type: this.props.master.type
            })
            fetch(BACKEND.category.getAll)
                .then(res => res.json())
                .then(categories => {
                    this.setState({categories: categories})
                    categories.map(category => {
                        this.setState({[category._id]: false})
                    })
                    this.setActive(this.props.master.categories.subcat)
                })
                .catch(e => {
                    this.setState({warnConnection: true})
                })
            if (this.props.master.changed) this.setState({isChange: true})
        }
    }

    componentWillUnmount() {
        this.saveChanges()
        this.props.setAlert(null)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.targetCity !== this.props.targetCity) {
            let master = this.state.master
            master.location.city = this.props.targetCity
            this.setState({master: master})
        }
    }

    saveChanges = () => {
        try {
            if (this.state.type === 'Частный мастер') this.setState({brand: ''})
            if (this.state.description.replace(/ +/g, ' ').trim().length < 20) throw 'Блок "О себе" должен содержать более 20 символов.'
            if (this.state.description.replace(/ +/g, ' ').trim().length > 200) throw 'Блок "О себе" должен содержать не более 200 символов.'
            if (this.state.master.priceList.length < 1) throw 'Добавьте как минимум одну процедуру, чтобы клиенты смогли записаться к Вам.'
            if (this.state.brand !== "") {
                if (this.state.brand.length > 25) throw 'Длина названия организации ограничена 25 символами.'
            }
            if (this.state.isChange === true) {
                let master = this.state.master
                master.type = this.state.type
                master.brand = this.state.brand
                master.params = this.props.params
                this.patchData(BACKEND.masters.all + this.state.master._id, master)
                this.props.setMaster(this.state.master)
            }
        } catch (e) {
            this.props.snackbarDismiss(e)
        }
    };

    setActive(subcat) {
        if (Array.isArray(subcat)) {
            this.state.categories.map(category => {
                this.setState({[category._id]: false})
                category.subcat.map(subcat => {
                    if (this.state.master.categories.subcat.includes(subcat._id)) {
                        subcat.active = true
                    }
                })
            })
            this.setState({isLoad: true})
        }
    }

    deleteProcedure = (index) => {
        this.setState({isChange: true})
        this.props.setAlert(
            <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Удалить процедуру',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => this.onRemove(index),
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                onClose={() => this.props.setAlert(null)}
            >
                <h2>Подтвердите действие</h2>
                <p>Вы уверены, что хотите удалить выбранную процедуру?</p>
            </Alert>
        )
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
        this.setState({isChange: true})
    };

    patchData(url = '', activeMaster = {}) {
        console.log(activeMaster)
        this.state.categories.map(category => {
            let count = category.subcat.filter(subcat => subcat.active === true).length
            category.active = count > 0
        })
        activeMaster.description = this.state.description
        activeMaster.categories = {
            subcat: [],
            category: []
        }
        this.state.categories.map(category => {
            if (category.active === true) {
                activeMaster.categories.category.push({id: category._id, label: category.label})
            }
            category.subcat.map(subcat => {
                if (subcat.active === true) {
                    activeMaster.categories.subcat.push(subcat._id)
                }
            })
        })
        return fetch(url, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(activeMaster),
        })
            .then(res => res.json())
            .then(res => {
                this.props.setMaster(res.master)
            })
            .catch(e => console.log(e.message))
    }

    saveEdit = (index) => {
        try {
            let title = this.validateNewProdTitle(this.state.editProdTitle)
            if (!title.status) throw title.error

            let body = this.validateNewProdBody(this.state.editProdBody)
            if (!body.status) throw body.error

            let price = this.validateNewProdPrice(this.state.editProdPrice)
            if (!price.status) throw price.error


            const editProd = {
                title: this.state.editProdTitle,
                body: this.state.editProdBody,
                price: Number(this.state.editProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, ''))
            }

            let master = this.state.master
            master.priceList.splice(index, 1, editProd)
            this.setState({master: master, editProdTitle: '', editProdBody: '', editProdPrice: '', edit: null})
            this.setState({isChange: true})
        } catch (error) {
            this.props.snackbarDismiss(error)
        }
    };

    visible = event => {
        const target = event.target
        const name = target.name
        let master = this.state.master
        master[name] = !master[name]
        this.setState({master: master})
        this.props.setMaster(master)
        this.setState({isChange: true})
    };
    onRemove = (index) => {
        let master = this.state.master
        master.priceList = [...this.state.master.priceList.slice(0, index), ...this.state.master.priceList.slice(index + 1)]
        this.setState({master: master})
        this.setState({isChange: true})
    };

    openSnackDismiss(text) {
        if (this.state.snackbar) this.setState({snackbar: null})
        this.setState({
            snackbar:
                <Snackbar
                    before={<Icon24Dismiss/>}
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                >
                    {text}
                </Snackbar>
        })
    }

    openSnack(text) {
        if (this.state.snackbar) this.setState({snackbar: null})
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                >
                    {text}
                </Snackbar>
        })
    }

    validateNewProdTitle(newProdTitle) {
        if (newProdTitle === undefined) {
            return {status: false, error: 'Не заполнено название процедуры.'}
        } else {
            if (newProdTitle.replace(/ +/g, ' ').trim().length > 20) {
                return {status: false, error: 'Недопустимая длина заголовка.'}
            } else {
                if (newProdTitle.replace(/ +/g, ' ').trim().length < 2) {
                    return {status: false, error: 'Недопустимая длина заголовка.'}
                } else {
                    return {status: true}
                }
            }
        }
    }

    validateNewProdBody(newProdBody) {
        if (newProdBody === undefined) {
            return {status: false, error: 'Не заполнено описание процедуры.'}
        } else {
            if (newProdBody.replace(/ +/g, ' ').trim().length > 250) {
                return {status: false, error: 'Недопустимая длина описания.'}
            } else {
                if (newProdBody.replace(/ +/g, ' ').trim().length < 5) {
                    return {status: false, error: 'Недопустимая длина описания.'}
                } else {
                    return {status: true}
                }
            }
        }
    }

    validateNewProdPrice(newProdPrice) {
        if (newProdPrice === undefined) {
            return {status: false, error: 'Не заполнена стоимость процедуры.'}
        } else {
            if (newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '').trim().length > 5) {
                return {
                    status: false,
                    error: 'Некорректная стоимость. Допустимы целые числа длиной от 1 до 5 символов.'
                }
            } else {
                if (newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '').trim().length < 1) {
                    return {
                        status: false,
                        error: 'Некорректная стоимость. Допустимы целые числа длиной от 1 до 5 символов.'
                    }
                } else {
                    if (Number(newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '')) < 0) {
                        return {status: false, error: 'Нельзя указать отрицательную стоимость.'}
                    } else {
                        return {status: true}
                    }
                }
            }
        }
    }

    saveProd = () => {
        try {
            let title = this.validateNewProdTitle(this.state.newProdTitle)
            if (!title.status) throw title.error

            let body = this.validateNewProdBody(this.state.newProdBody)
            if (!body.status) throw body.error

            let price = this.validateNewProdPrice(this.state.newProdPrice)
            if (!price.status) throw price.error

            let master = this.state.master
            master.priceList.push({
                title: this.state.newProdTitle,
                body: this.state.newProdBody,
                price: Number(this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, ''))
            })
            this.setState({master: master, add: false, newProdTitle: '', newProdBody: '', newProdPrice: ''})
            this.setState({isChange: true})
        } catch (error) {
            this.props.snackbarDismiss(error)
        }
    };

    counter = (index) => {
        let countMass = this.state.categories[index].subcat.filter(subcat => {
            if (subcat.active === true) {
                return subcat.label
            }
        })
        return countMass.length
    };
    checkBan = () => {
        if (this.state.master.banned.status === true) {
            return (
                <Cell multiline>Ваш профиль сейчас не выводится в поиске, так-как обнаружены нарушения. Для
                    возобновления доступа - исправьте их. Информация отправлена в личные сообщения.</Cell>
            )
        } else {
            return (
                <Cell
                    asideContent={<Switch
                        name={'visible'}
                        onChange={this.visible}
                        checked={this.state.master.visible}/>}
                    description='Видимость в указанном городе'
                >
                    Показывать профиль
                </Cell>
            )
        }
    };

    checkSubcat = event => {
        const target = event.target
        const indexCat = target.name
        const indexSubcat = target.id
        let categories = this.state.categories
        categories[indexCat].subcat[indexSubcat].active = !this.state.categories[indexCat].subcat[indexSubcat].active
        this.setState({categories: categories})
    };

    statusProfile = () => {
        if (this.state.master.moderation.status === false) {
            return 'На модерации'
        } else if (this.state.master.visible === false) {
            return 'Ваш профиль не выводится в поиске'
        } else {
            return 'Ваш профиль доступен в поиске'
        }
    }

    render() {
        const warningGradient = 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)'
        if (this.state.warnConnection) {
            return (
                <React.Fragment>
                    <HeadCity changeCity={() => this.props.changeCity()}/>
                    <Placeholder
                        stretched
                        icon={<Icon56WifiOutline/>}
                        header={'Что-то не так!'}
                    >
                        Проверьте интернет-соединение.
                    </Placeholder>
                </React.Fragment>
            )
        } else if (this.state.isLoad === false) {
            return (
                <React.Fragment>
                    <Head
                        title="Настройки"
                        goBack={() => this.props.goBack('lk')}
                    />
                    <Placeholder
                        stretched
                        icon={<Spinner size="large" style={{marginTop: 20}}/>}
                        header={'Загружаю...'}
                    />
                </React.Fragment>
            )
        }
        if (this.props.user.isMaster === false) {
            return null
        } else {
            return (
                <React.Fragment>
                    <Head
                        title="Настройки"
                        goBack={() => {
                            try {
                                if (this.state.description.replace(/ +/g, ' ').trim().length < 20) throw 'Блок "О себе" должен содержать более 20 символов.'
                                if (this.state.description.replace(/ +/g, ' ').trim().length > 200) throw 'Блок "О себе" должен содержать не более 200 символов.'
                                if (this.state.master.priceList.length < 1) throw 'Добавьте как минимум одну процедуру, чтобы клиенты смогли записаться к Вам.'
                                this.props.goBack('lk')
                            } catch (e) {
                                this.props.snackbarDismiss(e)
                            }
                        }}
                    />
                    <RichCell
                        before={<Avatar src={this.state.master.avatarLink} size={72}/>}
                        caption={this.statusProfile()}
                    >
                        {this.state.master.firstname + ' ' + this.state.master.lastname}
                    </RichCell>
                    <Separator/>
                    <Cell
                        expandable
                        description='В котором Вы оказываете услуги'
                        onClick={() => {
                            try {
                                if (this.state.description.replace(/ +/g, ' ').trim().length < 20) throw 'Блок "О себе" должен содержать более 20 символов.'
                                if (this.state.description.replace(/ +/g, ' ').trim().length > 201) throw 'Блок "О себе" должен содержать не более 200 символов.'
                                if (this.state.master.priceList.length < 1) throw 'Добавьте как минимум одну процедуру, чтобы клиенты смогли записаться к Вам.'
                                this.props.changeCity()
                            } catch (e) {
                                this.props.snackbarDismiss(e)
                            }
                        }
                        }
                        indicator={this.state.master.location.city === typeof String ? 'Не выбрано' : this.state.master.location.city.title}
                    >
                        Выбранный город
                    </Cell>
                    <Group>
                        {this.checkBan()}
                    </Group>
                    <Group header={<Header mode="secondary">Прайс-лист</Header>}>
                        {this.state.master.priceList.length === 0 &&
                        <Banner
                            before={
                                <Avatar size={28} style={{ backgroundImage: warningGradient }}>
                                    <span style={{ color: '#fff' }}>!</span>
                                </Avatar>
                            }
                            header="Внимание:"
                            subheader={'Вы еще не указали ни одной процедуры. Пока они не указаны, пользователи не смогут связаться с Вами.'}
                        />
                        }
                        <CardGrid>
                            {this.state.master.priceList.map((item, index) => (
                                <Card size="l" mode="shadow" key={index}>
                                    <Cell multiline>
                                        <Cell
                                            description="Название процедуры">
                                            {
                                                this.state.edit === index ?
                                                    <Input
                                                        name="editProdTitle"
                                                        onChange={this.handleChange}
                                                        defaultValue={this.state.master.priceList[index].title}
                                                        value={this.state.editProdTitle}
                                                        status={this.validateNewProdTitle(this.state.editProdTitle).status === true ? 'valid' : 'error'}
                                                    /> :
                                                    this.state.master.priceList[index].title
                                            }
                                        </Cell>
                                        <Cell description="Краткое описание процедуры"
                                              multiline>
                                            {
                                                this.state.edit === index ?
                                                    <Input
                                                        name="editProdBody"
                                                        onChange={this.handleChange}
                                                        defaultValue={this.state.master.priceList[index].body}
                                                        value={this.state.editProdBody}
                                                        status={this.validateNewProdBody(this.state.editProdBody).status ? 'valid' : 'error'}
                                                    /> :
                                                    this.state.master.priceList[index].body
                                            }
                                        </Cell>
                                        <Cell
                                            description="Минимальная цена за работу">
                                            {
                                                this.state.edit === index ?
                                                    <Input
                                                        name="editProdPrice"
                                                        type="number"
                                                        onChange={this.handleChange}
                                                        defaultValue={this.state.master.priceList[index].price}
                                                        value={this.state.editProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '')}
                                                        status={this.validateNewProdPrice(this.state.editProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '')).status ? 'valid' : 'error'}
                                                    /> :
                                                    this.state.master.priceList[index].price
                                            }
                                        </Cell>
                                        {
                                            this.state.edit === index ?
                                                <Div style={{display: 'flex'}}>
                                                    <Button
                                                        stretched
                                                        style={{marginRight: 8}}
                                                        onClick={() => this.setState({edit: null})}
                                                        size="l"
                                                        mode="destructive"
                                                    >Отменить</Button>
                                                    <Button
                                                        size="l"
                                                        stretched
                                                        onClick={() => this.saveEdit(index)}
                                                        mode="secondary"
                                                    >Сохранить</Button>
                                                </Div> :
                                                <Div style={{display: 'flex'}}>
                                                    <Button
                                                        stretched
                                                        style={{marginRight: 8}}
                                                        onClick={() => this.deleteProcedure(index)}
                                                        size="l"
                                                        mode="destructive"
                                                    >Удалить</Button>
                                                    <Button
                                                        size="l"
                                                        stretched
                                                        onClick={() => {
                                                            this.setState({
                                                                editProdTitle: this.state.master.priceList[index].title,
                                                                editProdBody: this.state.master.priceList[index].body,
                                                                editProdPrice: String(this.state.master.priceList[index].price),
                                                                edit: index,
                                                                add: false
                                                            })
                                                        }}
                                                        mode="secondary"
                                                    >Редактировать</Button>
                                                </Div>
                                        }
                                    </Cell>
                                </Card>
                            ))}
                        </CardGrid>
                        {this.state.add ?
                            <Div style={{WebkitUserSelect: 'none', userSelect: 'none'}}>
                                <Cell description="Добавления нового элемента" multiline>
                                    <List>
                                        <Cell
                                            description={this.state.newProdTitle.replace(/ +/g, ' ').trim().length + "/20"}>
                                            <Input
                                                require
                                                status={
                                                    this.state.newProdTitle.length > 0 ?
                                                        this.validateNewProdTitle(this.state.newProdTitle).status === true ? 'valid' : 'error' :
                                                        null
                                                }
                                                name="newProdTitle"
                                                type="text"
                                                value={this.state.newProdTitle}
                                                placeholder={'Введите название'}
                                                onChange={this.handleChange}/>
                                        </Cell>
                                        <Cell
                                            description={this.state.newProdBody.replace(/ +/g, ' ').trim().length + "/250"}>
                                            <Textarea
                                                require
                                                status={
                                                    this.state.newProdBody.length > 0 ?
                                                        this.validateNewProdBody(this.state.newProdBody).status ? 'valid' : 'error' :
                                                        null
                                                }
                                                name="newProdBody"
                                                value={this.state.newProdBody}
                                                placeholder={'Укажите описание'}
                                                onChange={this.handleChange}/>
                                        </Cell>
                                        <Cell
                                            description={this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '').trim().length + "/5"}>
                                            <Input
                                                require
                                                status={
                                                    this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '').length > 0 ?
                                                        this.validateNewProdPrice(this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '')).status ? 'valid' : 'error' :
                                                        null
                                                }
                                                name="newProdPrice"
                                                type="number"
                                                value={this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/^0+/, '')}
                                                placeholder={'Укажите цену'}
                                                onChange={this.handleChange}/>
                                        </Cell>
                                    </List>
                                </Cell>
                                <Div style={{display: 'flex', WebkitUserSelect: 'none', userSelect: 'none'}}>
                                    <Button size="l" stretched mode="destructive" style={{marginRight: 8}}
                                            onClick={() => this.setState({add: false})}>Отменить</Button>
                                    <Button size="l" stretched
                                            onClick={() => this.saveProd()}>Сохранить</Button>
                                </Div>
                            </Div> :
                            <Div>
                                <Button
                                    stretched
                                    size="l"
                                    mode='outline'
                                    onClick={() => this.setState({add: true, edit: null})}
                                    before={<Icon24Add/>}
                                >
                                    Добавить процедуру
                                </Button>
                            </Div>
                        }
                    </Group>
                    <Group header={<Header mode="secondary">О себе</Header>}>
                        <FormLayout>
                            <Textarea
                                name={'description'}
                                status={this.state.description.replace(/ +/g, ' ').trim().length > 19 && this.state.description.replace(/ +/g, ' ').trim().length < 201 ? 'valid' : 'error'}
                                bottom={this.state.description.replace(/ +/g, ' ').trim().length > 1 ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                top="Расскажите немного о себе. Важно, чтобы клиенты Вам доверяли. (Не менее 20-ти символов)"
                                value={this.state.description}
                                onChange={this.handleChange}/>
                        </FormLayout>
                    </Group>
                    <Group header={<Header mode="secondary">Сфера деятельности</Header>}>
                        <FormLayout>
                            <FormLayoutGroup top="Укажите вид работы, в соответствии с тем, что Вы выполняете. Так Вас будет проще найти."
                                             id={'category'}>
                                {
                                    this.state.categories.map((category, i) => {
                                        return (
                                            <Group key={category._id}>
                                                <Cell name={category._id}
                                                      onClick={() => this.setState({[category._id]: !this.state[category._id]})}
                                                      indicator={
                                                          'Выбрано: ' + this.counter(i)
                                                      }
                                                      asideContent={this.state[category._id] ? <Icon16Up/> :
                                                          <Icon16Down/>}
                                                >
                                                    {category.label}
                                                </Cell>
                                                {this.state[category._id] &&
                                                <Div style={{WebkitUserSelect: 'none', userSelect: 'none'}}>
                                                    {
                                                        category.subcat.map((subcategory, index, category) => {
                                                            return (
                                                                <Cell
                                                                    key={index}
                                                                    asideContent={
                                                                        <Switch
                                                                            name={i}
                                                                            id={index}
                                                                            onChange={(event) => {
                                                                                this.setState({isChange: true});
                                                                                this.checkSubcat(event)
                                                                            }}
                                                                            checked={subcategory.active}/>
                                                                    }>
                                                                    {subcategory.label}
                                                                </Cell>
                                                            )
                                                        })
                                                    }
                                                </Div>
                                                }
                                            </Group>
                                        )
                                    })
                                }
                            </FormLayoutGroup>
                            <Separator/>
                            <Select
                                name={'type'}
                                top="Выберите тип оказания услуг"
                                value={this.state.type}
                                bottom={this.state.type ? '' : 'Пожалуйста, укажите тип оказания услуг'}
                                onChange={this.handleChange}
                            >
                                <option value="Частный мастер">Частный мастер</option>
                                <option value="Организация">Организация</option>
                            </Select>
                            {
                                this.state.type === 'Организация' &&
                                <FormLayoutGroup top="Укажите наименование организации в которой вы работаете">
                                    <Input
                                        name={'brand'}
                                        type="text"
                                        status={
                                            this.state.brand.length > 0 ?
                                                this.state.brand.length < 26 ? 'valid' : 'error' :
                                                null
                                        }
                                        value={this.state.brand}
                                        onChange={this.handleChange}
                                    />
                                </FormLayoutGroup>
                            }
                        </FormLayout>
                    </Group>
                    {this.props.snackbarLk}
                </React.Fragment>
            )

        }

    }
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity,
        user: state.user,
        master: state.master,
        params: state.params
    }
}

const putActionsToProps = (dispatch) => {
    return {
        setMaster: bindActionCreators(setMaster, dispatch)
    }
}

export default connect(putStateToProps, putActionsToProps)(withModalRootContext(Setting))