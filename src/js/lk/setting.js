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
    List, Button, CellButton, Input, Spinner,Snackbar
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import {BACKEND} from '../func/func';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon16Done from '@vkontakte/icons/dist/16/done';

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            about: 'non info',
            tooltip: true,
            popout: null,
            vkuid: '',
            activeMaster: {
                priceList: [],
                showProfile: false
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
        fetch(BACKEND.masters.vkuid + this.props.user.vkUid)
            .then(res => res.json())
            .then(activeMaster => {
                this.setState({activeMaster: activeMaster[0]})
                this.loadCount()
                this.setState({about: activeMaster[0].description})
            });
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    onChange(event) {
        //console.log(event.target.value)
    }

    patchData(url = '', activeMaster = {}) {
        //console.log(activeMaster);
        activeMaster.description = this.state.about;
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
                console.log(response.json());
                this.openSnack("Изменения сохранены");
                //this.props.popout();
                console.log(activeMaster);
            }); // парсит JSON ответ в Javascript объект
    }

    openSnack (text) {
        const blueBackground = {
            backgroundColor: 'var(--accent)'
        };
        if (this.state.snackbar) return;
        this.setState({ snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                >
                    {text}
                </Snackbar>
        });
    }
    showProfile = event => {
        const target = event.target;
        const name = target.name;
        let activeMaster = this.state.activeMaster;
        //console.log('Изменено с ', activeMaster[name], ' на ', !activeMaster[name]);
        activeMaster[name] = !activeMaster[name];
        this.setState({activeMaster: activeMaster});
    }
    onRemove = (index) => {
        let activeMaster = this.state.activeMaster;
        activeMaster.priceList = [...this.state.activeMaster.priceList.slice(0, index), ...this.state.activeMaster.priceList.slice(index + 1)];
        this.setState({activeMaster: activeMaster});
        this.patchData(BACKEND.masters.all + this.state.activeMaster._id, this.state.activeMaster)
        this.openSnack("Процедура удалена")
    }
    addProd = (status) => {
        this.setState({add: status})
    };
    saveProd = (title, body, price) => {
        //console.log(title, body, price);
        let activeMaster = this.state.activeMaster;
        activeMaster.priceList.push({
            title: this.state.newProdTitle,
            body: this.state.newProdBody,
            price: this.state.newProdPrice
        });
        this.setState({activeMaster: activeMaster});
        this.setState({add: false, newProdTitle: '', newProdBody: '', newProdPrice: ''});
        //console.log(this.state.activeMaster);
        this.patchData(BACKEND.masters.all + this.state.activeMaster._id, this.state.activeMaster)
    }

    loadCount() {
        const arrCategory = ['manicureStatus', 'pedicureStatus', 'eyelashesStatus',
            'eyebrowsStatus', 'shugaringStatus', 'hairStatus'];
        arrCategory.map(category => {
            let countMass = this.state.activeMaster[category].filter(
                item => item.active === true
            );
            let count = this.state.count;
            count[category] = countMass.length;
            this.setState({count: count});
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
        this.setState({[name]: mass});
        let countMass = this.state.activeMaster[name].filter(
            function (item) {
                //console.log(item);
                if (item.active === true) {
                    return item.active;
                } else {
                    return null
                }
            });
        let count = this.state.count;
        count[name] = countMass.length;
        this.setState({count: count});
        //console.log(this.state.activeMaster);
    };

    render() {
        //console.log(this.state);
        if (!this.state.activeMaster._id) {
            //console.log(this.state.activeMaster);
            return (<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Spinner size="large" style={{marginTop: 120}}/>
            </div>)
        } else {
            //console.log(this.state.activeMaster);
            return (
                <Div>
                    <Cell
                        size="l"
                        description={'Показывать в поиске'}
                        before={<Avatar src={this.state.activeMaster.avatarLink} size={80}/>}
                    >
                        {this.state.activeMaster.firstname + ' ' + this.state.activeMaster.lastname}
                    </Cell>
                    <Group>
                        <Cell
                            asideContent={<Switch
                                name={'showProfile'}
                                onChange={this.showProfile}
                                checked={this.state.activeMaster.showProfile}/>}>
                            Показывать мой профиль в поиске
                        </Cell>
                    </Group>
                    <Group title={'Прайс-лист'}>
                    {this.state.activeMaster.priceList.length === 0 &&
                    <Cell multiline>Вы еще не указали ни одной процедуры</Cell>
                    }
                    {this.state.activeMaster.priceList.map((item, index) => (
                        <List key={index}>
                            <Cell
                                key={item}
                                multiline
                                //onClick={() => this.setState({pedicureVisible: !this.state.pedicureVisible})}
                                removable
                                onRemove={() => {
                                    this.onRemove(index)
                                }}>
                                <Cell
                                    description="Название процедуры">{this.state.activeMaster.priceList[index].title}</Cell>
                                <Cell description="Краткое описание процедуры"
                                      multiline>{this.state.activeMaster.priceList[index].body}</Cell>
                                <Cell
                                    description="Минимальная цена за работу">{this.state.activeMaster.priceList[index].price}</Cell>
                            </Cell>
                        </List>
                    ))}
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
                                name={'about'}
                                status={this.state.about ? 'valid' : 'error'}
                                bottom={this.state.about ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                top="О себе"
                                value={this.state.about}
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
                                    this.state.activeMaster.manicureStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.pedicureStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.eyelashesStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.eyebrowsStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.shugaringStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.hairStatus.map((subcategory, index) => {
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
                                    this.state.activeMaster.cosmeticStatus.map((subcategory, index) => {
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
                        <Button size="xl"
                                onClick={() => this.patchData(BACKEND.masters.all + this.state.activeMaster._id, this.state.activeMaster)}>Сохранить
                            изменения</Button>
                    </Group>
                    {this.state.snackbar}
                </Div>
            );
        }
    }
}
export default Lk;