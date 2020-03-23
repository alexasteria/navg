import React from 'react';
import {Group, Div, File, FormLayout, CardGrid, Card, Spinner, Button, Snackbar, Avatar} from "@vkontakte/vkui"
import {BACKEND} from '../func/func.js';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
//import bridge from '@vkontakte/vk-bridge-mock';
import bridge from '@vkontakte/vk-bridge';

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {},
            photoArr: [],
            isLoad: false,
            photoFile: ''
        };
    }
    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
            .then(response => response.json())
            .then(photoArr => {
                const images = photoArr.map(photo => {
                    return photo.url
                });
                //console.log(images);
                this.setState({images: images, isLoad: true});
                this.getToken();
            });
        //console.log(this.props)
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
        const formData = new FormData();
        let selectedFile = document.getElementById('input').files[0];
        formData.append('token', this.state.token);
        formData.append('file1', selectedFile);
        console.log(formData);
        fetch(BACKEND.vkapi.loadphoto, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    this.openSnack(response.message);
                    console.log(response)
                })
                .catch(error => this.openSnack(error))

    }
    getToken = () => {
        bridge.send("VKWebAppGetAuthToken", {"app_id": 7170938, "scope": "photos"})
            .then(data => {
                console.log('Токен '+data.access_token);
                this.setState({token: data.access_token})
            })
            .catch(error => console.log(error))
    }
    gridPhoto() {
        return (
            <CardGrid>
                {
                    this.state.images.map((image, index) => {
                        //console.log(image, index);
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
    }

    render(){
        if(this.state.isLoad===false){
            return (
                <Spinner size="large" style={{ marginTop: 20 }} />
            )
        } else {
            return (
                <Div>
                    <Group title="">
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
                    {this.state.snackbar}
                </Div>
            )
        }
    }
}

export default MastersCard;