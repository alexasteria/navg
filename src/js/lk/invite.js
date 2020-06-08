import React from 'react';
import {
    Group,
    Select,
    Cell,
    Switch,
    FormLayoutGroup,
    Link,
    Button,
    Checkbox,
    Textarea,
    FormLayout,
    Div,
    Avatar,
    Input,
    CardGrid, Card, CellButton
} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";
import {bindActionCreators} from "redux";
import {changeTargetCity} from "../store/actions";
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {connect} from "react-redux";
import Icon16Down from '@vkontakte/icons/dist/16/down';
import Icon16Up from '@vkontakte/icons/dist/16/up';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: {},
            activeMaster: {},
            categories: [],
            statusPhoto: false,
            statusMessage: false,
            checkLicense: false,
            description: '',
            priceList: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getCategories();
    }

    getCategories = () => {
        fetch(BACKEND.category.getAll)
            .then(res => res.json())
            .then(categories => {
                this.setState({categories: categories});
                categories.map(category => {
                    this.setState({[category._id]: false});
                });
            });
    };

    regMaster = () => {
        try {
            if (this.props.targetCity=== 'Не выбрано') throw 'Город не выбран. Вас не смогут найти.';
            if (this.state.checkLicense === false) throw 'Примите условия пользовательского соглашения, если желаете зарегистрироваться.';
            if (this.state.statusMessage === false) throw 'Предоставьте доступ на получение сообщений, чтобы мы уведомили вас о заказе.';
            if (this.state.description.length < 50) throw 'Блок "О себе" должен содержать более 50-ти символов.';
            if (this.state.priceList.length < 1) throw 'Добавьте как минимум одну процедуру, чтобы клиенты смогли записаться к вам.';
            if (!this.state.type) throw 'Укажите тип исполнителя работ: Частное лицо или Организация.';
            let cat = {
                subcat: [],
                category: []
            };
            let categories = this.state.categories;
            categories.map((category, index) => {
                let countCat = category.subcat.filter(
                    function(subcat){
                        if (subcat.active === true){
                            cat.subcat.push(subcat._id);
                            return subcat.active;
                        } else {
                            return null
                        }
                    }
                );
                if (countCat.length > 0) {
                    cat.category.push({id: category._id, label: category.label});
                    category.active = true;
                } else {
                    category.active = false;
                }
            });
            let master = {
                firstname: this.props.user.firstname,
                lastname: this.props.user.lastname,
                description: this.state.description,
                vkUid: this.props.user.vkUid,
                type: this.state.type,
                avatarLink: this.props.user.avatarLink,
                sex: this.props.user.sex,
                location: {
                    country: this.props.user.location.country,
                    city: this.props.targetCity
                },
                categories: cat,
                brand: this.state.brand,
                banned: {status: false},
                priceList: this.state.priceList,
                visible: true
            };
            this.props.closeReg(master);
        } catch (error) {
            console.log(error);
            this.props.snackbar(error)
        }
    };
    addProd = (status) => {
        this.setState({add: status})
    };
    saveProd = () => {
        try {
            if (this.state.newProdTitle === undefined) throw 'Не заполнено название процедуры';
            if (this.state.newProdTitle.length > 20) throw 'Название длинее 20-ти символов необходимо сократить';
            if (this.state.newProdBody === undefined) throw 'Не заполнено описание процедуры';
            if (this.state.newProdBody.length > 250) throw 'Описание процедуры слишком длинное. Сейчас заполнено - '+this.state.newProdBody.length+" из "+250;
            if (this.state.newProdPrice === undefined) throw 'Не заполнена стоимость процедуры';
            if (this.state.newProdPrice.length > 5) throw 'Максимально допустимы 5-ти значные суммы';
            let priceList = this.state.priceList;
            priceList.push({
                title: this.state.newProdTitle,
                body: this.state.newProdBody,
                price: this.state.newProdPrice
            });
            this.setState({priceList: priceList, add: false, newProdTitle: '', newProdBody: '', newProdPrice: ''});
        } catch (error) {
            this.props.snackbar(error)
        }
    };
    onRemove = (index) => {
        let priceList = this.state.priceList;
        priceList = [...this.state.priceList.slice(0, index), ...this.state.priceList.slice(index + 1)];
        this.setState({priceList: priceList});
        this.props.snackbar('Процедура удалена');
    };
    permMessage = () => {
            bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
                .then(result => {
                    this.setState({statusMessage: result.result})
                })
                .catch(e => console.log(e))
    };
    checkSubcat = event => {
        const target = event.target;
        const indexCat = target.name;
        const indexSubcat = target.id;
        let categories = this.state.categories;
        categories[indexCat].subcat[indexSubcat].active = !this.state.categories[indexCat].subcat[indexSubcat].active;
        this.setState({categories: categories});
    };
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
   handleChange(event) {
        let {name, value} = event.target;
        this.setState({[name]: value});
    }

    render(){
        return (
                    <Group>
                        <FormLayout>
                            <CardGrid>
                                <Card size="l" mode="shadow">
                                    <Cell
                                        size="l"
                                        description="Регистрация мастера"
                                        before={<Avatar src={this.props.user.avatarLink} size={80}/>}
                                    >
                                        {this.props.user.firstname + ' ' + this.props.user.lastname}
                                    </Cell>
                                    <Cell
                                        expandable
                                        onClick={this.props.changeCity}
                                        indicator={this.props.targetCity.title || 'Не выбран'}
                                        status={this.props.targetCity.title ? 'valid' : 'error'}
                                        bottom={this.props.targetCity.title ? '' : 'Пожалуйста, укажите город в котором вы работаете'}
                                    >
                                        Ваш город
                                    </Cell>
                                </Card>
                            </CardGrid>
                            <CardGrid>
                                <Card size="l" mode="shadow">
                                    <Cell
                                        multiline
                                        asideContent={
                                            <Switch
                                                onChange={this.permMessage}
                                                checked={this.state.statusMessage}/>
                                        }
                                        bottom={this.state.statusMessage === false && 'Доступ обязателен для регистрации'}
                                    >Доступ на получение личных сообщений от приложения, для получения уведомлений о заявках
                                    </Cell>
                                    {/*<Cell*/}
                                    {/*    expandable*/}
                                    {/*    multiline*/}
                                    {/*    onClick={this.permMessage}*/}
                                    {/*    description="Для получения уведомлений о заявках"*/}
                                    {/*    status={this.state.statusMessage === true ? 'valid' : 'error'}*/}
                                    {/*>Доступ на получение личных сообщений от приложения - {this.state.statusMessage=== true ? <span style={{color: 'green'}}>Разрешен</span> : <span style={{color: 'red'}}>Не разрешен</span>}*/}
                                    {/*</Cell>*/}
                                </Card>
                            </CardGrid>
                            <Textarea
                                name={'description'}
                                bottom={this.state.description ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                top="О себе"
                                value={this.state.description}
                                onChange={this.handleChange}/>
                            <FormLayoutGroup top="Сфера деятельности"
                                             bottom="Укажите вид работы, в соответствии с тем, что вы выполняете. Так вас будет проще найти."
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
                                                  asideContent={this.state[category._id] ? <Icon16Up /> : <Icon16Down />}
                                            >
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
                            <Group title={'Прайс-лист'}>
                                {this.state.priceList.length === 0 &&
                                <Cell multiline>Вы еще не указали ни одной процедуры. Пока они не указаны, пользователи не смогут связаться с Вами.</Cell>
                                }
                                <CardGrid>
                                    {this.state.priceList.map((item, index) => (
                                        <Card size="l" mode="shadow">
                                            <Cell
                                                key={item}
                                                multiline
                                                // removable
                                                // onRemove={() => {
                                                //     this.onRemove(index)
                                                // }}
                                                >
                                                <Cell
                                                    description="Название процедуры">{this.state.priceList[index].title}</Cell>
                                                <Cell description="Краткое описание процедуры"
                                                      multiline>{this.state.priceList[index].body}</Cell>
                                                <Cell
                                                    description="Минимальная цена за работу">{this.state.priceList[index].price}</Cell>
                                            </Cell>
                                            <Button
                                                //before={<Icon24Dismiss/>}
                                                onClick={() => {this.onRemove(index)}}
                                                size="xl"
                                                mode="destructive"
                                            >Удалить</Button>
                                        </Card>
                                    ))}
                                </CardGrid>
                                {this.state.add ?
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
                                </Div> :
                                    <CellButton
                                        onClick={() => this.addProd(true)}
                                        before={<Icon24Add/>}
                                    >Добавить процедуру</CellButton>
                                }
                            </Group>
                            <Select
                                name={'type'}
                                value={this.state.type}
                                bottom={this.state.type ? '' : 'Пожалуйста, укажите тип оказания услуг'}
                                onChange={this.handleChange}
                                placeholder="Выберите тип оказания услуг">
                                <option value="Организация">Организация</option>
                                <option value="Частный мастер">Частный мастер</option>
                            </Select>
                            {
                                this.state.type === 'Организация' &&
                                <FormLayoutGroup top="Укажите наименование организации в которой вы работаете">
                                    <Input name={'brand'} type="text" value={this.state.brand} onChange={this.handleChange}/>
                                </FormLayoutGroup>
                            }
                            <Checkbox onChange={() => this.setState({checkLicense: !this.state.checkLicense})}>Согласен
                                c <Link onClick={this.props.openRules}>условиями использования приложения</Link></Checkbox>
                            <Button size="xl" onClick={this.regMaster}>Зарегистрироваться как мастер</Button>
                        </FormLayout>
                    </Group>
        );
    }
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity,
        user: state.user
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
    };
};

export default connect(putStateToProps, putActionsToProps)(Invite);