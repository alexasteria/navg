import React from 'react';
import {Group, Select, Cell, Switch, FormLayoutGroup, Link, Button, Checkbox, Textarea, FormLayout, Div, Avatar, Input} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";
import {bindActionCreators} from "redux";
import {
    changeFindModelsList, changeFindModelsListScroll,
    changeMastersList,
    changeMasterslistScroll,
    changeTargetCategory,
    changeTargetCity, createUser, loginUser
} from "../store/actions";
import {connect} from "react-redux";

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
            description: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.permMessage();
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
                brand: this.state.brand
            };
            this.props.closeReg(master);
        } catch (error) {
            console.log(error);
            this.props.snackbar(error)
        }
    };
    // permPhoto = () => {
    //     bridge.send("VKWebAppGetAuthToken", {"app_id": 7170938, "scope": "photos"})
    //         .then(data => {
    //             console.log(data);
    //             this.setState({statusPhoto: data.result})
    //         })
    //         .catch(error => console.log(error))
    // };
    permMessage = () => {
            bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 193179174, "key": "dBuBKe1kFcdemzB"})
                .then(result => {
                    console.log(result);
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
                            <Cell
                                expandable
                                multiline
                                onClick={this.permMessage}
                                description="Для получения уведомлений о заявках"
                                status={this.state.statusMessage === true ? 'valid' : 'error'}
                                bottom={this.state.statusMessage === false && 'Доступ обязателен для регистрации'}
                            >Доступ на получение личных сообщений от приложения - {this.state.statusMessage=== true ? 'Разрешен' : 'Не разрешен'}</Cell>
                            <Textarea
                                name={'description'}
                                status={this.state.description ? 'valid' : 'error'}
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
                            <Select
                                name={'type'}
                                value={this.state.type}
                                status={this.state.type ? 'valid' : 'error'}
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
                                c <Link>условиями использования приложения</Link></Checkbox>
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