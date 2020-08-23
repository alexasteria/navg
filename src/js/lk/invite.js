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
    CardGrid, Card, CellButton, Alert, List, Footer
} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";
import {bindActionCreators} from "redux";
import {changeTargetCity, regSetInvite} from "../store/actions";
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {connect} from "react-redux";
import Icon16Down from '@vkontakte/icons/dist/16/down';
import Icon16Up from '@vkontakte/icons/dist/16/up';

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
            priceList: [],
            newProdTitle: '',
            newProdBody: '',
            newProdPrice: '',
            qapi: false,
            type: 'Частный мастер',
            brand: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0,0);
        this.permMessage();
        if (this.props.regSet !== null){
            this.setState({checkLicense: this.props.regSet.checkLicense, description: this.props.regSet.description, priceList: this.props.regSet.priceList, type: this.props.regSet.type, categories: this.props.regSet.categories, brand: this.props.regSet.brand})
        } else {
            this.getCategories();
        }
    }

    componentWillUnmount() {
        const data = {};
        data.checkLicense = this.state.checkLicense;
        data.description = this.state.description;
        data.priceList = this.state.priceList;
        data.type = this.state.type;
        data.categories = this.state.categories;
        data.brand = this.state.brand;
        this.props.regSetInvite(data);
        this.props.setAlert(null)
    }

    deleteProcedure = (index) => {
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
                onClose={()=>this.props.setAlert(null)}
            >
                <h2>Подтвердите действие</h2>
                <p>Вы уверены, что хотите удалить выбранную процедуру?</p>
            </Alert>
        );
    };

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
            if (this.state.type === 'Частный мастер') this.setState({brand: ''});
            if (this.props.targetCity=== 'Не выбрано') throw 'Город не выбран. Вас не смогут найти.';
            if (this.state.statusMessage === false) throw 'Предоставьте доступ на получение сообщений, чтобы мы уведомили вас о заказе.';
            if (this.state.description.replace(/ +/g, ' ').trim().length < 20) throw 'Блок "О себе" должен содержать более 20-ти символов.';
            if (this.state.description.replace(/ +/g, ' ').trim().length > 200) throw 'Блок "О себе" должен содержать менее 200 символов.';
            if (this.state.priceList.length < 1) throw 'Добавьте как минимум одну процедуру, чтобы клиенты смогли записаться к вам.';
            if (!this.state.type) throw 'Укажите тип исполнителя работ: Частное лицо или Организация.';
            if (this.state.brand !== "") {
                if (this.state.brand.length > 25) throw 'Длина названия организации ограничена 25 символами.';
            }
            if (this.state.checkLicense === false) throw 'Примите условия пользовательского соглашения, если желаете зарегистрироваться.';
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
                description: this.state.description,
                type: this.state.type,
                location: {
                    country: this.props.user.location.country,
                    city: this.props.targetCity
                },
                categories: cat,
                brand: this.state.brand,
                priceList: this.state.priceList,
                params: this.props.params
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
    validateNewProdTitle(newProdTitle){
        if (newProdTitle === undefined){
            return {status: false, error: 'Не заполнено название процедуры.'};
        } else {
            if (newProdTitle.replace(/ +/g, ' ').trim().length > 20){
                return {status: false, error: 'Недопустимая длина заголовка.'};
            } else {
                if (newProdTitle.replace(/ +/g, ' ').trim().length < 2){
                    return {status: false, error: 'Недопустимая длина заголовка.'};
                } else {
                    return {status: true}
                }
            }
        }
    }

    validateNewProdBody(newProdBody){
        if (newProdBody === undefined){
            return {status: false, error: 'Не заполнено описание процедуры.'};
        } else {
            if (newProdBody.replace(/ +/g, ' ').trim().length > 250){
                return {status: false, error: 'Недопустимая длина описания.'};
            } else {
                if (newProdBody.replace(/ +/g, ' ').trim().length < 5){
                    return {status: false, error: 'Недопустимая длина описания.'};
                } else {
                    return {status: true}
                }
            }
        }
    }

    validateNewProdPrice(newProdPrice){
        if (newProdPrice === undefined){
            return {status: false, error: 'Не заполнена стоимость процедуры.'};
        } else {
            if (newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '').trim().length > 5){
                return {status: false, error: 'Некорректная стоимость. Допустимы целые числа длиной от 1 до 5 символов.'};
            } else {
                if (newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '').trim().length < 1){
                    return {status: false, error: 'Некорректная стоимость. Допустимы целые числа длиной от 1 до 5 символов.'};
                } else {
                    if (Number(newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '')) < 0){
                        return {status: false, error: 'Нельзя указать отрицательную стоимость.'};
                    } else {
                        return {status: true}
                    }
                }
            }
        }
    }
    saveProd = () => {
        try {
            let title = this.validateNewProdTitle(this.state.newProdTitle);
            if (!title.status) throw title.error;

            let body = this.validateNewProdBody(this.state.newProdBody);
            if (!body.status) throw body.error;

            let price = this.validateNewProdPrice(this.state.newProdPrice);
            if (!price.status) throw price.error;

            let priceList = this.state.priceList;
            priceList.push({
                title: this.state.newProdTitle,
                body: this.state.newProdBody,
                price: Number(this.state.newProdPrice.replace(/^0+/, ''))
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
    };
    permMessage = () => {
                bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
                    .then(result => {
                        this.setState({statusMessage: result.result})
                    })
                    .catch(e => {
                        console.log(e)
                    })
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
                            <Group>
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
                                {
                                    this.state.statusMessage === false ?
                                    <Cell
                                        multiline
                                        asideContent={<Button mode="outline" onClick={this.permMessage}>Разрешить</Button>}
                                        bottom={this.state.statusMessage === false && 'Доступ обязателен для регистрации'}
                                    >Доступ на получение личных сообщений от приложения, для получения уведомлений о заявках
                                    </Cell> :
                                        null
                                        // <Cell
                                        //     multiline
                                        //     asideContent={<Button mode="commerce">Разрешён</Button>}
                                        //     bottom={'Можете продолжить регистрацию'}
                                        // >Доступ на получение личных сообщений от приложения, для получения уведомлений о заявках
                                        // </Cell>
                                }
                            </Group>
                        <FormLayout>
                                <Textarea
                                    name={'description'}
                                    bottom={this.state.description ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                    top="О себе"
                                    status={
                                        this.state.description.replace(/ +/g, ' ').trim().length > 0 ?
                                        this.state.description.replace(/ +/g, ' ').trim().length > 19 && this.state.description.replace(/ +/g, ' ').trim().length < 201 ? 'valid' : 'error' :
                                        null
                                    }
                                    value={this.state.description}
                                    onChange={this.handleChange}/>
                            <FormLayoutGroup top="Сфера деятельности"
                                             bottom="Укажите вид работы, в соответствии с тем, что Вы выполняете. Так Вас будет проще найти."
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
                        </FormLayout>
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
                                            <Button
                                                //before={<Icon24Dismiss/>}
                                                onClick={() => {this.deleteProcedure(index)}}
                                                size="xl"
                                                mode="destructive"
                                            >Удалить</Button>
                                            </Cell>
                                        </Card>
                                    ))}
                                </CardGrid>
                                {this.state.add ?
                                <Div>
                                    <Cell description="Добавления нового элемента" multiline>
                                        <List>
                                            <Cell description={this.state.newProdTitle.replace(/ +/g, ' ').trim().length+"/20"}>
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
                                            <Cell description={this.state.newProdBody.replace(/ +/g, ' ').trim().length+"/250"}>
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
                                            <Cell description={this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '').trim().length+"/5"}>
                                                <Input
                                                    require
                                                    status={
                                                        this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '').length > 0 ?
                                                        this.validateNewProdPrice(this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '')).status ? 'valid' : 'error' :
                                                            null
                                                    }
                                                    name="newProdPrice"
                                                    type="number" value={this.state.newProdPrice.replace(/[\s.,%]/g, '').replace(/[.\/,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/^0+/, '')}
                                                    placeholder={'Укажите цену'}
                                                    onChange={this.handleChange}/>
                                            </Cell>
                                        </List>
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
                        <FormLayout>
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
                            <Checkbox checked={this.state.checkLicense} onChange={() => this.setState({checkLicense: !this.state.checkLicense})}>Согласен
                                c <Link onClick={this.props.openRules}>условиями использования приложения</Link></Checkbox>
                            <Button size="xl" onClick={this.regMaster}>Зарегистрироваться как мастер</Button>
                        </FormLayout>
                        <Footer/>
                    </Group>
        );
    }
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity,
        user: state.user,
        params: state.params,
        regSet: state.regSet
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
        regSetInvite: bindActionCreators(regSetInvite, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(Invite);