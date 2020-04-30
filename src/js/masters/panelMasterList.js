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
    Placeholder, Counter, HorizontalScroll
} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";

const subcatStyle = {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 10
};

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mastersList: null,
            title: '',
            isLoad: false
        };
    }

    componentDidMount() {
        this.loadList()
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(prevProps, this.props);
            if (prevProps.city !== this.props.city || prevProps.category !== this.props.category) {
                this.loadList()
            }
        }

    checkSubcat(e) {
        console.log(e.currentTarget.id);
        let buttonSubcat = document.getElementById(e.currentTarget.id);
        if(buttonSubcat.style.backgroundColor==='lavender'){
            buttonSubcat.style.backgroundColor='#fff'
        } else {
            buttonSubcat.style.backgroundColor='lavender'
        }
    }
    loadList = () => {
            if(this.props.category === '') {
                console.log(BACKEND.masters.category+'all/'+this.props.city.id);
                fetch(BACKEND.masters.category+'all/'+this.props.city.id)
                    .then(res => res.json())
                    .then(mastersList => {
                        console.log(mastersList);
                        this.setState({mastersList: mastersList, isLoad: true});
                        this.setTitle(this.state.mastersList.length);
                    });
            } else {
                console.log(BACKEND.masters.category+this.props.category._id+'/'+this.props.city.id);
                fetch(BACKEND.masters.category+this.props.category._id+'/'+this.props.city.id)
                    .then(res => res.json())
                    .then(mastersList => {
                        console.log(mastersList);
                        this.setState({mastersList: mastersList, isLoad: true});
                        this.setTitle(this.state.mastersList.length);
                    });
            }
        }
    countSubcat = (id) => {
        let count = 0;
        this.state.mastersList.map((master)=>{
            //console.log(master.categories.subcat, id);
            if (master.categories.subcat){
                if(master.categories.subcat.includes(id)) {
                    console.log('совпало');
                    count++
                }
            }
        });
        return count
    };
    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866#masterid='+this.state.activeMaster._id})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };
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
                if (this.props.city==='Не выбрано') {
                    return (
                        <Placeholder
                            icon={<Icon56UsersOutline />}
                            header="Где вы?"
                        >
                            Нам не удалось определить Ваш город, укажите его вручную.
                        </Placeholder>
                    )
                } else if (this.state.mastersList.length === 0) {
                    return (
                        <Placeholder
                            icon={<Icon56UsersOutline />}
                            header="Не расстраивайтесь"
                            action={<Button onClick={this.share} size="l">Поделиться</Button>}
                        >
                            В данный момент у нас нет данных о специалистах этого профиля в Вашем городе. Мы расширяем базу мастеров, и скоро - предложения появятся.
                            Поделитесь приложением с мастерами, которых Вы знаете.
                        </Placeholder>
                    );
                } else {
                    return this.state.mastersList.map(master => {
                        let ratingArr = master.comments.map(comment =>{
                            return Number(comment.rating)
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
                                                          master.categories.category.map(category => {
                                                              return category.label+" "
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

    }
    render() {
        if(this.state.isLoad === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <React.Fragment>
                    <HorizontalScroll>
                        <div style={{display: 'flex'}}>
                            {
                                this.props.category &&
                                this.props.category._id !== 'all' ?
                                    this.props.category.subcat.map(subcat=>{
                                        return (
                                            <div style={{subcatStyle}} key={subcat._id}>
                                                <Button
                                                    after={<Counter size='s'>{this.countSubcat(subcat._id)}</Counter>}
                                                    id={subcat._id}
                                                    onClick={this.checkSubcat}
                                                    style={{margin: '4px 4px 0px 0px'}}
                                                    mode="outline"
                                                >
                                                    {subcat.label}
                                                </Button>
                                            </div>
                                        )
                                    }) : null
                            }
                        </div>
                    </HorizontalScroll>
                    <Group separator="hide" header={<Header mode="secondary">{this.state.title}</Header>}>
                        {this.renderMaster()}
                        </Group>
                </React.Fragment>
            )
        }
    }
}

export default MasterList