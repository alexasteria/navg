import React from 'react';
import connect from "@vkontakte/vk-connect";
import VKConnect from '@vkontakte/vkui-connect-mock';
import {Group, Select, Cell, Switch, FormLayoutGroup, Link, Button, Checkbox, Textarea, FormLayout, Div, Avatar} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkLicense: false,
            hairVisible: false,
            manicureVisible: false,
            pedicureVisible: false,
            eyelashesVisible: false,
            eyebrowsVisible: false,
            shugaringVisible: false,
            cosmeticVisible: false,
            count: {
                manicureStatus: 0,
                pedicureStatus: 0,
                eyelashesStatus: 0,
                eyebrowsStatus: 0,
                shugaringStatus: 0,
                hairStatus: 0,
                cosmeticStatus: 0
            },
            activeMaster: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: '',
                manicureStatus: [
                    {active: false, id:"5e3756b37612461064809b28", label: "Наращивание"},
                    {active: false, id:"5e3757907612461064809b29", label: "Покрытие гелем"},
                    {active: false, id:"5e3757977612461064809b2a", label: "Маникюр комбинированый"},
                    {active: false, id:"5e3757a37612461064809b2b", label: "Маникюр обрезной"},
                    {active: false, id:"5e3757a97612461064809b2c", label: "Аппаратный маникюр"},
                    {active: false, id:"5e3757b17612461064809b2d", label: "Укрепление ногтей"}
                ],
                pedicureStatus: [
                    {active: false, id:"5e3757f67612461064809b33", label: "Классический"},
                    {active: false, id:"5e3757fb7612461064809b34", label: "Аппаратный"},
                    {active: false, id:"5e3757ff7612461064809b35", label: "Экспресс"},
                    {active: false, id:"5e3758037612461064809b36", label: "Комбинированный"},
                    {active: false, id:"5e3758087612461064809b37", label: "Покрытие"}
                ],
                eyelashesStatus: [
                    {active: false, id:"5e3758147612461064809b38", label: "Наращивание"},
                    {active: false, id:"5e3758197612461064809b39", label: "Ламинирование"},
                    {active: false, id:"5e37581e7612461064809b3a", label: "Кератиновая завивка"},
                    {active: false, id:"5e3758267612461064809b3b", label: "Окрашивание"},
                    {active: false, id:"5e37582b7612461064809b3c", label: "Биозавивка"}
                ],
                eyebrowsStatus: [
                    {active: false, id:"5e3758347612461064809b3d", label: "Перманентный макияж"},
                    {active: false, id:"5e37583b7612461064809b3e", label: "Микроблейдинг"},
                    {active: false, id:"5e3758407612461064809b3f", label: "Нанонапыление"},
                    {active: false, id:"5e3758467612461064809b40", label: "Долговременная укладка"},
                    {active: false, id:"5e37584c7612461064809b41", label: "Окрашивание"}
                ],
                shugaringStatus: [
                    {active: false, id:"5e37585a7612461064809b42", label: "Подмышечные впадины"},
                    {active: false, id:"5e3758607612461064809b43", label: "Бикини"},
                    {active: false, id:"5e3758647612461064809b44", label: "Руки"},
                    {active: false, id:"5e3758697612461064809b45", label: "Ноги"},
                    {active: false, id:"5e37586e7612461064809b46", label: "Белая линия живота"}
                ],
                hairStatus: [
                    {active: false, id:"5e3757d07612461064809b2e", label: "Ламинирование"},
                    {active: false, id:"5e3757d87612461064809b2f", label: "Окрашивание"},
                    {active: false, id:"5e3757dd7612461064809b30", label: "Мелирование"},
                    {active: false, id:"5e3757e17612461064809b31", label: "Ботокс волос"},
                    {active: false, id:"5e3757e97612461064809b32", label: "Стрижка"}
                ],
                cosmeticStatus: [
                    {active: false, id:"5e3758767612461064809b47", label: "Макияж"},
                    {active: false, id:"5e37587a7612461064809b48", label: "Пилинг"},
                    {active: false, id:"5e37587d7612461064809b49", label: "Чистка"},
                    {active: false, id:"5e3758827612461064809b4a", label: "Массаж лица"},
                ],
            },
            type: '',
            about: '',
            newUser: true

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        VKConnect.subscribe((e) => {
            if (e.detail.type === 'VKWebAppGetUserInfoResult') {
                let user = this.state.activeMaster;
                user.vkUid = e.detail.data.id;
                user.firstname = e.detail.data.first_name;
                user.lastname = e.detail.data.last_name;
                user.avatarLink = e.detail.data.photo_200;
                user.sex = e.detail.data.sex;
                user.city = {id: e.detail.data.city.id, title: e.detail.data.city.title};
                user.country = {id: e.detail.data.country.id, title: e.detail.data.country.title};
                console.log(e.detail.data);
                this.setState({activeMaster: user});
                //this.verifiedUser(this.state.user.vkUid);
            }
        });
        VKConnect
            .send('VKWebAppGetUserInfo', {});
    }
    handleCheck = event => {
        const target = event.target;
        const name = target.name;
        //const value = target.type === 'checkbox' ? target.checked : target.value;
        let mass = this.state.activeMaster[name];
        const index = target.id;
        mass[index].active = !mass[index].active;
        this.setState({ [name]: mass });
        let countMass = this.state.activeMaster[name].filter(
            function(item){
                console.log(item);
                if (item.active === true){
                    return item.active;
                } else {
                    return null
                }
            });
        let count = this.state.count;
        count[name] = countMass.length;
        this.setState({ count: count });
    };
   handleChange(event) {
        let {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        const activeMaster = {
            firstname: this.state.activeMaster.firstname,
            lastname: this.state.activeMaster.lastname,
            description: this.state.about,
            manicureStatus: this.state.activeMaster.manicureStatus,
            pedicureStatus: this.state.activeMaster.pedicureStatus,
            eyelashesStatus: this.state.activeMaster.eyelashesStatus,
            eyebrowsStatus: this.state.activeMaster.eyebrowsStatus,
            shugaringStatus: this.state.activeMaster.shugaringStatus,
            hairStatus: this.state.activeMaster.hairStatus,
            cosmeticStatus: this.state.activeMaster.cosmeticStatus,
            avatarLink: this.state.activeMaster.avatarLink,
            type: this.state.type,
            vkUid: this.state.activeMaster.vkUid,
            sex: this.state.activeMaster.sex,
            city: this.state.activeMaster.city,
            country: this.state.activeMaster.country,
            category: [
                {id: '5e37537a58b85c13bcffb8b4', active: this.state.count.manicureStatus > 0, label:'Маникюр'},
                {id: '5e3753be58b85c13bcffb8b5', active: this.state.count.pedicureStatus > 0, label: 'Педикюр'},
                {id: '5e3753c458b85c13bcffb8b6', active: this.state.count.eyelashesStatus > 0, label: 'Ресницы'},
                {id: '5e3753c858b85c13bcffb8b7', active: this.state.count.eyebrowsStatus > 0, label: 'Брови'},
                {id: '5e3753cd58b85c13bcffb8b8', active: this.state.count.shugaringStatus > 0, label: 'Шугаринг'},
                {id: '5e3753d558b85c13bcffb8b9', active: this.state.count.hairStatus > 0, label: 'Уход за волосами'},
                {id: '5e3753dc58b85c13bcffb8ba', active: this.state.count.cosmeticStatus > 0, label: 'Косметология'}
            ]
        };
        console.log(activeMaster);
        this.postData(BACKEND.masters.all, activeMaster).then(err => console.log(err));
        event.preventDefault();
    }
    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => console.log(response.json())); // парсит JSON ответ в Javascript объект

    }
    render(){
        return (
                    <Group>
                        {
                            this.state.newUser &&
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
                                <Cell expandable name={'manicureVisible'}
                                      onClick={() => this.setState({manicureVisible: !this.state.manicureVisible})}
                                      indicator={'Выбрано: ' + this.state.count.manicureStatus}>Маникюр</Cell>
                                {this.state.manicureVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.manicureStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'manicureStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.manicureStatus[index].active}/>}>
                                                    {this.state.activeMaster.manicureStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'pedicureVisible'}
                                      onClick={() => this.setState({pedicureVisible: !this.state.pedicureVisible})}
                                      indicator={'Выбрано: ' + this.state.count.pedicureStatus}>Педикюр</Cell>
                                {this.state.pedicureVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.pedicureStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'pedicureStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.pedicureStatus[index].active}/>}>
                                                    {this.state.activeMaster.pedicureStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'eyelashesVisible'}
                                      onClick={() => this.setState({eyelashesVisible: !this.state.eyelashesVisible})}
                                      indicator={'Выбрано: ' + this.state.count.eyelashesStatus}>Ресницы</Cell>
                                {this.state.eyelashesVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.eyelashesStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'eyelashesStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.eyelashesStatus[index].active}/>}>
                                                    {this.state.activeMaster.eyelashesStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'eyebrowsVisible'}
                                      onClick={() => this.setState({eyebrowsVisible: !this.state.eyebrowsVisible})}
                                      indicator={'Выбрано: ' + this.state.count.eyebrowsStatus}>Брови</Cell>
                                {this.state.eyebrowsVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.eyebrowsStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'eyebrowsStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.eyebrowsStatus[index].active}/>}>
                                                    {this.state.activeMaster.eyebrowsStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'shugaringVisible'}
                                      onClick={() => this.setState({shugaringVisible: !this.state.shugaringVisible})}
                                      indicator={'Выбрано: ' + this.state.count.shugaringStatus}>Шугаринг</Cell>
                                {this.state.shugaringVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.shugaringStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'shugaringStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.shugaringStatus[index].active}/>}>
                                                    {this.state.activeMaster.shugaringStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'hairVisible'}
                                      onClick={() => this.setState({hairVisible: !this.state.hairVisible})}
                                      indicator={'Выбрано: ' + this.state.count.hairStatus}>Уход за волосами</Cell>
                                {this.state.hairVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.hairStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'hairStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.hairStatus[index].active}/>}>
                                                    {this.state.activeMaster.hairStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
                                }
                                <Cell expandable name={'hairVisible'}
                                      onClick={() => this.setState({cosmeticVisible: !this.state.cosmeticVisible})}
                                      indicator={'Выбрано: ' + this.state.count.cosmeticStatus}>Косметология</Cell>
                                {this.state.cosmeticVisible &&
                                <Div>
                                    {
                                        this.state.activeMaster.cosmeticStatus.map((subcategory, index)=>{
                                            return (
                                                <Cell
                                                    key={subcategory.id}
                                                    asideContent={<Switch
                                                        name={'cosmeticStatus'}
                                                        id={index}
                                                        onChange={this.handleCheck}
                                                        checked={this.state.activeMaster.cosmeticStatus[index].active}/>}>
                                                    {this.state.activeMaster.cosmeticStatus[index].label}
                                                </Cell>
                                            )
                                        })
                                    }
                                </Div>
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
                            <Button size="xl" onClick={this.props.closePopup}>Зарегистрироваться как мастер</Button>
                            }
                        </FormLayout>
                        }
                    </Group>
        );
    }
}

export default Invite;