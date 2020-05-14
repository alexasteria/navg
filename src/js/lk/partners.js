import React from 'react';
import {Banner, Button} from "@vkontakte/vkui"
import bridge from "@vkontakte/vk-bridge";

class Partners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async addToCommunity() {
        await bridge.send("VKWebAppAddToCommunity", {}).then(data=>console.log(data));
    };

    render(){
        return (
            <React.Fragment>
                <Banner
                    header="Установите в ваше сообщество"
                    asideMode="dismiss"
                    subheader="Если вы являетесь владельцем сообщества со схожей тематикой нашего приложения, установите Навигатор красоты в свою группу. Ваши подписчики смогут получить удобный инструмент для поиска мастеров."
                    actions={<Button onClick={()=>this.addToCommunity()}>Установить в сообщество</Button>}
                />
            </React.Fragment>
        );
    }
}

export default Partners;