import React from 'react';
import {Group, Div, Cell, CardGrid, Card, Spinner} from "@vkontakte/vkui"
import bridge from "@vkontakte/vk-bridge";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMaster: this.props.activeMaster,
            isLoad: false
        };
    }
    componentDidMount() {
        this.setState({images: this.props.activeMaster.photos.reverse(), isLoad: true});
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