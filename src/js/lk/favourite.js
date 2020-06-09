import React from 'react';
import {
    Avatar, RichCell, Spinner, Placeholder, Card, Cell, CardGrid
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import {BACKEND} from "../func/func";
import Icon56LikeOutline from '@vkontakte/icons/dist/56/like_outline';
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron';
import Spin from '../elements/spinner'

class Favourite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favsArr: [],
            mastersArr: [],
            isLoaded: false
        };
    }

    componentDidMount() {
        window.history.replaceState({}, '', '#init');
        window.history.pushState({}, '', '#router');
        window.addEventListener('popstate', event => {
            window.history.pushState({}, '', '#router-back');
            this.props.goBack();
        });
        this.loadFavsMasters(this.props.user.favs);
    }

    loadFavsMasters = (favs) => {
        //favs is array masters ID
        let ids = {ids: favs};
        fetch(BACKEND.masters.onarrayid, {
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
            body: JSON.stringify(ids), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .then(mastersArr => {
                this.setState({mastersArr: mastersArr, isLoaded: true});
            })
            .catch(err=> {
                console.log(err);
                this.setState({isLoaded: true});
            })
    };

    render() {
        if (this.state.isLoaded === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            if(this.state.mastersArr.message === 'Список избранного пуст') {
                return (
                    <Placeholder
                        stretched
                        icon={<Icon56LikeOutline/>}
                        header={this.state.mastersArr.message}
                    >Добавить мастера в этот список можно, нажав соответствующую кнопку в профиле мастера.
                    </Placeholder>
                )
            } else {
                return (
                    this.state.mastersArr.map(master => {
                        if ((master !== null)) { //если мастер не удален
                            return (
                                <CardGrid key={master.vkUid}>
                                    <Card size="l" mode="shadow">
                                        <RichCell
                                            key={master._id}
                                            before={<Avatar size={72} src={master.avatarLink} />}
                                            text={master.type}
                                            caption={master.location.city.title}
                                            after={<Icon16Chevron/>}
                                            onClick={() => this.props.openFavMasterOnId(master._id)}
                                        >
                                            {master.firstname} {master.lastname}
                                        </RichCell>
                                    </Card>
                                </CardGrid>

                                // <CardGrid key={master._id}>
                                //     <Card size="l" mode="shadow">
                                //         <Cell expandable
                                //               photo={master.avatarLink}
                                //               description={master.type}
                                //               before={<Avatar src={master.avatarLink} size={50}/>}
                                //               size="l"
                                //               onClick={() => this.props.openFavMasterOnId(master._id)}
                                //         >{master.firstname} {master.lastname}
                                //         </Cell>
                                //     </Card>
                                // </CardGrid>
                            )
                        }
                    })
                );
            }
        }
    }
}

export default Favourite;