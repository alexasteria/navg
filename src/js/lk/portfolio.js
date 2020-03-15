import React from 'react';
import {Group, Div, File, FormLayout, CardGrid, Card} from "@vkontakte/vkui"
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {},
            photoArr: []
        };
    }
    componentDidMount() {
        fetch('http://jsonplaceholder.typicode.com/photos?albumId=1')
            .then(response => response.json())
            .then(photoArr => {
                this.setState({photoArr: photoArr})
            })
        console.log(this.props)
    }
    gridPhoto() {
        return (
            <CardGrid>
                {
                    this.state.photoArr.map(photo => {
                        //console.log(photo);
                        return (
                            <Card size="s" mode="shadow" key={photo.id}>
                                <div style={{height: 96, backgroundImage: 'url('+photo.url+')'}} />
                            </Card>
                        )
                    })
                }
            </ CardGrid>
        )
    }
    render(){
        return (
            <Div>
                <Group title="">
                    <FormLayout>
                        <File top="Загрузите ваше фото" before={<Icon24Camera />} size="l">
                            Открыть галерею
                        </File>
                    </FormLayout>
                    <Group separator="hide">
                            {this.gridPhoto()}
                    </Group>
                </Group>
            </Div>
        );
    }
}

export default MastersCard;