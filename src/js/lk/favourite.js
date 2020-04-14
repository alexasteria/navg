import React from 'react';
import {
    Group,
    Div, Separator, Cell, Avatar, Spinner, Card, CardGrid, FixedLayout
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import {BACKEND} from "../func/func";
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';

class Favourite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favsArr: [],
            mastersArr: [],
            isLoaded: false
        };
    }

    componentWillMount() {
        this.loadFavsMasters(this.props.user);
    }

    loadFavsMasters = (user) => {
        fetch(BACKEND.favs.user + user._id)
            .then(res => res.json())
            .then(favsArr => {
                if(favsArr.length === 0){
                    this.setState({isLoaded: true});
                } else {
                    favsArr.map(fav => {
                        fetch(BACKEND.masters.onID + fav.masterId)
                            .then(res => res.json())
                            .then(master => {
                                let mastersArr = this.state.mastersArr;
                                mastersArr.push(master);
                                this.setState({mastersArr: mastersArr, isLoaded: true});
                            });
                        //this.setState({isLoaded: true});
                    });
                }
            });
    };

    render() {
        if (this.state.isLoaded === false) {
            return (
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Spinner size="large" style={{marginTop: 20}}/>
                </div>
            )
        } else {
            if(this.state.mastersArr.length === 0) {
                return (
                        <CardGrid>
                            <Card size="l" mode="shadow">
                                <Cell multiline align="center">
                                    Список избранного пуст
                                </Cell>
                            </Card>
                        </CardGrid>
                )
            } else {
                console.log(this.state.mastersArr);
                return (
                    this.state.mastersArr.map(master => {
                        if ((master !== null) && (master.visible === true)) { //если мастер не удален
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