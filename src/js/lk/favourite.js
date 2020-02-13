import React from 'react';
import {
    Group,
    Div, Separator, Cell, Avatar, Spinner
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
                console.log(favsArr);
                this.setState({favsArr: favsArr});
                favsArr.map(fav => {
                    fetch(BACKEND.masters.onID + fav.masterId)
                        .then(res => res.json())
                        .then(master => {
                            let mastersArr = this.state.mastersArr;
                            mastersArr.push(master);
                            this.setState({mastersArr: mastersArr});
                            this.setState({isLoaded: true});
                        });
                })
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
            return (
                this.state.mastersArr.map(master => (
                    <Group key={master._id}>
                        <Separator style={{margin: '12px 0'}}/>
                        <Cell expandable
                              photo={master.avatarLink}
                              description={<Div style={{display: '-webkit-inline-box'}}>
                                  <Icon16Like/><Icon16Like/><Icon16Like/><Icon16Like/><Icon16LikeOutline/>
                              </Div>
                              }
                              before={<Avatar src={master.avatarLink} size={50}/>}
                              size="l"
                              onClick={() => this.props.openMaster(master)}
                        >{master.firstname} {master.lastname}
                        </Cell>
                    </Group>
                ))
            );
        }
    }
}

export default Favourite;