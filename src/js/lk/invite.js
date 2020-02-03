import React from 'react';
import {Select, Cell, Switch, FormLayoutGroup, File, Link, Button, Checkbox, Textarea, FormLayout, Input, Div, Panel} from "@vkontakte/vkui"
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hairVisible: false,
            manicureVisible: false,
            pedicureVisible: false,
            eyelashesVisible: false,
            eyebrowsVisible: false,
            shugaringVisible: false,
            hairCat: ["Ламинирование",
            "Окрашивание", "Мелирование", "Ботокс волос", "Стрижка"],
            manicureCat: ["Наращивание", "Покрытие гелем", "Маникюр комбинированый", "Маникюр комбинированый",
            "Маникюр обрезной", "Аппаратный маникюр", "Укрепление ногтей"],
            pedicureCat: ["Классический", "Аппаратный", "Экспресс", "Камбинированный", "Покрытие"],
            eyelashesCat: ["Наращивание", "Ламинирование", "Кератиновая завивка", "Окрашивание",
            "Биозавивка"],
            eyebrowsCat: ["Перманентный макияж", "Микроблейдинг", "Нанонапыление", "Долговременная укладка", "Окрашивание"],
            shugaringCat: ["Подпышечные впадины", "Бикини", "Руки", "Ноги", "Белая линия живота"],
            manicureStatus: [
                {activate: true, id:"5e3756b37612461064809b28", label: "Наращивание"},
                {activate: true, id:"5e3757907612461064809b29", label: "Покрытие гелем"},
                {activate: true, id:"5e3757977612461064809b2a", label: "Маникюр комбинированый"},
                {activate: true, id:"5e3757a37612461064809b2b", label: "Маникюр обрезной"},
                {activate: true, id:"5e3757a97612461064809b2c", label: "Аппаратный маникюр"},
                {activate: true, id:"5e3757b17612461064809b2d", label: "Укрепление ногтей"}
            ],
            pedicureStatus: {},
            eyelashesStatus: {},
            eyebrowsStatus: {},
            shugaringStatus: {},
            hairStatus: {},
            firstname: '',
            lastname: '',
            avatarLink: '',
            about: '',
            type: ''

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const id = target.id;
        this.setState({ [name]: !this.state[name][id] });
        //this.state[name][id] = value;
        console.log(this.state);

    }
   handleChange(event) {
        let {name, value} = event.target;
        this.setState({[name]: value});
        console.log(this.state);
    }

    handleSubmit(event) {
        const master = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            description: this.state.about,
            type: this.state.type,
            manicureStatus: this.state.manicureStatus,
            pedicureStatus: this.state.pedicureStatus,
            eyelashesStatus: this.state.eyelashesStatus,
            eyebrowsStatus: this.state.eyebrowsStatus,
            shugaringStatus: this.state.shugaringStatus,
            hairStatus: this.state.hairStatus,
            avatarLink: this.state.avatarLink
        };
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
            .then(response => response.json()); // парсит JSON ответ в Javascript объект
    }
    render(){
        return (
            <Panel id="reg">
                <FormLayout onSubmit={this.handleSubmit}>
                    <Input name={'avatarLink'} top="AvatarLink" value={this.state.avatarLink} onChange={this.handleChange}/>
                    <Input name={'firstname'}  top="Имя" value={this.state.firstname} onChange={this.handleChange}/>
                    <Input name={'lastname'} top="Фамилия" value={this.state.lastname} onChange={this.handleChange}/>
                    <Textarea name={'about'} top="О себе" value={this.state.about} onChange={this.handleChange}/>
                    <FormLayoutGroup top="Сфера деятельности" bottom="Укажите вид работы, в соответствии с тем, что вы выполняете. Так вас будет проще найти." id={'category'}>
                        <Cell expandable name={'manicureVisible'} onClick={() => this.setState({ manicureVisible: !this.state.manicureVisible })} indicator={'Выбрано: '+Object.keys(this.state.manicureStatus).length}>Маникюр</Cell>
                        {this.state.manicureVisible &&
                        <Div>
                            {this.state.manicureStatus.map(function(item, i){
                                return <Cell key={i} asideContent={<Switch name={'manicureStatus'} id={item.id} checked={item.active}/>}>{item.label}</Cell>;})}
                        </Div>
                        }
                        <Cell expandable name={'pedicureVisible'} onClick={() => this.setState({ pedicureVisible: !this.state.pedicureVisible })} indicator={'Выбрано: '+Object.keys(this.state.pedicureStatus).length}>Педикюр</Cell>
                        {this.state.pedicureVisible &&
                        <Div>
                            <Cell asideContent={<Switch name={'pedicureStatus'} id={'Наращивание'} onChange={this.handleInputChange} checked={this.state.pedicureStatus['Классический']}/>}>Классический</Cell>
                            <Cell asideContent={<Switch name={'pedicureStatus'} id={'Аппаратный'} onChange={this.handleInputChange} checked={this.state.pedicureStatus['Аппаратный']}/>}>Аппаратный</Cell>
                            <Cell asideContent={<Switch name={'pedicureStatus'} id={'Экспресс'} onChange={this.handleInputChange} checked={this.state.pedicureStatus['Экспресс']}/>}>Экспресс</Cell>
                            <Cell asideContent={<Switch name={'pedicureStatus'} id={'Комбинированный'} onChange={this.handleInputChange} checked={this.state.pedicureStatus['Комбинированный']}/>}>Комбинированный</Cell>
                            <Cell asideContent={<Switch name={'pedicureStatus'} id={'Покрытие'} onChange={this.handleInputChange} checked={this.state.pedicureStatus['Покрытие']}/>}>Покрытие</Cell>
                            {/*this.state.pedicureCat.map(function(dopCategory, i){
                                return <Cell name={dopCategory} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                        </Div>
                        }
                        <Cell expandable name={'eyelashesVisible'} onClick={() => this.setState({ eyelashesVisible: !this.state.eyelashesVisible })} indicator={'Выбрано: '+Object.keys(this.state.eyelashesStatus).length}>Ресницы</Cell>
                        {this.state.eyelashesVisible &&
                        <Div>
                            <Cell asideContent={<Switch name={'eyelashesStatus'} id={'Наращивание'} onChange={this.handleInputChange} checked={this.state.eyelashesStatus['Наращивание']}/>}>Наращивание</Cell>
                            <Cell asideContent={<Switch name={'eyelashesStatus'} id={'Ламинирование'} onChange={this.handleInputChange} checked={this.state.eyelashesStatus['Ламинирование']}/>}>Ламинирование</Cell>
                            <Cell asideContent={<Switch name={'eyelashesStatus'} id={'Кератиновая завивка'} onChange={this.handleInputChange} checked={this.state.eyelashesStatus['Кератиновая завивка']}/>}>Кератиновая завивка</Cell>
                            <Cell asideContent={<Switch name={'eyelashesStatus'} id={'Окрашивание'} onChange={this.handleInputChange} checked={this.state.eyelashesStatus['Окрашивание']}/>}>Окрашивание</Cell>
                            <Cell asideContent={<Switch name={'eyelashesStatus'} id={'Биозавивка'} onChange={this.handleInputChange} checked={this.state.eyelashesStatus['Биозавивка']}/>}>Биозавивка</Cell>
                            {/*this.state.eyelashesCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                        </Div>
                        }
                        <Cell expandable name={'eyebrowsVisible'} onClick={() => this.setState({ eyebrowsVisible: !this.state.eyebrowsVisible })} indicator={'Выбрано: '+Object.keys(this.state.eyebrowsStatus).length}>Брови</Cell>
                        {this.state.eyebrowsVisible &&
                        <Div>
                            <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'Перманентный макияж'} onChange={this.handleInputChange} checked={this.state.eyebrowsStatus['Перманентный макияж']}/>}>Перманентный макияж</Cell>
                            <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'Микроблейдинг'} onChange={this.handleInputChange} checked={this.state.eyebrowsStatus['Микроблейдинг']}/>}>Микроблейдинг</Cell>
                            <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'Нанонапыление'} onChange={this.handleInputChange} checked={this.state.eyebrowsStatus['Нанонапыление']}/>}>Нанонапыление</Cell>
                            <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'Долговременная укладка'} onChange={this.handleInputChange} checked={this.state.eyebrowsStatus['Долговременная укладка']}/>}>Долговременная укладка</Cell>
                            <Cell asideContent={<Switch name={'eyebrowsStatus'} id={'Окрашивание'} onChange={this.handleInputChange} checked={this.state.eyebrowsStatus['Окрашивание']}/>}>Окрашивание</Cell>
                            {/*this.state.eyebrowsCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                        </Div>
                        }
                        <Cell expandable name={'shugaringVisible'} onClick={() => this.setState({ shugaringVisible: !this.state.shugaringVisible })} indicator={'Выбрано: '+Object.keys(this.state.shugaringStatus).length}>Шугаринг</Cell>
                        {this.state.shugaringVisible &&
                        <Div>
                            <Cell asideContent={<Switch name={'shugaringStatus'} id={'Подпышечные впадины'} onChange={this.handleInputChange} checked={this.state.shugaringStatus['Подпышечные впадины']}/>}>Подпышечные впадины</Cell>
                            <Cell asideContent={<Switch name={'shugaringStatus'} id={'Бикини'} onChange={this.handleInputChange} checked={this.state.shugaringStatus['Бикини']}/>}>Бикини</Cell>
                            <Cell asideContent={<Switch name={'shugaringStatus'} id={'Руки'} onChange={this.handleInputChange} checked={this.state.shugaringStatus['Руки']}/>}>Руки</Cell>
                            <Cell asideContent={<Switch name={'shugaringStatus'} id={'Ноги'} onChange={this.handleInputChange} checked={this.state.shugaringStatus['Ноги']}/>}>Ноги</Cell>
                            <Cell asideContent={<Switch name={'shugaringStatus'} id={'Живот'} onChange={this.handleInputChange} checked={this.state.shugaringStatus['Живот']}/>}>Живот</Cell>
                            {/*this.state.shugaringCat.map(function(dopCategory, i){
                                return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                        </Div>
                        }
                        <Cell expandable name={'hairVisible'} onClick={() => this.setState({ hairVisible: !this.state.hairVisible })} indicator={'Выбрано: '+Object.keys(this.state.hairStatus).length}>Уход за волосами</Cell>
                        {this.state.hairVisible &&
                        <Div>
                            <Cell asideContent={<Switch name={'hairStatus'} id={'Ламинирование'} onChange={this.handleInputChange} checked={this.state.hairStatus['Ламинирование']}/>}>Ламинирование</Cell>
                            <Cell asideContent={<Switch name={'hairStatus'} id={'Окрашивание'} onChange={this.handleInputChange} checked={this.state.hairStatus['Окрашивание']}/>}>Окрашивание</Cell>
                            <Cell asideContent={<Switch name={'hairStatus'} id={'Мелирование'} onChange={this.handleInputChange} checked={this.state.hairStatus['Мелирование']}/>}>Мелирование</Cell>
                            <Cell asideContent={<Switch name={'hairStatus'} id={'Ботокс волос'} onChange={this.handleInputChange} checked={this.state.hairStatus['Ботокс волос']}/>}>Ботокс волос</Cell>
                            <Cell asideContent={<Switch name={'hairStatus'} id={'Стрижка'} onChange={this.handleInputChange} checked={this.state.hairStatus['Стрижка']}/>}>Стрижка</Cell>
                            {/*this.state.hairCat.map(function(dopCategory, i){
                            return <Cell id={i} asideContent={<Switch />}>{dopCategory}</Cell>;})*/}
                        </Div>
                        }
                    </FormLayoutGroup>
                    <Select id={'type'} value={this.state.type} onChange={this.handleChange} placeholder="Выберите тип оказания услуг">
                        <option value="organization">Организация</option>
                        <option value="solo">Частный мастер</option>
                    </Select>
                    <File top="Загрузите портфолио Ваших работ" before={<Icon24Camera />} size="l">
                        Загрузить
                    </File>
                    <Checkbox required>Согласен c <Link>условиями использования приложения</Link></Checkbox>
                    <Button size="xl">Зарегистрироваться как мастер</Button>
                </FormLayout>
            </Panel>
        );
    }
}

export default Invite;