import React from 'react';
import {
    FormLayout,
    Button,
    Cell,
    Select,
    Textarea,
    Separator,
    CardGrid, Card, File, Snackbar, Spinner, Banner, Switch, Div, CardScroll, Placeholder, Footer
} from "@vkontakte/vkui";
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'
import fetchJsonp from "fetch-jsonp";
import bridge from "@vkontakte/vk-bridge";
import FindCard from "../findmodel/components/findCard";
import {connect} from "react-redux";
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline';
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
            visible: true,
            targetImg: []
        };
    }
    componentDidMount() {
        fetch(BACKEND.findModel.onMasterId+this.props.master._id)
            .then(res => res.json())
            .then(find => {
                if (find.length > 0) {
                    let targetImg = [];
                    find[0].images.map(photo=>{
                        if (this.props.master.photos.includes(photo)) targetImg.push(photo)
                    });
                    this.setState({targetImg: targetImg, loadFind: find[0], body:find[0].body, visible:find[0].visible,  error: '', isLoaded: true, selectvalue: find[0].sale, isActive: true});
                } else {
                    let error = <Cell multiline>У Вас нет активных постов о поиске</Cell>;
                    this.setState({error: error, isLoaded: true});
                }
            });
    }

    targetImg = (url) => {
        try{
            if (this.state.targetImg.includes(url)){
                let targetImg = this.state.targetImg;
                let index = targetImg.indexOf(url);
                if (index > -1) {
                    targetImg.splice(index, 1);
                } else targetImg.splice(0, index);
                this.setState({targetImg: targetImg});
            } else {
                let targetImg = this.state.targetImg;
                if(targetImg.length >2) throw 'Выделить можно только 3 фотографии.';
                targetImg.push(url);
                this.setState({targetImg: targetImg});
            }
        }catch(e){
            this.openSnack(e)
        }
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
            if (this.state.body.replace(/ +/g, ' ').trim().length === 0) throw 'Пустое сообщение недопустимо.';
            if (this.state.body.replace(/ +/g, ' ').trim().length > 250) throw 'Максимальная длина сообщения - 250 символов.';
            if(this.state.targetImg.length < 3) throw 'Необходимо выбрать 3 фотографии из портфолио.';
            if(this.state.selectvalue === 'Укажите тип акции') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.';
            if(this.state.selectvalue === '') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.';
            // let images = [];
            // this.props.master.photos.map((image,i)=> {
            //     if (i < 3){
            //         images.push(image)
            //     }
            // });
            if (this.state.isActive === true) {
                let find = this.state.loadFind;
                find.body = this.state.body;
                find.images = this.state.targetImg;
                find.sale = this.state.selectvalue;
                find.visible = this.state.visible;
                find.params = this.props.params;
                this.patchData(BACKEND.findModel.new+this.state.loadFind._id, find);
            } else {
                let find =this.state.loadFind;
                find.body = this.state.body;
                // find.masterId = this.state.activeMaster._id;
                // find.location = this.state.activeMaster.location;
                // find.firstname = this.state.activeMaster.firstname;
                // find.lastname = this.state.activeMaster.lastname;
                // find.avatarLink = this.state.activeMaster.avatarLink;
                find.images = this.state.targetImg;
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
                this.openSnack('Информация успешно обновлена.')
            })
            .catch(e=>{
                this.openSnack('Не удалось обновить данные.');
                console.log(e)
            })
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
                                {/*<CardGrid>*/}
                                    {
                                        this.props.master.photos.length > 0 ?
                                            <Div style={{webkitUserSelect: 'none', userSelect: 'none'}}>
                                                <Cell>Выполненые работы мастера</Cell>
                                                <CardScroll>
                                                    {
                                                        this.props.master.photos.map((photoUrl, index) => {
                                                            return (
                                                                <Card
                                                                    style={{padding: 2, borderRadius: 13, margin: 0}}
                                                                    size="s"
                                                                    mode="shadow"
                                                                    key={index}
                                                                    onClick={() => this.targetImg(photoUrl)}
                                                                >
                                                                    {
                                                                        this.state.targetImg.includes(photoUrl) ?
                                                                        <div style={{width: 144, height: 96, backgroundImage: 'url('+photoUrl+')', backgroundSize: 'cover', borderRadius: 13}}><div style={{backgroundColor: 'grey', borderRadius: '13px 13px 0 0', textAlign: 'center'}}>Выбрано</div></div> :
                                                                        <div style={{width: 144, height: 96, backgroundImage: 'url('+photoUrl+')', backgroundSize: 'cover', borderRadius: 13}} />
                                                                    }
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </CardScroll>
                                            </Div> :
                                            <Cell multiline>У Вас в портфолио нет фото, разместить объявление о поиске можно, имея в портфолио не менее 3-х фотографий.</Cell>
                                    }
                                {/*{*/}
                                {/*    this.props.master.photos.length > 0 ?*/}
                                {/*    this.props.master.photos.map((image,i)=>{*/}
                                {/*        if (i < 3){*/}
                                {/*            return (*/}
                                {/*                <Card size='s' key={i}>*/}
                                {/*                    <div*/}
                                {/*                        style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}}*/}
                                {/*                    >*/}
                                {/*                    </div>*/}
                                {/*                </Card>*/}
                                {/*            )*/}
                                {/*        }*/}
                                {/*    }) : 'У вас в портфолио нет фото, разместить объявление о поиске можно, имея в портфолио не менее 3-х фотографий'*/}
                                {/*}*/}
                                {/*</CardGrid>*/}
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
                                <React.Fragment>
                                    <Cell description={'Некликабельно'}>Ваш пост будет выглядеть так:</Cell>
                                    <FindCard
                                        date={this.getDate(this.state.loadFind.date)}
                                        key={this.state.loadFind._id}
                                        find={this.state.loadFind}
                                        openMasterOnId={this.props.openMasterOnId}
                                    />
                                </React.Fragment>
                            }
                            <Footer/>
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