import React from 'react';
import VKConnect from '@vkontakte/vkui-connect-mock';
import {
    Group,
    Div,
    Avatar,
    Cell,
    FormLayout,
    Textarea,
    Switch,
    FormLayoutGroup,
    Alert, Button
} from "@vkontakte/vkui"
import {BACKEND} from '../func/func';

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popout: null,
            vkuid: '',
            activeMaster: {
                description: '',
                firstname: '',
                lastname: ''
            },
            count: {
                manicureStatus: 0,
                pedicureStatus: 0,
                eyelashesStatus: 0,
                eyebrowsStatus: 0,
                shugaringStatus: 0,
                hairStatus: 0,
                cosmeticStatus: 0
            },
            hairVisible: false,
            manicureVisible: false,
            pedicureVisible: false,
            eyelashesVisible: false,
            eyebrowsVisible: false,
            shugaringVisible: false,
            cosmeticVisible: false
        };
    }
    componentDidMount() {
        VKConnect.subscribe((e) => {
            if (e.detail.type === 'VKWebAppGetUserInfoResult') {
                fetch(BACKEND.masters.vkuid+e.detail.data.id)
                    .then(res => res.json())
                    .then(activeMaster => this.setState({activeMaster: activeMaster[0]}, () =>
                        this.loadCount()
                    ));
            }
        });
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
    componentDidUpdate() {

    }

    patchData(url = '', data = {}) {
        console.log('пошло');
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
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => {
                console.log(response.json());
                this.props.popout();
            }); // парсит JSON ответ в Javascript объект
    }
    loadCount() {
        const arrCategory = ['manicureStatus', 'pedicureStatus', 'eyelashesStatus',
        'eyebrowsStatus', 'shugaringStatus', 'hairStatus'];
        arrCategory.map(category => {
            let countMass =this.state.activeMaster[category].filter(
                item => item.active === true
            );
            let count = this.state.count;
            count[category] = countMass.length;
            this.setState({ count: count });
        });
    }
    handleCheck = event => {
        const target = event.target;
        const name = target.name;
        //const value = target.type === 'checkbox' ? target.checked : target.value;
        let mass = this.state.activeMaster[name];
        const index = target.id;
        //console.log(mass);
        mass[index].active = !mass[index].active;
        this.setState({ [name]: mass });
        let countMass = this.state.activeMaster[name].filter(
            function(item){
                //console.log(item);
                if (item.active === true){
                    return item.active;
                } else {
                    return null
                }
            });
        let count = this.state.count;
        count[name] = countMass.length;
        this.setState({ count: count });
        console.log(this.state.activeMaster);
    };

    render(){
        //console.log(this.state.activeMaster);
        return (
            <Div>
                <Cell
                    size="l"
                    description={'Показывать в поиске'}
                    before={<Avatar src={this.state.activeMaster.avatarLink} size={80}/>}
                >
                    {this.state.activeMaster.firstname+' '+this.state.activeMaster.lastname}
                </Cell>
                <Group>
                    <FormLayout onSubmit={this.handleSubmit}>
                        <Textarea
                            name={'about'}
                            status={this.state.activeMaster.description ? 'valid' : 'error'}
                            bottom={this.state.activeMaster.description ? '' : 'Пожалуйста, напишите пару слов о себе'}
                            top="О себе"
                            value={this.state.activeMaster.description}
                            onChange={this.handleChange}/>
                    </ FormLayout>
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
                    <Button size="xl" onClick={() => this.patchData(BACKEND.masters.all+this.state.activeMaster._id, this.state.activeMaster)}>Сохранить изменения</Button>
                </Group>
            </Div>
        );
    }
}

export default Lk;