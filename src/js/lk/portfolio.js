import React from 'react';
import {Group, Div, File, FormLayout, CardGrid, Card, Snackbar, Cell, PanelSpinner} from "@vkontakte/vkui"
import {BACKEND} from '../func/func.js';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import bridge from '@vkontakte/vk-bridge';
import Spin from '../elements/spinner'
import fetchJsonp from "fetch-jsonp";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {},
            photoArr: [],
            isLoad: false,
            photoFile: '',
            images: []
        };
    }
    componentDidMount() {
        this.getToken();
        fetch(BACKEND.masters.vkuid + this.props.user.vkUid)
            .then(res => res.json())
            .then(activeMaster => {
               this.setState({activeMaster: activeMaster[0], images: activeMaster[0].photos.reverse(), isLoad: true});
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
    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log(data));
    }
    uploadPhoto = () =>{
        this.setState({loading: true});
        const formData = new FormData();
        let selectedFile = document.getElementById('input').files[0];
        formData.append('master', this.state.activeMaster.firstname+' '+this.state.activeMaster.lastname );
        formData.append('uploadUrl', this.state.uploadUrl);
        formData.append('token', this.state.token);
        formData.append('file1', selectedFile);
        fetch(BACKEND.vkapi.uploadPhoto, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    this.openSnack(response.message);
                    fetchJsonp(response.saveUrl, {
                        mode: 'no-cors',
                        method: 'GET'
                    })
                        .then(result => result.json())
                        .then(result => {
                            //console.log(result);
                            let newImg = result.response[0].sizes[2].url;
                            let imgArr = this.state.images;
                            imgArr.unshift(newImg);
                            this.setState({images: imgArr});
                            let data = {
                                masterId: this.state.activeMaster._id,
                                newImg: newImg
                            };
                            fetch(BACKEND.vkapi.savePhoto, {
                                mode: 'cors', // no-cors, cors, *same-origin
                                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                credentials: 'same-origin', // include, *same-origin, omit
                                headers: {
                                    'Content-Type': 'application/json',
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                method: 'POST',
                                body: JSON.stringify(data),
                                redirect: 'follow', // manual, *follow, error
                                referrer: 'no-referrer', // no-referrer, *client
                            })
                                .then(result => result.json())
                                .then(result => {
                                    this.openSnack(result.message);
                                    this.setState({loading: false});
                                })
                                .catch(error => this.openSnack(error))

                            })
                            .catch(error => this.openSnack(error))
                })
                .catch(error => this.openSnack(error))

    }
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
    }
    gridPhoto() {
        if (this.state.images.length > 0) {
            return (
                <CardGrid>
                    {
                        this.state.images.map((image, index) => {
                            return (
                                <Card
                                    size="s"
                                    mode="shadow"
                                    key={index}
                                    onClick={() => this.openShowImages(this.state.images, index)}
                                >
                                    <div style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}} />
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
                <Spin/>
            )
        } else {
            return (
                <Div>
                    {
                        this.state.loading ? <Div><Cell multiline>Подождите немного... Фотография сохраняется</Cell><PanelSpinner /></Div>: <Group title="">
                            <FormLayout>
                                <File
                                    top="Добавьте фото в портфолио"
                                    before={<Icon24Camera />}
                                    size="l"
                                    onChange={this.uploadPhoto}
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

export default MastersCard;