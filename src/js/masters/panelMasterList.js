import React from 'react';
import {
    Spinner,
    Separator,
    Avatar,
    Button,
    Cell,
    Div,
    Group,
    List,
    Header,
    CardGrid,
    Card,
    Placeholder
} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from "../func/func";

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category, //{id: '1', label: 'Маникюр'},
            mastersList: null,
            title: '',
            isLoad: false
        };
    }

    componentDidMount() {
        console.log('Страница загрузилась');
            if(this.state.category === '') {
                fetch(BACKEND.masters.all)
                    .then(res => res.json())
                    .then(mastersList => {
                            this.setState({mastersList: mastersList});
                            this.setTitle(this.state.mastersList.length);
                            this.setState({isLoad: true});
                    });
            } else {
                fetch(BACKEND.masters.category+this.state.category.id)
                    .then(res => res.json())
                    .then(mastersList => {
                            this.setState({mastersList: mastersList});
                            this.setTitle(this.state.mastersList.length);
                            this.setState({isLoad: true});
                    });
            }
        }

    setTitle(count) {
        if (count===undefined){
            this.setState({title: 'Мы никого не нашли :( пока не нашли...'});
        } else {
            this.setState({title: 'Найдено мастеров: '+count});
        }
    }
    renderMaster() {
        if(Array.isArray(this.state.mastersList)) {
            if(this.state.isLoad === false) {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Spinner size="large" style={{ marginTop: 20 }} />
                    </div>
                )
            } else {
                if (this.state.mastersList.length === 0) {
                    return (
                        <Placeholder
                            icon={<Icon56UsersOutline />}
                            header="Не расстраивайтесь"
                            action={<Button size="l">Поделиться</Button>}
                        >
                            В данный момент у нас нет данных о специалистах этого профиля в Вашем городе. Мы расширяем базу мастеров, и скоро - предложения появятся.
                            Поделитесь приложением с мастерами, которых Вы знаете.
                        </Placeholder>
                    );
                } else {
                    return this.state.mastersList.map(master => {
                        let ratingArr = master.comments.map(comment =>{
                            return comment.rating
                        });
                        let sum = ratingArr.reduce((a, b) => a + b, 0);
                        let rating = sum/ratingArr.length;
                        //console.log(rating);
                        return (
                                <CardGrid key={master.vkUid} style={{padding: 0}}>
                                    <Card size="l" mode="shadow">
                                        <Cell expandable
                                                      photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                                      description={
                                                          master.categories.map(category => {
                                                              if(category.active === true) {
                                                                  return category.label+" "
                                                              }
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
                }
            }
        }
    }
    setBottom = (rating, length) => {
        if (length > 0) {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9"}}>
                    Рейтинг - {rating} (На основе {length} отзывов)
                </Div>
            )
        } else {
            return (
                <Div style={{margin: 0, padding: 0, fontSize: 12, color: "#a9a9a9"}}>
                    Отзывы отсутствуют
                </Div>
            )
        }

    }
    render() {
        if(this.state.isLoad === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <Div>
                    <Group separator="hide" header={<Header mode="secondary">{this.state.title}</Header>}>
                        {this.renderMaster()}
                        </Group>
                </Div>
            )
        }
    }
}

export default MasterList