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
    List, Button, CellButton, Input, Spinner,Snackbar, Tooltip
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
                this.setState({activeMaster: activeMaster[0], description: activeMaster[0].description});
            });
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    patchData(url = '', activeMaster = {}) {
        //console.log(activeMaster);
        activeMaster.description = this.state.description;

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
    visible = event => {
        const target = event.target;
        const name = target.name;
        let activeMaster = this.state.activeMaster;
        activeMaster[name] = !activeMaster[name];
        this.setState({activeMaster: activeMaster});
    };
    onRemove = (index) => {
        let activeMaster = this.state.activeMaster;
        activeMaster.priceList = [...this.state.activeMaster.priceList.slice(0, index), ...this.state.activeMaster.priceList.slice(index + 1)];
        this.setState({activeMaster: activeMaster});
        this.patchData(BACKEND.masters.all + this.state.activeMaster._id, this.state.activeMaster)
        this.openSnack("Процедура удалена")
    };
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

    counter = (index) => {
        let countMass = this.state.activeMaster.categories[index].subcat.filter(
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

    checkSubcat = event => {
        const target = event.target;
        const indexCat = target.name;
        const indexSubcat = target.id;
        let activeMaster = this.state.activeMaster;
        activeMaster.categories[indexCat].subcat[indexSubcat].active = !this.state.activeMaster.categories[indexCat].subcat[indexSubcat].active;
        if (this.counter(indexCat) > 0) {
            activeMaster.categories[indexCat].active = true;
        } else {
            activeMaster.categories[indexCat].active = false;
        }
        this.setState({activeMaster: activeMaster});
    };

    render() {
        if (!this.state.activeMaster._id) {
            return (<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Spinner size="large" style={{marginTop: 120}}/>
            </div>)
        } else {
            return (
                <Div>
                    <Cell
                        size="l"
                        description={
                            this.state.activeMaster.visible ? 'Ваш профиль доступен в поиске' : 'Ваш профиль не выводится в поиске'
                        }
                        before={<Avatar src={this.state.activeMaster.avatarLink} size={80}/>}
                    >
                        {this.state.activeMaster.firstname + ' ' + this.state.activeMaster.lastname}
                    </Cell>
                    <Group>
                        <Cell
                            asideContent={<Switch
                                name={'visible'}
                                onChange={this.visible}
                                checked={this.state.activeMaster.visible}/>}>
                            Показывать профиль в поиске
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
                                name={'description'}
                                status={this.state.description ? 'valid' : 'error'}
                                bottom={this.state.description ? '' : 'Пожалуйста, напишите пару слов о себе'}
                                top="О себе"
                                value={this.state.description}
                                onChange={this.handleChange}/>
                        </ FormLayout>
                        <FormLayoutGroup top="Сфера деятельности"
                                         bottom="Укажите вид работы, в соответствии с тем, что вы выполняете. Так вас будет проще найти."
                                         id={'category'}>
                            {
                                this.state.activeMaster.categories.map((category, i) => {
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