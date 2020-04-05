import React from 'react';
import {Group, Div, Cell, CardGrid, Card, Spinner, FormLayout, File} from "@vkontakte/vkui"
import bridge from "@vkontakte/vk-bridge";
import {BACKEND} from "../func/func";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMaster: this.props.activeMaster,
            isLoad: false
        };
    }
    componentDidMount() {
        //console.log(this.props);
        this.setState({images: this.props.activeMaster.photos.reverse(), isLoad: true});
        // fetch(BACKEND.masters.vkuid + this.props.user.vkUid)
        //     .then(res => res.json())
        //     .then(activeMaster => {
        //         this.setState({activeMaster: activeMaster[0], images: activeMaster[0].photos, isLoad: true});
        //         console.log(activeMaster[0]);
        //     });

        // fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
        //     .then(response => response.json())
        //     .then(photoArr => {
        //         const images = photoArr.map(photo => {
        //             return photo.url
        //         });
        //         //console.log(images);
        //         this.setState({images: images});
        //         this.setState({isLoad: true});
        //     })
        // console.log('photo ', this.state.activeMasterId)
    }
    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log(data));
    }
    gridPhoto() {
        if (this.state.images.length === 0) {
            return (
                <Cell multiline>У мастера еще нет фотографий в портфолио</Cell>
            )
        } else {
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
    }
    render(){
        if(this.state.isLoad===false){
            return (
                <Spinner size="large" style={{ marginTop: 20 }} />
            )
        } else {
            return (
                <Div>
                    <Group title="Портфолио">
                        <Group separator="hide">
                            {this.gridPhoto()}
                        </Group>
                    </Group>
                </Div>
            )
        }
    }
}

export default MastersCard;