import React from 'react';
import {Group, Div, File, FormLayout, CardGrid, Card, Snackbar, Cell, PanelSpinner, Spinner} from "@vkontakte/vkui"
import {BACKEND} from '../func/func.js';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import bridge from '@vkontakte/vk-bridge';
import fetchJsonp from "fetch-jsonp";
import {connect} from "react-redux";

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMaster: {},
            photoArr: [],
            isLoad: false,
            photoFile: '',
            images: []
        };
    }
    componentDidMount() {
        this.setState({images: this.props.master.photos.reverse(), isLoad: true});
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
    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log(data));
    }
    uploadPhoto = () =>{
        try {
            if (this.state.uploadUrl === undefined) throw 'Ошибка. Не получена ссылка на загрузку фото.';
            if (this.state.token === undefined) throw 'Ошибка. Не получен токен пользователя.';
            this.setState({loading: true});
            const formData = new FormData();
            let selectedFile = document.getElementById('input').files[0];
            formData.append('master', this.props.master.firstname+' '+this.props.master.lastname );
            formData.append('uploadUrl', this.state.uploadUrl);
            formData.append('token', this.state.token);
            formData.append('file1', selectedFile);
            formData.append('masterId', this.props.master._id);
            fetch(BACKEND.vkapi.uploadPhoto, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(res => {
                    fetchJsonp(res.saveUrl, {
                        mode: 'no-cors',
                        method: 'GET'
                    })
                        .then(result => result.json())
                        .then(result =>{
                        const savePh = {
                            url: result.response[0].sizes[2].url,
                            params: this.props.params
                        };
                            fetch(BACKEND.vkapi.savePhoto, {
                                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                mode: 'cors', // no-cors, cors, *same-origin
                                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                credentials: 'same-origin', // include, *same-origin, omit
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                redirect: 'follow', // manual, *follow, error
                                referrer: 'no-referrer', // no-referrer, *client
                                body: JSON.stringify(savePh)
                            })
                                .then(res => res.json())
                                .then(res =>{
                                    let imgArr = this.state.images;
                                    imgArr.unshift(res.img);
                                    this.openSnack('Фото успешно загружено');
                                    this.setState({images: imgArr, loading: false});
                                })
                                .catch(e=>console.log(e))
                        })
                        .catch(e=>console.log(e))
                    // console.log(res);
                    // let imgArr = this.state.images;
                    // imgArr.unshift(res.img);
                    // this.openSnack('Фото успешно загружено');
                    // this.setState({images: imgArr, loading: false});
                })
                .catch(error => this.openSnack(error))
        } catch(e){
            this.openSnack(e);
        }

    };
    getUploadServer = (token) => {
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "photos.getUploadServer",
            "params": {"group_id": "193179174","album_id": "269622026", "v":"5.103", "access_token": token}})
            .then(result => {
                this.setState({uploadUrl: result.response.upload_url, token: token});
            })
            .catch(e => console.log(e))

    };
    getToken = () => {
        bridge.send("VKWebAppGetAuthToken", {"app_id": 7170938, "scope": "photos"})
            .then(data => {
                this.getUploadServer(data.access_token);
            })
            .catch(error => console.log(error))
    };
    gridPhoto() {
        if (this.state.images.length > 0) {
            return (
                <CardGrid>
                    {
                        this.state.images.map((image, index) => {
                            return (
                                <Card
                                    style={{padding: 2, borderRadius: 13, margin: 0}}
                                    size="s"
                                    mode="shadow"
                                    key={index}
                                    onClick={() => this.openShowImages(this.state.images, index)}
                                >
                                    <div style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover', borderRadius: 13}} />
                                </Card>
                            )
                        })
                    }
                </ CardGrid>
            )
        } else {
            return (<Cell>В вашем портфолио нет фотографий</Cell>)
        }
    }

    render(){
        if(this.state.isLoad===false){
            return (
                <Spinner size="large" style={{ marginTop: 20 }} />
            )
        } else {
            return (
                <Div>
                    {
                        this.state.loading ? <Div><Cell multiline>Подождите немного... Фотография сохраняется</Cell><PanelSpinner /></Div>: <Group title="">
                            <FormLayout>
                                <File
                                    accept="image/*"
                                    top="Добавьте фото в портфолио"
                                    before={<Icon24Camera />}
                                    size="l"
                                    onChange={this.uploadPhoto}
                                    onClick={this.getToken}
                                    id="input"
                                >
                                    Открыть галерею
                                </File>
                            </FormLayout>
                            <Group separator="hide">
                                {this.gridPhoto()}
                            </Group>
                        </Group>
                    }
                    {this.state.snackbar}
                </Div>
            )
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

export default connect(putStateToProps, putActionsToProps)(Portfolio);