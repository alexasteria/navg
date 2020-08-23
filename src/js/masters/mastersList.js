import React from 'react';
import {Avatar, Button, Card, CardGrid, Cell, Div, Group, Header, Placeholder, Footer, PromoBanner} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import bridge from "@vkontakte/vk-bridge";
import {Ads} from "../elements/ads";

export default class MastersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promo: null
        };
    }

    componentDidMount() {
        this.setTitle(this.props.mastersList.length);
        try {
            if (this.props.city === 'Не выбрано') throw 'Нет города';
            if (this.props.mastersList.length === 0) throw 'Никого не нашли';
        } catch (e) {
            this.setState({error: e})
        }
        bridge.subscribe(e=>{
            if (!e.detail) {
                return;
            }

            const { type, data } = e.detail;

            if (type === 'VKWebAppGetAdsResult') {
                // Reading result of the Code Reader
                this.setState({promo: data})
            }

            if (type === 'VKWebAppGetAdsFailed') {
                // Reading result of the Code Reader
                console.log(data.error_data);
                this.setState({promo: data.error_data})
            }
        });
        bridge.send("VKWebAppGetAds", {})
            .then(data=>console.log('ads'))
            .catch(e=>console.log(e));
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
        let i = 0;
        return this.props.mastersList.map(master => {
            if (i === 6) i = 0;
            i++;
            return (
                <CardGrid key={master.vkUid}>
                    <Card size="l" mode="shadow">
                        <Cell
                            style={{borderRadius: '10px 10px 10px 10px'}}
                            expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                              description={
                                  master.categories.category.map(category => {
                                      return category.label + " "
                                  })
                              }
                              bottomContent={
                                  this.setBottom(master.meta)
                              }
                              before={<Avatar src={master.avatarLink} size={70}/>}
                              size="l"
                              onClick={() => this.props.openPanelMaster(master)}
                        >{master.firstname} {master.lastname}
                        </Cell>
                    </Card>
                    {/*{*/}
                    {/*    i === 5 && this.state.promo !== null ?*/}
                    {/*        <Card size="l" mode="shadow">*/}
                    {/*            <PromoBanner bannerData={ this.state.promo } />*/}
                    {/*        </Card> :*/}
                    {/*        null*/}
                    {/*}*/}
                </CardGrid>
            );
        });
    }

    setBottom = (meta) => {
        if (meta.comments > 0) {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9", webkitUserSelect: 'none', userSelect: 'none'}}>
                    Рейтинг {meta.rating} из {meta.comments} отзывов
                </Div>
            )
        } else {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9", webkitUserSelect: 'none', userSelect: 'none'}}>
                    Отзывы отсутствуют
                </Div>
            )
        }
    };

    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938'})
            .then(result => {
                if (result.type === 'VKWebAppShareResult'){
                    this.props.openSnack('Спасибо, что помогаете сервису в развитии.')
                }
            })
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
                    мастеров, и скоро предложения появятся.
                    Поделитесь приложением с мастерами, которых Вы знаете.
                </Placeholder>
            )
        } else {
            return (
                <Group separator="hide" header={<Header mode="secondary">{this.state.title}</Header>}>
                    {this.renderMasters()}
                    <Footer>На этом все. Мастеров всего - {this.props.mastersList.length}.</Footer>
                </Group>
            )
        }
    }
}