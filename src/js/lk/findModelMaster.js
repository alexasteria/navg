import React from 'react';
import {
    FormLayout,
    Button,
    Cell,
    Select,
    Textarea,
    Separator,
    CardGrid, Card, File, Snackbar, Spinner, Banner
} from "@vkontakte/vkui";
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'
import fetchJsonp from "fetch-jsonp";
import bridge from "@vkontakte/vk-bridge";
import FindCard from "../findmodel/components/findCard";
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
            selectvalue: 'Укажите тип акции'
        };
    }
    componentDidMount() {
        //this.getToken();
        fetch(BACKEND.masters.vkuid+this.props.user.vkUid)
            .then(res => res.json())
            .then(activeMaster => {
                this.setState({activeMaster: activeMaster[0]});
                fetch(BACKEND.findModel.onMasterId+activeMaster[0]._id)
                    .then(res => res.json())
                    .then(find => {
                        if (find.length > 0) {
                            console.log(find);
                            this.setState({loadFind: find[0], body:find[0].body, error: '', isLoaded: true, selectvalue: find[0].sale, isActive: true});
                        } else {
                            let error = <Cell>У вас нет активных поисков</Cell>;
                            this.setState({error: error, isLoaded: true});
                        }
                    });
            });
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
                >
                    {text}
                </Snackbar>
        });
    }

    // getToken = () => {
    //     bridge.send("VKWebAppGetAuthToken", {"app_id": 7170938, "scope": "photos"})
    //         .then(data => {
    //             this.getUploadServer(data.access_token);
    //         })
    //         .catch(error => console.log(error))
    // };

    // getUploadServer = (token) => {
    //     bridge.send("VKWebAppCallAPIMethod", {
    //         "method": "photos.getUploadServer",
    //         "params": {"group_id": "193179174","album_id": "269622026", "v":"5.103", "access_token": token}})
    //         .then(result => {
    //             this.setState({uploadUrl: result.response.upload_url, token: token});
    //         })
    //         .catch(e => console.log(e))
    //
    // };

    // uploadPhoto = () =>{
    //     try {
    //         if (this.state.loadFind){
    //             if (this.state.loadFind.images.length >= 3) throw 'Можно загрузить только 3 фотографии в разделе Мастер ищет модель';
    //         }
    //         this.setState({loading: true});
    //         const formData = new FormData();
    //         let selectedFile = document.getElementById('input').files[0];
    //         formData.append('master', this.state.activeMaster.firstname+' '+this.state.activeMaster.lastname );
    //         formData.append('uploadUrl', this.state.uploadUrl);
    //         formData.append('token', this.state.token);
    //         formData.append('file1', selectedFile);
    //         fetch(BACKEND.vkapi.uploadPhoto, {
    //             method: 'POST',
    //             body: formData
    //         })
    //             .then(res => res.json())
    //             .then(response => {
    //                 fetchJsonp(response.saveUrl, {
    //                     mode: 'no-cors',
    //                     method: 'GET'
    //                 })
    //                     .then(result => result.json())
    //                     .then(result => {
    //                         console.log(result);
    //                         let newImg = result.response[0].sizes[2].url;//адрес фото
    //                         let imgArr = this.state.images;
    //                         let data = {
    //                             findId: this.state.loadFind,
    //                             newImg: newImg
    //                         };
    //                         let loadFind = this.state.loadFind;
    //                         loadFind.images.push(newImg);
    //                         this.setState({loading: false, loadFind: loadFind}, ()=>this.save());
    //                     })
    //                     .catch(error => console.log(error))
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //                 this.openSnack(error);
    //             })
    //     } catch (e) {
    //         this.openSnack(e);
    //     }
    //
    // };

    handleChangeSelect = (event) => {
        this.setState({selectvalue: event.target.value});
    };

    handleChange = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value});
    };
    save=()=>{
        try {
            if(this.state.selectvalue === 'Укажите тип акции') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.';
            if (this.state.body.length === 0) throw 'Пустое сообщение недопустимо';
            let images = [];
            this.state.activeMaster.photos.map((image,i)=> {
                if (i < 3){
                    images.push(image)
                }
            });
            if (this.state.isActive === true) {
                let find =this.state.loadFind;
                find.body = this.state.body;
                find.images = images;
                find.sale = this.state.selectvalue;
                console.log('измененный',find);
                this.setState({loadFind: find});
                this.patchData(BACKEND.findModel.new+this.state.loadFind._id, find);
                this.openSnack('Информация успешно обновлена.')
            } else {
                let find =this.state.loadFind;
                find.body = this.state.body;
                find.masterId = this.state.activeMaster._id;
                find.location = this.state.activeMaster.location;
                find.firstname = this.state.activeMaster.firstname;
                find.lastname = this.state.activeMaster.lastname;
                find.avatarLink = this.state.activeMaster.avatarLink;
                find.images = images;
                find.sale = this.state.selectvalue;
                this.postData(BACKEND.findModel.new, find);
                this.openSnack('Информация о поиске успешно размещена.')
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
                                    this.state.activeMaster.photos.length > 0 ?
                                    this.state.activeMaster.photos.map((image,i)=>{
                                        return (
                                            <Card size='s' key={i}>
                                                <div
                                                    style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}}
                                                >
                                                </div>
                                            </Card>
                                        )
                                    }) : 'У вас в портфолио нет фото'
                                }
                                </CardGrid>
                                <Select value={this.state.selectvalue} onChange={this.handleChangeSelect} top="Тип акции" placeholder="Выберите тип акции">
                                    <option value="Скидка 50%">Скидка 50%</option>
                                    <option value="Оплата за материалы">Оплата за материалы</option>
                                    <option value="Бесплатно">Бесплатно</option>
                                </Select>
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

export default FindModelMaster;