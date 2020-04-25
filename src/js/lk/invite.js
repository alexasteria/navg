import React from 'react';
import {Group, Select, Cell, Switch, FormLayoutGroup, Link, Button, Checkbox, Textarea, FormLayout, Div, Avatar, Input} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: {},
            activeMaster: {},
            categories: [],
            statusPhoto: false,
            statusMessage: false
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.permMessage();
        fetch(BACKEND.category.getAll)//ловим обьявления по городу юзера
            .then(res => res.json())
            .then(categories => {
                this.setState({categories: categories});
                categories.map(category => {
                    this.setState({[category._id]: false});
                });
                console.log('State on load', this.state)
            });

    }

    regMaster = () => {
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
            location: this.props.user.location,
            //categories: this.state.categories,
            categories: cat,
            brand: this.state.brand
        };
        master.location.city = this.props.targetCity;
        this.props.closeReg(master);
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
                            {/*<Cell*/}
                            {/*    expandable*/}
                            {/*    multiline*/}
                            {/*    onClick={this.permPhoto}*/}
                            {/*    description="Для загрузки фото в портфолио"*/}
                            {/*    bottom={this.state.statusPhoto === false && 'Доступ обязателен для регистрации'}*/}
                            {/*>Доступ к загрузке фотографий в альбом приложения - {this.state.statusPhoto === true ? 'Разрешен' : 'Не разрешен'}</Cell>*/}
                            <Cell
                                expandable
                                onClick={this.props.changeCity}
                                indicator={this.props.targetCity.title || 'Не выбран'}>Ваш город</Cell>
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
                            {this.state.checkLicense && this.state.statusMessage && this.state.description && this.state.type &&
                            <Button size="xl" onClick={this.regMaster}>Зарегистрироваться как мастер</Button>
                            }
                        </FormLayout>
                    </Group>
        );
    }
}

export default Invite;