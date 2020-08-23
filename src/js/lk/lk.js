import React from 'react';
import {
    Div,
    Separator,
    CellButton,
    Avatar,
    Cell,
    List,
    Group,
    Banner,
    Button,
    Card,
    CardGrid,
    RichCell,
    Caption, PromoBanner, FixedLayout
} from "@vkontakte/vkui"
import Icon24Story from '@vkontakte/icons/dist/24/story';
import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";

class Lk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connection: false,
            tmpUser: [],
            isMaster: false,
            isUser: false,
            favsArr: [],
            mastersArr: [],
            countFavs: 0,
            promo: null
        };
    }

    componentDidMount() {
        bridge.subscribe(e=>{
            if (!e.detail) {
                return;
            }

            const { type, data } = e.detail;

            if (type === 'VKWebAppGetAdsResult') {
                this.setState({promo: data})
            }

            if (type === 'VKWebAppGetAdsFailed') {
                // Reading result of the Code Reader
                console.log(data.error_data);
                //this.setState({promo: data.error_data})
            }
        });
        bridge.send("VKWebAppGetAds", {})
            .then(data=>console.log('Ads'))
            .catch(e=>console.log(e));
    }

    checkModeration = () => {
        if (this.props.master.moderation.status === false) {
            if (this.props.master.moderation.reasons.length > 0) {
                return (
                    <CardGrid>
                        <Card size='xl'>
                            <Cell description={'Их необходимо исправить'}>При модерации обнаружены ошибки:</Cell>
                            {
                                this.props.master.moderation.reasons.map((reason, index)=>{
                                    return <Cell key={index}>{reason}</Cell>
                                })
                            }
                        </Card>
                    </CardGrid>
                )
            } else {
                return (
                    <CardGrid>
                        <Card size='xl'>
                            <Cell multiline>Ваш профиль на проверке. В течение суток он будет доступен в поиске.</Cell>
                        </Card>
                    </CardGrid>
                )
            }
        }
    };

    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => console.log('ok')); // парсит JSON ответ в Javascript объект

    }

    addToFavApp = () => {
        bridge.send("VKWebAppAddToFavorites", {}).then(data=>console.log(data));
    };

    render(){
        return (
            <React.Fragment>
                <Group separator={'hide'}>
                    <CardGrid>
                        <Card size="l">
                            <RichCell
                                disabled
                                multiline
                                before={<Avatar src={this.props.user.avatarLink} size={62}/>}
                                text={
                                    <Caption level="2" weight="regular" style={{ marginBottom: 15 }}>
                                        {this.props.master ? this.props.master.type : 'Пользователь'}
                                    </Caption>
                                }
                                caption={this.props.master && this.props.master.location.city.title}
                                after={this.props.master !== null && <Icon24Write onClick={this.props.openSetting}/>}
                            >
                                {this.props.user.firstname+' '+this.props.user.lastname}
                            </RichCell>
                        </Card>
                    </CardGrid>
                </Group>
                {this.props.master !== null && this.checkModeration()}
                    <Group title="Основное" separator={'hide'}>
                        <List>
                            <Cell
                                expandable
                                before={<Icon24Like />}
                                onClick={this.props.openFavourite}
                            >Избранное</Cell>
                            {/*<Cell*/}
                            {/*    expandable*/}
                            {/*    before={<Icon24Recent />}*/}
                            {/*    onClick={() => this.setState({ activePanel: 'nothing' })}*/}
                            {/*    indicator={'В разработке'}*/}
                            {/*>Мои записи</Cell>*/}
                        </List>
                    </Group>
                {
                    this.props.isFavourite === 0 ?
                        <Banner
                            header="Мы избранные"
                            subheader="Добавьте Навигатор красоты в список избранных приложений. Мы всего в одном клике от вас."
                            actions={<Button onClick={()=>this.addToFavApp()}>Добавить</Button>}
                        /> :
                        null
                }
                {this.props.master !== null &&
                    <Group title="Меню мастера">
                    <Separator style={{ margin: '12px 0' }} />
                    <List>
                    {/*<Cell*/}
                    {/*    expandable*/}
                    {/*    before={<Icon24Users />}*/}
                    {/*    onClick={() => this.setState({ activePanel: 'nothing' })}*/}
                    {/*    indicator={'В разработке'}*/}
                    {/*>Мои заявки</Cell>*/}
                    {/*<Cell*/}
                    {/*    expandable*/}
                    {/*    before={<Icon24UserOutgoing />}*/}
                    {/*    onClick={() => this.setState({ activePanel: 'nothing' })}*/}
                    {/*    indicator={'В разработке'}*/}
                    {/*>График</Cell>*/}
                    <Cell
                        expandable
                        before={<Icon24Story />}
                        onClick={this.props.openMasterPhoto}
                    >Портфолио</Cell>
                        <Cell
                            expandable
                            before={<Icon24Search />}
                            onClick={this.props.openFindModel}
                        >Поиск модели</Cell>
                    </List>
                    </Group>
                }
                {
                    this.state.promo !== null ?
                        <FixedLayout vertical="bottom">
                            <PromoBanner onClose={() => this.setState({promo: null})} bannerData={ this.state.promo } />
                        </FixedLayout>
                            :
                        null
                }
            </React.Fragment>
        );
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master
    };
};

const putActionsToProps = (dispatch) => {
    return {

    };
};

export default connect(putStateToProps, putActionsToProps)(Lk);