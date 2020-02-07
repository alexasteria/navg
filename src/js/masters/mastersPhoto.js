import React from 'react';
import {Group, Div, Gallery} from "@vkontakte/vkui"

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMasterId: this.props.activeMasterId,
            activeMaster: {}
        };
    }
    componentDidMount() {
        console.log('photo ', this.state.activeMasterId)
    }

    render(){
        return (
            <Div>
                <Group title="">
                    <Gallery
                        slideWidth="90%"
                        style={{ height: 150 }}
                        bullets="dark"
                    >
                        <div style={{ backgroundColor: 'var(--destructive)' }} />
                        <div style={{ backgroundColor: 'var(--button_commerce_background)' }} />
                        <div style={{ backgroundColor: 'var(--accent)' }} />
                    </Gallery>
                </Group>
            </Div>
        );
    }
}

export default MastersCard;