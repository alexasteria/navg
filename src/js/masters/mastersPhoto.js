import React from 'react';
import {Group, Div, Gallery, CardGrid, Card, Spinner, FormLayout, File} from "@vkontakte/vkui"
import bridge from "@vkontakte/vk-bridge";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {},
            isLoad: false
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
                this.setState({images: images});
                this.setState({isLoad: true});
            })
        console.log('photo ', this.state.activeMasterId)
    }
    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log(data));
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