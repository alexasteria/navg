import React from 'react'
import {
    Avatar,
    Button,
    Card,
    CardGrid,
    Cell,
    Div,
    Group,
    Header,
    Placeholder,
    Footer,
    PromoBanner,
    MiniInfoCell, Headline, Caption
} from "@vkontakte/vkui"
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline'
import bridge from "@vkontakte/vk-bridge"
import RatingStars from '../elements/items/ratingStars'
import Icon24Comment from '@vkontakte/icons/dist/24/comment'
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron'
import Icon16Like from '@vkontakte/icons/dist/16/like'
import {connect} from "react-redux";

class MastersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            promo: null
        }
    }

    componentDidMount() {
        this.setTitle(this.props.mastersList.length)
        try {
            if (this.props.city === 'Не выбрано') throw 'Нет города'
            if (this.props.mastersList.length === 0) throw 'Никого не нашли'
        } catch (e) {
            this.setState({error: e})
        }
        bridge.subscribe(e=>{
            if (!e.detail) {
                return
            }

            const { type, data } = e.detail

            if (type === 'VKWebAppGetAdsResult') {
                this.setState({promo: data})
            }

        })
        bridge.send("VKWebAppGetAds", {})
            .then(data=>console.log('ads'))
            .catch(e=>console.log(e))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.setState({error: null})
            try {
                if (this.props.city === 'Не выбрано') throw 'Нет города'
                if (this.props.mastersList.length === 0) throw 'Никого не нашли'
            } catch (e) {
                this.setState({error: e})
            }
        }
    }

    setTitle(count) {
        if (count === undefined){
            this.setState({title: 'Мы никого не нашли :( пока не нашли...'})
        } else {
            this.setState({title: 'Найдено мастеров: '+count})
        }
    }

    renderMasters() {
        let i = 0
        return this.props.mastersList.map(master => {
            if (i === 6) i = 0
            i++
            return (
                <CardGrid key={master.vkUid}>
                    <Card size="l" mode="shadow">
                        <Cell
                            style={{borderRadius: '10px 10px 10px 10px'}}
                            expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                              description={
                                  <React.Fragment>
                                      {
                                          master.categories.category.map((category, index) => {
                                              if (index < master.categories.category.length-1){
                                                  return <span style={{display: 'inline-flex'}}>{category.label}<Icon16Chevron /></span>
                                              } else {
                                                  return category.label
                                              }
                                          })
                                      }
                                  </React.Fragment>
                              }
                              bottomContent={
                                  this.setBottom(master.meta, master._id)
                              }
                              before={<Avatar src={master.avatarLink} size={70}/>}
                              size="l"
                              onClick={() => this.props.openPanelMaster(master)}
                        >{master.firstname} {master.lastname}
                        </Cell>
                    </Card>
                </CardGrid>
            )
        })
    }

    setBottom = (meta, id) => {
        if (meta.comments > 0) {
            return (
                <MiniInfoCell
                    before={<div style={{display: 'inline-flex'}}><Icon24Comment/><span style={{margin: 'auto'}}>{meta.comments}</span></div>}
                    style={{padding: 0, margin: 0}}
                   after={
                       this.props.user.favs.includes(id) ? <div style={{margin: 3}}><Icon16Like width={21} height={21} fill="red"/></div> : null
                   }
                >
                    <div style={{display: 'inline-flex'}}><span style={{marginLeft: 10}}><RatingStars countStars={meta.rating}/></span></div>
                </MiniInfoCell>
            )
        } else {
            return (
                <MiniInfoCell style={{margin: 0, padding: 0}} before={<Icon24Comment/>}>
                    <Caption  style={{color: "#a9a9a9", WebkitUserSelect: 'none', userSelect: 'none'}} weight="regular">Отзывы отсутствуют</Caption>
                </MiniInfoCell>
                // <Div style={{margin: 0, padding: 0, color: "#a9a9a9", WebkitUserSelect: 'none', userSelect: 'none'}}>
                //     Отзывы отсутствуют
                // </Div>
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
                    {
                        this.state.promo !== null ?
                            <Card size="l" mode="shadow">
                                <PromoBanner bannerData={ this.state.promo } onClose={()=>this.setState({promo: null})} />
                            </Card> :
                            null
                    }
                </Group>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(putStateToProps)(MastersList)