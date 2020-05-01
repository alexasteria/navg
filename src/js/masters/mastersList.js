import React from 'react';
import {Avatar, Button, Card, CardGrid, Cell, Div, Placeholder, Spinner} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import bridge from "@vkontakte/vk-bridge";

export default class MastersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log(this.props)
        try {
            if (this.props.city === 'Не выбрано') throw 'Нет города';
            if (this.props.mastersList.length === 0) throw 'Никого не нашли';
        } catch (e) {
            this.setState({error: e})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.setState({error: null})
            try {
                if (this.props.city === 'Не выбрано') throw 'Нет города';
                if (this.props.mastersList.length === 0) throw 'Никого не нашли';
            } catch (e) {
                this.setState({error: e})
            }
        }
    }

    renderMasters() {
        return this.props.mastersList.map(master => {
            let ratingArr = master.comments.map(comment => {
                return Number(comment.rating)
            });
            let sum = ratingArr.reduce((a, b) => a + b, 0);
            let rating = sum / ratingArr.length;
            return (
                <CardGrid key={master.vkUid} style={{padding: 0}}>
                    <Card size="l" mode="shadow">
                        <Cell expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                              description={
                                  master.categories.category.map(category => {
                                      return category.label + " "
                                  })
                              }
                              bottomContent={
                                  this.setBottom(rating, ratingArr.length)
                              }
                              before={<Avatar src={master.avatarLink} size={70}/>}
                              size="l"
                              onClick={() => this.props.openPanelMaster('masterInfo', master)}
                        >{master.firstname} {master.lastname}
                        </Cell>
                    </Card>
                </CardGrid>
            );
        })
    };

    setBottom = (rating, length) => {
        if (length > 0) {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9"}}>
                    Рейтинг {rating} из {length} отзывов
                </Div>
            )
        } else {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9"}}>
                    Отзывы отсутствуют
                </Div>
            )
        }
    };

    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866#masterid='+this.state.activeMaster._id})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };

    render() {
        if (this.state.error === 'Нет города') {
            return (
                <Placeholder
                    icon={<Icon56UsersOutline/>}
                    header="Где вы?"
                >
                    Нам не удалось определить Ваш город, укажите его вручную.
                </Placeholder>
            )
        } else if (this.state.error === 'Никого не нашли') {
            return (
                <Placeholder
                    icon={<Icon56UsersOutline/>}
                    header="Не расстраивайтесь"
                    action={<Button onClick={this.share} size="l">Поделиться</Button>}
                >
                    В данный момент у нас нет данных о специалистах этого профиля в Вашем городе. Мы расширяем базу
                    мастеров, и скоро - предложения появятся.
                    Поделитесь приложением с мастерами, которых Вы знаете.
                </Placeholder>
            )
        } else {
            return (
                this.renderMasters()
            )
        }
    }
}