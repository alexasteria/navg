import React from 'react';
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
    ModalPage,
    ModalPageHeader,
    ANDROID,
    PanelHeaderButton, IOS, ModalRoot, platform, withModalRootContext, Snackbar
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import {BACKEND} from '../func/func';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import CityListModal from "../elements/cityListModal";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setMaster} from "../store/actions";
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

const osname = platform();

class Setting extends React.Component {
    constructor(props) {
        super(props);
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
            snackbar: null
        };
    }

    componentDidMount() {
        if(this.props.user.isMaster === true) {
            this.setState({master: this.props.master, description: this.props.master.description});
            fetch(BACKEND.category.getAll)
                .then(res => res.json())
                .then(categories => {
                    this.setState({categories: categories, isLoad: true});
                    categories.map(category => {
                        this.setState({[category._id]: false});
                    });
                    this.setActive( this.props.master.categories.subcat);
                });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.targetCity !== this.props.targetCity){
            let master = this.state.master;
            master.location.city = this.props.targetCity;
            this.setState({master: master});
        }
    }

    saveChanges = () => {
        this.props.setMaster(this.state.master);
        this.patchData(BACKEND.masters.all + this.state.master._id, this.state.master);
    };

    setActive(subcat){
        if (Array.isArray(subcat)) {
            this.state.categories.map(category => {
                this.setState({[category._id]: false});
                category.subcat.map(subcat => {
                    if (this.state.master.categories.subcat.includes(subcat._id)) {
                        subcat.active = true;
                    }
                })
            });
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    patchData(url = '', activeMaster = {}) {
        this.state.categories.map(category=>{
            let count = category.subcat.filter(subcat => subcat.active === true).length;
            category.active = count > 0;
        });
        activeMaster.description = this.state.description;
        activeMaster.categories = {
            subcat: [],
            category: []
        };
            this.state.categories.map(category => {
                if (category.active === true) {
                    activeMaster.categories.category.push({id: category._id, label: category.label})
                }
                category.subcat.map(subcat=> {
                    if (subcat.active === true) {
                        activeMaster.categories.subcat.push(subcat._id);
                    }
                })
        });
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(activeMaster), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => {
                this.props.modalBack();
                this.props.snackbar('Изменения сохранены');
            }); // парсит JSON ответ в Javascript объект
    }

    visible = event => {
        const target = event.target;
        const name = target.name;
        let master = this.state.master;
        master[name] = !master[name];
        this.setState({master: master});
    };
    onRemove = (index) => {
        let master = this.state.master;
        master.priceList = [...this.state.master.priceList.slice(0, index), ...this.state.master.priceList.slice(index + 1)];
        this.setState({master: master});
        //this.patchData(BACKEND.masters.all + this.state.master._id, this.state.master);
    };
    addProd = (status) => {
        this.setState({add: status})
    };

    openSnackDismiss(text) {
        if (this.state.snackbar) this.setState({snackbar: null});
        this.setState({
            snackbar:
                <Snackbar
                    before={<Icon24Dismiss/>}
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                >
                    {text}
                </Snackbar>
        });
    }
    openSnack(text) {
        if (this.state.snackbar) this.setState({snackbar: null});
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                >
                    {text}
                </Snackbar>
        });
    }
    saveProd = () => {
        try {
            if (this.state.newProdTitle === undefined) throw 'Не заполнено название процедуры';
            if (this.state.newProdTitle.length > 20) throw 'Название длинее 20-ти символов необходимо сократить';
            if (this.state.newProdBody === undefined) throw 'Не заполнено описание процедуры';
            if (this.state.newProdBody.length > 250) throw 'Описание процедуры слишком длинное. Сейчас заполнено - '+this.state.newProdBody.length+" из "+250;
            if (this.state.newProdPrice === undefined) throw 'Не заполнена стоимость процедуры';
            if (this.state.newProdPrice.length > 5) throw 'Максимально допустимы 5-ти значные суммы';
            let master = this.state.master;
            master.priceList.push({
                title: this.state.newProdTitle,
                body: this.state.newProdBody,
                price: this.state.newProdPrice
            });
            this.setState({master: master, add: false, newProdTitle: '', newProdBody: '', newProdPrice: ''});
            this.openSnack('Процедура добавлена');
        } catch (error) {
            this.openSnackDismiss(error)
        }
    };
    // saveProd = () => {
    //     try {
    //         if (this.state.newProdTitle === undefined) throw 'Не заполнено название процедуры';
    //         if (this.state.newProdBody === undefined) throw 'Не заполнено описание процедуры';
    //         if (this.state.newProdPrice === undefined) throw 'Не заполнена стоимость процедуры';
    //         let master = this.state.master;
    //         master.priceList.push({
    //             title: this.state.newProdTitle,
    //             body: this.state.newProdBody,
    //             price: this.state.newProdPrice
    //         });
    //         this.setState({master: master});
    //         this.setState({add: false, newProdTitle: '', newProdBody: '', newProdPrice: ''});
    //         this.props.snackbar('Процедура добавлена');
    //     } catch (error) {
    //         this.props.snackbar(error)
    //     }
    // };

    counter = (index) => {
        let countMass = this.state.categories[index].subcat.filter(
            function(item){
                if (item.active === true){
                    return item.active;
                } else {
                    return null
                }
            }
        );
        return countMass.length;
    };
    checkBan = () => {
        if (this.state.master.banned.status === true) {
            return (
                <Cell multiline>Ваш профиль сейчас не выводится в поиске, так-как обнаружены нарушения. Для возобновления доступа - исправьте их. Информация отправлена в личные сообщения.</Cell>
            )
        } else {
            return (
                <Cell
                    asideContent={<Switch
                        name={'visible'}
                        onChange={this.visible}
                        checked={this.state.master.visible}/>}>
                    Показывать профиль в поиске
                </Cell>
            )
        }
    };

    checkSubcat = event => {
        const target = event.target;
        const indexCat = target.name;
        const indexSubcat = target.id;
        let categories = this.state.categories;
        categories[indexCat].subcat[indexSubcat].active = !this.state.categories[indexCat].subcat[indexSubcat].active;
        this.setState({categories: categories});
    };

    changeCity = (city) => {
        let master = this.state.master;
        master.location.city = city;
        this.props.setMaster(master);
        this.props.changeModal('setting');
    };

    render() {
        if(this.state.isLoad === false){
            return null
        }
        if (this.props.user.isMaster === false) {
            return null
        } else {
                return (
                    <ModalRoot
                        activeModal={this.props.activeModal}
                        onClose={this.saveChanges}
                    >
                        <ModalPage dynamicContentHeight
                                   id={'setting'}
                                   onClose={this.saveChanges}
                                   header={
                                       <ModalPageHeader
                                           left={osname === ANDROID &&
                                           <PanelHeaderButton onClick={this.saveChanges}>{'Сохранить'}</PanelHeaderButton>}
                                           right={<PanelHeaderButton onClick={this.saveChanges}>{osname === IOS ? 'Сохранить' :
                                               <Icon24Done/>}</PanelHeaderButton>}
                                       >
                                           Настройки
                                       </ModalPageHeader>
                                   }
                        >
                            <Div>
                                <Cell
                                    size="l"
                                    description={
                                        this.state.master.visible ? 'Ваш профиль доступен в поиске' : 'Ваш профиль не выводится в поиске'
                                    }
                                    before={<Avatar src={this.state.master.avatarLink} size={80}/>}
                                >
                                    {this.state.master.firstname + ' ' + this.state.master.lastname}
                                </Cell>
                                <Cell
                                    expandable
                                    onClick={() => this.props.changeModal('changeCity')}
                                    indicator={this.state.master.location.city === typeof String ? 'Не выбрано' : this.state.master.location.city.title}
                                >
                                    Ваш город
                                </Cell>
                                <Group>
                                    {this.checkBan()}
                                </Group>
                                <Group title={'Прайс-лист'}>
                                    {this.state.master.priceList.length === 0 &&
                                    <Cell multiline>Вы еще не указали ни одной процедуры. Пока они не указаны, пользователи не смогут связаться с Вами.</Cell>
                                    }
                                    <CardGrid>
                                        {this.state.master.priceList.map((item, index) => (
                                            <Card size="l" mode="shadow">
                                                <Cell
                                                    key={item}
                                                    multiline
                                                    //onClick={() => this.setState({pedicureVisible: !this.state.pedicureVisible})}
                                                    //removable
                                                    // onRemove={() => {
                                                    //     this.onRemove(index)
                                                    // }}
                                                >
                                                    <Cell
                                                        description="Название процедуры">{this.state.master.priceList[index].title}</Cell>
                                                    <Cell description="Краткое описание процедуры"
                                                          multiline>{this.state.master.priceList[index].body}</Cell>
                                                    <Cell
                                                        description="Минимальная цена за работу">{this.state.master.priceList[index].price}</Cell>
                                                    <Button
                                                        //before={<Icon24Dismiss/>}
                                                        onClick={() => {this.onRemove(index)}}
                                                        size="xl"
                                                        mode="destructive"
                                                    >Удалить</Button>
                                                </Cell>
                                            </Card>
                                        ))}
                                    </CardGrid>
                                    {this.state.add &&
                                    <Div>
                                        <Cell description="Добавления нового элемента" multiline>
                                            <Input
                                                require
                                                name="newProdTitle"
                                                type="text"
                                                value={this.state.newProdTitle}
                                                placeholder={'Введите название'}
                                                onChange={this.handleChange}/>
                                            <Textarea
                                                require
                                                name="newProdBody"
                                                value={this.state.newProdBody}
                                                placeholder={'Укажите описание'}
                                                onChange={this.handleChange}/>
                                            <Input
                                                require
                                                name="newProdPrice"
                                                type="number" value={this.state.newProdPrice}
                                                placeholder={'Укажите цену'}
                                                onChange={this.handleChange}/>
                                        </Cell>
                                        <Div style={{display: 'flex'}}>
                                            <Button size="l" stretched style={{marginRight: 8}}
                                                    onClick={() => this.saveProd()}>Сохранить</Button>
                                            <Button size="l" stretched mode="destructive"
                                                    onClick={() => this.addProd(false)}>Отменить</Button>
                                        </Div>
                                    </Div>
                                    }
                                </Group>
                                <Group>
                                    <CellButton
                                        onClick={() => this.addProd(true)}
                                        before={<Icon24Add/>}
                                    >Добавить процедуру</CellButton>
                                </Group>
                                <Group>
                                    <FormLayout onSubmit={this.handleSubmit}>
                                        <Textarea
                                            name={'description'}
                                            status={this.state.description ? 'valid' : 'error'}
                                            bottom={this.state.description ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                            top="О себе"
                                            value={this.state.description}
                                            onChange={this.handleChange}/>
                                    </ FormLayout>
                                    <FormLayoutGroup top="Сфера деятельности"
                                                     bottom="Укажите вид работы, в соответствии с тем, что вы выполняете. Так вас будет проще найти."
                                                     id={'category'}>
                                        {
                                            this.state.categories.map((category, i) => {
                                                return (
                                                    <Group key={category._id}>
                                                        <Cell expandable name={category._id}
                                                              onClick={() => this.setState({[category._id]: !this.state[category._id]})}
                                                              indicator={
                                                                  'Выбрано: ' + this.counter(i)
                                                              }>
                                                            {category.label}
                                                        </Cell>
                                                        {this.state[category._id] &&
                                                        <Div>
                                                            {
                                                                category.subcat.map((subcategory, index, category)=>{
                                                                    return (
                                                                        <Cell
                                                                            key={index}
                                                                            asideContent={
                                                                                <Switch
                                                                                    name={i}
                                                                                    id={index}
                                                                                    onChange={this.checkSubcat}
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
                                </Group>
                            </Div>
                            {this.state.snackbar}
                        </ModalPage>
                        <ModalPage dynamicContentHeight
                                   id={'changeCity'}
                                   onClose={() => this.props.changeModal('setting')}
                                   header={
                                       <ModalPageHeader
                                           left={osname === ANDROID &&
                                           <PanelHeaderButton onClick={() => this.props.changeModal('setting')}>{'Назад'}</PanelHeaderButton>}
                                           right={<PanelHeaderButton onClick={() => this.props.changeModal('setting')}>{osname === IOS ? 'Назад' :
                                               <Icon24Done/>}</PanelHeaderButton>}
                                       >
                                           Выбор города
                                       </ModalPageHeader>
                                   }
                        >
                            <CityListModal dynamicContentHeight
                                           changeTargetCity={(city) => this.changeCity(city)}
                            />
                        </ModalPage>
                    </ModalRoot>
                )

        }

    }
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity,
        user: state.user,
        master: state.master
    };
};

const putActionsToProps = (dispatch) => {
    return {
        setMaster: bindActionCreators(setMaster, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(withModalRootContext (Setting));