import React from 'react';
import VKConnect from '@vkontakte/vkui-connect-mock';
import {Alert, Group, Select, Cell, Switch, FormLayoutGroup, Link, Button, Checkbox, Textarea, FormLayout, Div, Panel, Avatar} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
//import Icon24Camera from '@vkontakte/icons/dist/24/camera';

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
            master: {
                firstname: '',
                lastname: '',
                avatarLink: '',
                vkUid: ''
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
                console.log('В сессии вк '+e.detail.data);
                let master = this.state.master;
                master.firstname = e.detail.data.first_name;
                master.lastname = e.detail.data.last_name;
                master.avatarLink = e.detail.data.photo_200;
                master.vkUid = e.detail.data.id;
                this.setState({master: master});
            }
        });
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
    handleCheck = event => {
        const target = event.target;
        const name = target.name;
        //const value = target.type === 'checkbox' ? target.checked : target.value;
        let mass = this.state[name];
        const index = target.id;
        mass[index].active = !mass[index].active;
        this.setState({ [name]: mass });
        let countMass = this.state[name].filter(
            function(item){
                console.log(item);
                if (item.active === true){
                    return item.active;
                }
            });;
        let count = this.state.count;
        count[name] = countMass.length;
        this.setState({ count: count });
    };
   handleChange(event) {
        let {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        const master = {
            firstname: this.state.master.firstname,
            lastname: this.state.master.lastname,
            description: this.state.about,
            manicureStatus: this.state.manicureStatus,
            pedicureStatus: this.state.pedicureStatus,
            eyelashesStatus: this.state.eyelashesStatus,
            eyebrowsStatus: this.state.eyebrowsStatus,
            shugaringStatus: this.state.shugaringStatus,
            hairStatus: this.state.hairStatus,
            cosmeticStatus: this.state.cosmeticStatus,
            avatarLink: this.state.master.avatarLink,
            type: this.state.type,
            vkUid: this.state.master.vkUid,
            category: [
                {active: this.state.count.manicureStatus > 0, label:'Маникюр'},
                {active: this.state.count.pedicureStatus > 0, label: 'Педикюр'},
                {active: this.state.count.eyelashesStatus > 0, label: 'Ресницы'},
                {active: this.state.count.eyebrowsStatus > 0, label: 'Брови'},
                {active: this.state.count.shugaringStatus > 0, label: 'Шугаринг'},
                {active: this.state.count.hairStatus > 0, label: 'Уход за волосами'},
                {active: this.state.count.cosmeticStatus > 0, label: 'Косметология'}
            ]
        };
        console.log('hair - '+this.state.hairStatus.length);
        console.log(master);
        this.postData('http://localhost:3030/masters/', master);
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
                                before={<Avatar src={this.state.master.avatarLink} size={80}/>}
                                bottomContent={'Bottom content'}
                            >
                                {this.state.master.firstname + ' ' + this.state.master.lastname}
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
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[0].active}/>}>Классический</Cell>
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[1].active}/>}>Аппаратный</Cell>
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[2].active}/>}>Экспресс</Cell>
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[3].active}/>}>Комбинированный</Cell>
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'4'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[4].active}/>}>Покрытие</Cell>
                                    <Cell asideContent={<Switch name={'manicureStatus'} id={'5'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.manicureStatus[5].active}/>}>Покрытие</Cell>
                                    {/*{this.state.manicureStatus.map(function(item, i){
                                return <Cell key={i} onChange={this.handleInputChange}  asideContent={<Switch  name={'manicureStatus'} id={item.id} checked={item.active} />}>{item.label}</Cell>;})}*/}
                                </Div>
                                }
                                <Cell expandable name={'pedicureVisible'}
                                      onClick={() => this.setState({pedicureVisible: !this.state.pedicureVisible})}
                                      indicator={'Выбрано: ' + this.state.count.pedicureStatus}>Педикюр</Cell>
                                {this.state.pedicureVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'pedicureStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.pedicureStatus[0].active}/>}>Классический</Cell>
                                    <Cell asideContent={<Switch name={'pedicureStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.pedicureStatus[1].active}/>}>Аппаратный</Cell>
                                    <Cell asideContent={<Switch name={'pedicureStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.pedicureStatus[2].active}/>}>Экспресс</Cell>
                                    <Cell asideContent={<Switch name={'pedicureStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.pedicureStatus[3].active}/>}>Комбинированный</Cell>
                                    <Cell asideContent={<Switch name={'pedicureStatus'} id={'4'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.pedicureStatus[4].active}/>}>Покрытие</Cell>
                                    {/*this.state.pedicureCat.map(function(dopCategory, i){
                                return <Cell name={dopCategory} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                                </Div>
                                }
                                <Cell expandable name={'eyelashesVisible'}
                                      onClick={() => this.setState({eyelashesVisible: !this.state.eyelashesVisible})}
                                      indicator={'Выбрано: ' + this.state.count.eyelashesStatus}>Ресницы</Cell>
                                {this.state.eyelashesVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'eyelashesStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyelashesStatus[0].active}/>}>Наращивание</Cell>
                                    <Cell asideContent={<Switch name={'eyelashesStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyelashesStatus[1].active}/>}>Ламинирование</Cell>
                                    <Cell asideContent={<Switch name={'eyelashesStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyelashesStatus[2].active}/>}>Кератиновая
                                        завивка</Cell>
                                    <Cell asideContent={<Switch name={'eyelashesStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyelashesStatus[3].active}/>}>Окрашивание</Cell>
                                    <Cell asideContent={<Switch name={'eyelashesStatus'} id={'4'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyelashesStatus[4].active}/>}>Биозавивка</Cell>
                                    {/*this.state.eyelashesCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                                </Div>
                                }
                                <Cell expandable name={'eyebrowsVisible'}
                                      onClick={() => this.setState({eyebrowsVisible: !this.state.eyebrowsVisible})}
                                      indicator={'Выбрано: ' + this.state.count.eyebrowsStatus}>Брови</Cell>
                                {this.state.eyebrowsVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyebrowsStatus[0].active}/>}>Перманентный
                                        макияж</Cell>
                                    <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyebrowsStatus[1].active}/>}>Микроблейдинг</Cell>
                                    <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyebrowsStatus[2].active}/>}>Нанонапыление</Cell>
                                    <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyebrowsStatus[3].active}/>}>Долговременная
                                        укладка</Cell>
                                    <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'4'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.eyebrowsStatus[4].active}/>}>Окрашивание</Cell>
                                    {/*this.state.eyebrowsCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                                </Div>
                                }
                                <Cell expandable name={'shugaringVisible'}
                                      onClick={() => this.setState({shugaringVisible: !this.state.shugaringVisible})}
                                      indicator={'Выбрано: ' + this.state.count.shugaringStatus}>Шугаринг</Cell>
                                {this.state.shugaringVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'shugaringStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.shugaringStatus[0].active}/>}>Подпышечные
                                        впадины</Cell>
                                    <Cell asideContent={<Switch name={'shugaringStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.shugaringStatus[1].active}/>}>Бикини</Cell>
                                    <Cell asideContent={<Switch name={'shugaringStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.shugaringStatus[2].active}/>}>Руки</Cell>
                                    <Cell asideContent={<Switch name={'shugaringStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.shugaringStatus[3].active}/>}>Ноги</Cell>
                                    <Cell asideContent={<Switch name={'shugaringStatus'} id={'4'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.shugaringStatus[4].active}/>}>Живот</Cell>
                                    {/*this.state.shugaringCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                                </Div>
                                }
                                <Cell expandable name={'hairVisible'}
                                      onClick={() => this.setState({hairVisible: !this.state.hairVisible})}
                                      indicator={'Выбрано: ' + this.state.count.hairStatus}>Уход за волосами</Cell>
                                {this.state.hairVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'hairStatus'} id={'0'} onChange={this.handleCheck}
                                                                checked={this.state.hairStatus[0].active}/>}>Ламинирование</Cell>
                                    <Cell asideContent={<Switch name={'hairStatus'} id={'1'} onChange={this.handleCheck}
                                                                checked={this.state.hairStatus[1].active}/>}>Окрашивание</Cell>
                                    <Cell asideContent={<Switch name={'hairStatus'} id={'2'} onChange={this.handleCheck}
                                                                checked={this.state.hairStatus[2].active}/>}>Мелирование</Cell>
                                    <Cell asideContent={<Switch name={'hairStatus'} id={'3'} onChange={this.handleCheck}
                                                                checked={this.state.hairStatus[3].active}/>}>Ботокс
                                        волос</Cell>
                                    <Cell asideContent={<Switch name={'hairStatus'} id={'4'} onChange={this.handleCheck}
                                                                checked={this.state.hairStatus[4].active}/>}>Стрижка</Cell>
                                    {/*this.state.hairCat.map(function(dopCategory, i){
                            return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                                </Div>
                                }
                                <Cell expandable name={'hairVisible'}
                                      onClick={() => this.setState({cosmeticVisible: !this.state.cosmeticVisible})}
                                      indicator={'Выбрано: ' + this.state.count.cosmeticStatus}>Косметология</Cell>
                                {this.state.cosmeticVisible &&
                                <Div>
                                    <Cell asideContent={<Switch name={'cosmeticStatus'} id={'0'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.cosmeticStatus[0].active}/>}>Макияж</Cell>
                                    <Cell asideContent={<Switch name={'cosmeticStatus'} id={'1'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.cosmeticStatus[1].active}/>}>Пилинг</Cell>
                                    <Cell asideContent={<Switch name={'cosmeticStatus'} id={'2'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.cosmeticStatus[2].active}/>}>Чистка</Cell>
                                    <Cell asideContent={<Switch name={'cosmeticStatus'} id={'3'}
                                                                onChange={this.handleCheck}
                                                                checked={this.state.cosmeticStatus[3].active}/>}>Массаж
                                        лица</Cell>
                                    {/*this.state.hairCat.map(function(dopCategory, i){
                            return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
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