import React from 'react';
import {Separator, Avatar, Button, Cell, Div, Group, List} from "@vkontakte/vkui";
import Icon28Favorite from '@vkontakte/icons/dist/28/favorite';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
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
                                  description={
                                      <Cell multiline>{
                                          master.category.map(category  => {
                                              if (category.active === true) {
                                                  return category.label+' '
                                              } else {
                                                  return null
                                              }
                                          })
                                      }</Cell>
                                  }
                                  key={master.vkUid}
                                  bottomContent={
                                      <Div style={{display: '-webkit-inline-box'}}>
                                          <Icon28Favorite />
                                          <Icon28Favorite />
                                          <Icon28Favorite />
                                          <Icon28Favorite />
                                          <Icon28FavoriteOutline />
                                      </Div>
                                  }
                                  before={<Avatar src={master.avatarLink} size={80}/>}
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
            <Group title={this.state.title}>
                {this.renderMaster()}
            </Group>
        )
    }
}

export default MasterList