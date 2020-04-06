import React from 'react';
//import connect from "@vkontakte/vk-connect";
//import VKConnect from '@vkontakte/vkui-connect-mock';
import {Group, Select, Cell, Switch, FormLayoutGroup, Link, Button, Checkbox, Textarea, FormLayout, Div, Avatar} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
//import {BACKEND} from "../func/func";

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: {},
            activeMaster: {

            },
            categories: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.type !== this.state.type || prevState.about !== this.state.about || prevState.category !== this.state.category) {
            let master = this.state.activeMaster;
            master.type = this.state.type;
            master.description = this.state.about;
            master.category = [
                {id: '5e37537a58b85c13bcffb8b4', active: this.state.count.manicureStatus > 0, label:'Маникюр'},
                {id: '5e3753be58b85c13bcffb8b5', active: this.state.count.pedicureStatus > 0, label: 'Педикюр'},
                {id: '5e3753c458b85c13bcffb8b6', active: this.state.count.eyelashesStatus > 0, label: 'Ресницы'},
                {id: '5e3753c858b85c13bcffb8b7', active: this.state.count.eyebrowsStatus > 0, label: 'Брови'},
                {id: '5e3753cd58b85c13bcffb8b8', active: this.state.count.shugaringStatus > 0, label: 'Шугаринг'},
                {id: '5e3753d558b85c13bcffb8b9', active: this.state.count.hairStatus > 0, label: 'Уход за волосами'},
                {id: '5e3753dc58b85c13bcffb8ba', active: this.state.count.cosmeticStatus > 0, label: 'Косметология'}
            ];
            this.setState({activeMaster: master});
        }
    }

    componentWillMount() {
        let master = this.state.activeMaster;
        console.log('user пришел из props', this.props.user);
        master.firstname = this.props.user.firstname;
        master.lastname =this.props.user.lastname;
        master.vkUid =this.props.user.vkUid;
        master.avatarLink =this.props.user.avatarLink;
        master.sex =this.props.user.sex;
        master.city =this.props.user.city;
        master.country =this.props.user.country;
        master.manicureStatus = this.state.manicureStatus;
        master.pedicureStatus = this.state.pedicureStatus;
        master.eyelashesStatus = this.state.eyelashesStatus;
        master.eyebrowsStatus = this.state.eyebrowsStatus;
        master.shugaringStatus = this.state.shugaringStatus;
        master.hairStatus = this.state.hairStatus;
        master.cosmeticStatus = this.state.cosmeticStatus;
        console.log('после обработки', master);
        this.setState({activeMaster: master});

    }
    checkSubcat = event => {
        const target = event.target;
        const indexCat = target.name;
        const indexSubcat = target.id;
        let categories = this.state.categories;
        categories[indexCat].subcat[indexSubcat].active = !this.state.categories[indexCat].subcat[indexSubcat].active;
        this.setState({categories: categories});
        // let countMass = this.state.activeMaster[name].filter(
        //     function(item){
        //         //console.log(item);
        //         if (item.active === true){
        //             return item.active;
        //         } else {
        //             return null
        //         }
        //     });
        // let count = this.state.count;
        // count[name] = countMass.length;
        // this.setState({ count: count });
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
                        <FormLayout onSubmit={this.handleSubmit}>
                            <Cell
                                size="l"
                                description="Регистрация мастера"
                                before={<Avatar src={this.state.activeMaster.avatarLink} size={80}/>}
                                bottomContent={'Bottom content'}
                            >
                                {this.state.activeMaster.firstname + ' ' + this.state.activeMaster.lastname}
                            </Cell>
                            <Textarea
                                name={'about'}
                                status={this.state.about ? 'valid' : 'error'}
                                bottom={this.state.about ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                top="О себе"
                                value={this.state.about}
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
                            <Checkbox onChange={() => this.setState({checkLicense: !this.state.checkLicense})}>Согласен
                                c <Link>условиями использования приложения</Link></Checkbox>
                            {this.state.checkLicense && this.state.about && this.state.type &&
                            <Button size="xl" onClick={() => this.props.closeReg(this.state.activeMaster)}>Зарегистрироваться как мастер</Button>
                            }
                        </FormLayout>
                    </Group>
        );
    }
}

export default Invite;