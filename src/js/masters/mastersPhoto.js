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
                        slideWidth="100%"
                        style={{ height: "80vh" }}
                        bullets="dark"
                    >
                        <div style={{
                            backgroundImage: "url(https://i.pinimg.com/474x/9a/57/f0/9a57f0e84191e278d840a5536ebab34c.jpg)",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat' }} />
                        <div style={{
                            backgroundImage: "url(https://avatars.mds.yandex.net/get-zen_doc/1554513/pub_5d77a5dd74f1bc00ad79c9f1_5d77a5f198930900ae483c74/scale_1200)",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat' }} />
                        <div style={{
                            backgroundImage: "url(https://womans.ws/wp-content/uploads/2019/10/1523527373_44-1068x1068.jpg)",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat' }} />
                        <div style={{ backgroundColor: 'var(--button_commerce_background)' }} />
                        <div style={{ backgroundColor: 'var(--accent)' }} />
                    </Gallery>
                </Group>
            </Div>
        );
    }
}

export default MastersCard;