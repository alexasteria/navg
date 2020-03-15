import React from 'react';
import {Spinner, Separator, Avatar, Button, Cell, Div, Group, List} from "@vkontakte/vkui";
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
                        <List>
                            <Cell multiline>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                                Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав кнопку</Cell>
                            <Cell><Button size="xl" level="commerce">Поделиться</Button></Cell>
                        </List>
                    );
                } else {
                    return this.state.mastersList.map(master => {
                        return (
                            <Group key={master.vkUid}>
                                <Cell expandable
                                      photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                      description={
                                          master.category.map(category => {
                                              if(category.active === true) {
                                                  return category.label+" "
                                              }
                                          })
                                      }
                                      bottomContent={<Div style={{padding: 0, fontSize: 12, color: "#a9a9a9"}}>Рейтинг - 4.7 (На основе 23 отзывов)</Div>}
                                      before={<Avatar src={master.avatarLink} size={70}/>}
                                      size="l"
                                      onClick={() => this.props.openPanelMaster('masterInfo', master)}
                                >{master.firstname} {master.lastname}
                                </Cell>
                            </Group>
                        );
                    })
                }
            }
        }
    }
    render() {
        if(this.state.isLoad === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <Div>
                    <Cell>{this.state.title}</Cell>
                    {this.renderMaster()}
                </Div>
            )
        }
    }
}

export default MasterList