import React from 'react';
import {Avatar, Button, Card, CardGrid, Cell, Div, Group, Header, Placeholder} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import bridge from "@vkontakte/vk-bridge";

export default class MastersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setTitle(this.props.mastersList.length);
        try {
            if (this.props.city === 'Не выбрано') throw 'Нет города';
            if (this.props.mastersList.length === 0) throw 'Никого не нашли';
        } catch (e) {
            this.setState({error: e})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.setState({error: null});
            try {
                if (this.props.city === 'Не выбрано') throw 'Нет города';
                if (this.props.mastersList.length === 0) throw 'Никого не нашли';
            } catch (e) {
                this.setState({error: e})
            }
        }
    }

    setTitle(count) {
        if (count === undefined){
            this.setState({title: 'Мы никого не нашли :( пока не нашли...'});
        } else {
            this.setState({title: 'Найдено мастеров: '+count});
        }
    }

    renderMasters() {
        return this.props.mastersList.map(master => {
            let ratingArrNew = master.comments.map(comment => {
                if (comment !== null) return Number(comment.rating)
            });
            let ratingArr = ratingArrNew.filter(Boolean);
            let sum = ratingArr.reduce((a, b) => a + b, 0);
            let rating = sum / ratingArr.length;
            return (
                <CardGrid key={master.vkUid}>
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
                              onClick={() => this.props.openPanelMaster(master)}
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
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866'})
            .then(result => this.props.openSnack('Спасибо, что помогаете сервису в развитии.'))
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
                    action={<Button onClick={() => this.share()} size="l">Поделиться</Button>}
                >
                    В данный момент у нас нет данных о специалистах этого профиля в Вашем городе. Мы расширяем базу
                    мастеров, и скоро - предложения появятся.
                    Поделитесь приложением с мастерами, которых Вы знаете.
                </Placeholder>
            )
        } else {
            return (
                <Group separator="hide" header={<Header mode="secondary">{this.state.title}</Header>}>
                    {this.renderMasters()}
                </Group>
            )
        }
    }
}