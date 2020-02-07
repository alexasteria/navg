import React from 'react';
import {Separator, Avatar, Button, Cell, Div, Group, List} from "@vkontakte/vkui";
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from "../func/func";

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category, //{id: '1', label: 'Маникюр'},
            mastersList: [],
            title: ''
        };
    }
    componentDidMount() {
        //console.log(this.props.category);
        if(this.state.category === '') {
            fetch(BACKEND.masters.all)
                .then(res => res.json())
                .then(mastersList => this.setState({mastersList: mastersList}, () =>
                    this.setTitle(this.state.mastersList.length)
                ));
        } else {
            fetch(BACKEND.masters.category+this.state.category.id)
                .then(res => res.json())
                .then(mastersList => this.setState({mastersList: mastersList}, () =>
                    this.setTitle(this.state.mastersList.length)
                ));
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
        //console.log(this.state.mastersList.length);
        if(Array.isArray(this.state.mastersList)) {
            if(this.state.mastersList.length === 0) {
                //console.log(this.state.mastersList.length);
                return (<Cell multiline>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав <Button level="commerce">Поделиться</Button></Cell>)
            } else {
                //console.log(this.state.mastersList);
                return this.state.mastersList.map(master => {
                    console.log(master);
                    return (
                        <Group>
                            <Separator style={{ margin: '12px 0' }} />
                            <Cell expandable
                                  photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                  description={<Div style={{display: '-webkit-inline-box'}}>
                                      <Icon16Like/><Icon16Like/><Icon16Like/><Icon16Like/><Icon16LikeOutline/>
                                  </Div>
                                  }
                                  key={master.vkUid}
                                  before={<Avatar src={master.avatarLink} size={50}/>}
                                  size="l"
                                  onClick={() => this.props.openPanelMaster('masterInfo', master._id)}
                            >{master.firstname} {master.lastname}
                            </Cell>
                        </Group>
                    );
                })
            }
        } else {
            return (
                <List>
                    <Cell multiline>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                        Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав <Button level="commerce">Поделиться</Button></Cell>
                </List>
            )
        }
    }
    render() {
        return (
            <Div>
                <Cell>{this.state.title}</Cell>
                {this.renderMaster()}
            </Div>
        )
    }
}

export default MasterList