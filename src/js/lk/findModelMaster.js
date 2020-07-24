import React from 'react';
import {
    FormLayout,
    Button,
    Cell,
    Select,
    Textarea,
    Separator,
    CardGrid, Card, File, Snackbar, Spinner, Banner, Switch
} from "@vkontakte/vkui";
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'
import fetchJsonp from "fetch-jsonp";
import bridge from "@vkontakte/vk-bridge";
import FindCard from "../findmodel/components/findCard";
import {connect} from "react-redux";
import Icon24DismissSubstract from '@vkontakte/icons/dist/24/dismiss_substract';


class FindModelMaster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMaster: '',
            body: '',
            isLoaded: false,
            isActive: false,
            error: '',
            loading: false,
            images: [],
            loadFind: {
                images: []
            },
            selectvalue: 'Укажите тип акции',
            visible: true
        };
    }
    componentDidMount() {
        fetch(BACKEND.findModel.onMasterId+this.props.master._id)
            .then(res => res.json())
            .then(find => {
                if (find.length > 0) {
                    console.log(find);
                    this.setState({loadFind: find[0], body:find[0].body, visible:find[0].visible,  error: '', isLoaded: true, selectvalue: find[0].sale, isActive: true});
                } else {
                    let error = <Cell>У вас нет активных поисков</Cell>;
                    this.setState({error: error, isLoaded: true});
                }
            });
    }

    openSnack (text) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                >
                    {text}
                </Snackbar>
        });
    }

    handleChangeSelect = (event) => {
        this.setState({selectvalue: event.target.value});
    };

    handleChange = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value});
    };
    save=()=>{
        try {
            if(this.props.master.photos.length < 3) throw 'В портфолио должно быть не менее 3-х фотографий';
            if(this.state.selectvalue === 'Укажите тип акции') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.';
            if(this.state.selectvalue === '') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.';
            if (this.state.body.length === 0) throw 'Пустое сообщение недопустимо';
            let images = [];
            this.props.master.photos.map((image,i)=> {
                if (i < 3){
                    images.push(image)
                }
            });
            if (this.state.isActive === true) {
                let find =this.state.loadFind;
                find.body = this.state.body;
                find.images = images;
                find.sale = this.state.selectvalue;
                find.visible = this.state.visible;
                find.params = this.props.params;
                this.patchData(BACKEND.findModel.new+this.state.loadFind._id, find);
                this.openSnack('Информация успешно обновлена.')
            } else {
                let find =this.state.loadFind;
                find.body = this.state.body;
                // find.masterId = this.state.activeMaster._id;
                // find.location = this.state.activeMaster.location;
                // find.firstname = this.state.activeMaster.firstname;
                // find.lastname = this.state.activeMaster.lastname;
                // find.avatarLink = this.state.activeMaster.avatarLink;
                find.images = images;
                find.sale = this.state.selectvalue;
                find.visible = this.state.visible;
                find.params = this.props.params;
                    fetch(BACKEND.findModel.new, {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, cors, *same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrer: 'no-referrer', // no-referrer, *client
                        body: JSON.stringify(find), // тип данных в body должен соответвовать значению заголовка "Content-Type"
                    })
                        .then(res => res.json())
                        .then(res=>{
                            this.setState({loadFind: res.find, isActive: true});
                            if (res.mStatus === false){
                                this.setState({visible: false});
                                this.openSnack('Объявление о поиске модели создано, но пока не показывается. Его можно активировать сразу после прохождения модерации профиля мастера.')
                            } else {
                                this.openSnack('Объявление о поиске модели успешно создано.')
                            }
                        })
                        .catch(e=>console.log(e));
                //this.postData(BACKEND.findModel.new, find);
            }
        } catch(e) {
            this.openSnack(e)
        }
    };
    patchData(url = '', data = {}) {
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
            .then(response=>response.json()) // парсит JSON ответ в Javascript объект
            .then(result=>{
                console.log(result);
            })
            .catch(e=>console.log(e))
    }
    getDate(comDate) {
        if (comDate === 'Только что') {
            return comDate;
        } else {
            let date = new Date(comDate);
            let hours = date.getHours();
            if (hours < 10) hours = '0'+hours;
            let minutes = date.getMinutes();
            if (minutes < 10) minutes = '0'+minutes;
            let date1 = date.getDate();
            if (date1 < 10) date1 = '0'+date1;
            let month = date.getMonth();
            if (month < 10) month = '0'+month;
            return date1+'.'+month+'.'+date.getFullYear()+' в '+hours+':'+minutes;
        }
    }
    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        fetch(url, {
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
            .then(response=>response.json()) // парсит JSON ответ в Javascript объект
            .then(result=>{
                console.log(result);
                this.setState({loadFind: result, isActive: true})
            })

    }

    // deleteImage(index){
    //     let find = this.state.loadFind;
    //     if (index > -1) {
    //         find.images.splice(index, 1);
    //     } else find.images.splice(0, index);
    //     this.setState({activeFind: find}, ()=> this.save())
    // }

    render(){
        if (this.state.isLoaded === false){
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <React.Fragment>
                            <Banner
                                header="Мастер ищет модель"
                                subheader="Правила размещения"
                                text="В данной категории можно разместиться, если вы предлагаете услуги по специальным условиям. Сейчас доступно три варианта: скидка 50%, оплата только за расходные материалы или полностью бесплатно, например, для пополнения портфолио."
                            />
                            <FormLayout>
                                <Textarea
                                    name={'body'}
                                    top="Основное сообщение"
                                    value={this.state.body}
                                    onChange={this.handleChange}
                                />
                                <CardGrid>
                                {
                                    this.props.master.photos.length > 0 ?
                                    this.props.master.photos.map((image,i)=>{
                                        return (
                                            <Card size='s' key={i}>
                                                <div
                                                    style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}}
                                                >
                                                </div>
                                            </Card>
                                        )
                                    }) : 'У вас в портфолио нет фото, разместить объявление о поиске можно, имея в портфолио не менее 3-х фотографий'
                                }
                                </CardGrid>
                                <Select value={this.state.selectvalue} onChange={this.handleChangeSelect} top="Тип акции" placeholder="Выберите тип акции">
                                    <option value="Скидка 50%">Скидка 50%</option>
                                    <option value="Оплата за материалы">Оплата за материалы</option>
                                    <option value="Бесплатно">Бесплатно</option>
                                </Select>
                                <Cell
                                    asideContent={<Switch
                                        onChange={()=>{
                                            if (this.props.master.moderation.status === true){
                                                this.setState({visible: !this.state.visible})
                                            } else {
                                                this.openSnack('Ваш профиль находится на модерации. Вы можете создать объявление уже сейчас, но до завершения проверки пользователи его не увидят.')
                                            }
                                        }}
                                        checked={this.props.master.moderation.status === true ? this.state.visible : false}/>}>
                                    Показывать объявление в поиске
                                </Cell>
                            <Button size="xl" onClick={this.save}>Сохранить</Button>
                            </FormLayout>
                            <Separator style={{ margin: '12px 0' }} />
                            {
                                this.state.isActive &&
                                <FindCard
                                    date={this.getDate(this.state.loadFind.date)}
                                    key={this.state.loadFind._id}
                                    find={this.state.loadFind}
                                    openMasterOnId={this.props.openMasterOnId}
                                />
                            }
                            {this.state.snackbar}
                </React.Fragment>
            );
        }

    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master,
        params: state.params
    };
};

const putActionsToProps = (dispatch) => {
    return {

    };
};

export default connect(putStateToProps, putActionsToProps)(FindModelMaster);