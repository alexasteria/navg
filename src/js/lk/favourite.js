import React from 'react';
import {
Cell, Avatar, Card, CardGrid
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import {BACKEND} from "../func/func";
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
            return (<Spin/>)
        } else {
            if(this.state.mastersArr.message === 'Список избранного пуст') {
                return (
                        <CardGrid>
                            <Card size="l" mode="shadow">
                                <Cell multiline align="center">
                                    {this.state.mastersArr.message}
                                </Cell>
                            </Card>
                        </CardGrid>
                )
            } else {
                return (
                    this.state.mastersArr.map(master => {
                        if ((master !== null)) { //если мастер не удален
                            return (
                                <CardGrid key={master._id}>
                                    <Card size="l" mode="shadow">
                                        <Cell expandable
                                              photo={master.avatarLink}
                                              description={master.type}
                                              before={<Avatar src={master.avatarLink} size={50}/>}
                                              size="l"
                                              onClick={() => this.props.openFavMasterOnId(master._id)}
                                        >{master.firstname} {master.lastname}
                                        </Cell>
                                    </Card>
                                </CardGrid>
                            )
                        }
                    })
                );
            }
        }
    }
}

export default Favourite;