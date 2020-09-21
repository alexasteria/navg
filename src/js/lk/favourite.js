import React from 'react'
import {
    Avatar, RichCell, Spinner, Placeholder, Card, CardGrid, Footer, Group, Cell, MiniInfoCell, Div
} from "@vkontakte/vkui"
import '@vkontakte/vkui/dist/vkui.css'
import {BACKEND} from "../func/func"
import Icon56LikeOutline from '@vkontakte/icons/dist/56/like_outline'
import Icon24Comment from '@vkontakte/icons/dist/24/comment'
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron'
import Icon16Like from '@vkontakte/icons/dist/16/like'
import Head from "../elements/panelHeader"
import RatingStars from "../elements/items/ratingStars";

class Favourite extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            favsArr: [],
            mastersArr: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        this.loadFavsMasters(this.props.user.favs)
    }

    loadFavsMasters = (favs) => {
        let ids = {ids: favs}
        fetch(BACKEND.masters.onarrayid, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(ids),
        })
            .then(res => res.json())
            .then(mastersArr => {
                this.setState({mastersArr: mastersArr, isLoaded: true})
            })
            .catch(err => {
                console.log(err)
                this.setState({isLoaded: true})
            })
    };

    setBottom = (meta, id) => {
        if (meta.comments > 0) {
            return (
                <MiniInfoCell
                    style={{padding: 0, margin: 0}}
                    after={
                        this.props.user.favs.includes(id) ? <div style={{margin: 3}}><Icon16Like width={21} height={21} fill="red"/></div> : null
                    }
                >
                    <div style={{display: 'inline-flex'}}><Icon24Comment/><span style={{margin: 'auto'}}>{meta.comments}</span><span style={{marginLeft: 10}}><RatingStars countStars={meta.rating}/></span></div>
                </MiniInfoCell>
            )
        } else {
            return (
                <Div style={{margin: 0, padding: 0, color: "#a9a9a9", webkitUserSelect: 'none', userSelect: 'none'}}>
                    Отзывы отсутствуют
                </Div>
            )
        }
    };

    render() {
        if (this.state.isLoaded === false) {
            return (
                <React.Fragment>
                    <Head
                        title="Избранное"
                        goBack={() => this.props.goBack()}
                    />
                    <Placeholder
                        stretched
                        icon={<Spinner size="large" style={{marginTop: 20}}/>}
                        header={'Ищем-ищем...'}
                    />
                </React.Fragment>
            )
        } else {
            if (this.state.mastersArr.error) {
                return (
                    <React.Fragment>
                        <Head
                            title="Избранное"
                            goBack={() => this.props.goBack()}
                        />
                        <Placeholder
                            stretched
                            icon={<Icon56LikeOutline/>}
                            header={this.state.mastersArr.message}
                        >Добавить мастера в этот список можно, нажав соответствующую кнопку в его профиле.
                        </Placeholder>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                        <Head
                            title="Избранное"
                            goBack={() => this.props.goBack()}
                        />
                        <Group separator="hide">
                            {
                                this.state.mastersArr.map(master => {
                                    if ((master !== null)) { //если мастер не удален
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
                                                        onClick={() => this.props.openFavMasterOnId(master)}
                                                    >{master.firstname} {master.lastname}
                                                    </Cell>
                                                </Card>
                                            </CardGrid>
                                            // <React.Fragment>
                                            //     <CardGrid key={master.vkUid}>
                                            //         <Card size="l" mode="shadow">
                                            //             <RichCell
                                            //                 key={master._id}
                                            //                 before={<Avatar size={72} src={master.avatarLink}/>}
                                            //                 text={master.type}
                                            //                 caption={master.location.city.title}
                                            //                 after={<Icon16Chevron/>}
                                            //                 onClick={() => this.props.openFavMasterOnId(master)}
                                            //             >
                                            //                 {master.firstname} {master.lastname}
                                            //             </RichCell>
                                            //         </Card>
                                            //     </CardGrid>
                                            // </React.Fragment>
                                        )
                                    }
                                })
                            }
                            <Footer style={{webkitUserSelect: 'none', userSelect: 'none'}}>На этом все. Мастеров всего
                                - {this.state.mastersArr.length}.</Footer>
                        </Group>
                    </React.Fragment>
                )
            }
        }
    }
}

export default Favourite