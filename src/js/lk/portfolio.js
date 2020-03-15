import React from 'react';
import {Group, Div, File, FormLayout, CardGrid, Card} from "@vkontakte/vkui"
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {}
        };
    }
    componentDidMount() {
        console.log(this.props)
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
                        <CardGrid>
                            <Card size="s">
                                <div style={{ height: 96 }} />
                            </Card>
                            <Card size="s">
                                <div style={{ height: 96 }} />
                            </Card>
                            <Card size="s">
                                <div style={{ height: 96 }} />
                            </Card>
                        </CardGrid>
                    </Group>
                </Group>
            </Div>
        );
    }
}

export default MastersCard;