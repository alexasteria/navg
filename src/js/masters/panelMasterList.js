import React from 'react';
import {Spinner, Separator, Avatar, Button, Cell, Div, Group, List} from "@vkontakte/vkui";
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from "../func/func";

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category, //{id: '1', label: 'Маникюр'},
            mastersList: null,
            title: ''
        };
    }

    componentDidMount() {
        console.log('Страница загрузилась');
        if(this.state.mastersList === null) {
            console.log('this.state.mastersList === null');
            if(this.state.category === '') {
                console.log('this.state.category === \'\'');
                fetch(BACKEND.masters.all)
                    .then(res => res.json())
                    .then(mastersList => this.setState({mastersList: mastersList}, () =>
                        this.setTitle(this.state.mastersList.length)
                    ));
            } else {
                console.log('this.state.category !== null');
                fetch(BACKEND.masters.category+this.state.category.id)
                    .then(res => res.json())
                    .then(mastersList => this.setState({mastersList: mastersList}, () =>
                        this.setTitle(this.state.mastersList.length)
                    ));
            }
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
            if(this.state.mastersList.length === 0) {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Spinner size="large" style={{ marginTop: 20 }} />
                    </div>
                )
            } else {
                return this.state.mastersList.map(master => {
                    return (
                        <Group key={master.vkUid}>
                            <Separator style={{ margin: '12px 0' }} />
                            <Cell expandable
                                  photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                  description={<Div style={{display: '-webkit-inline-box'}}>
                                      <Icon16Like/><Icon16Like/><Icon16Like/><Icon16Like/><Icon16LikeOutline/>
                                  </Div>
                                  }
                                  before={<Avatar src={master.avatarLink} size={50}/>}
                                  size="l"
                                  onClick={() => this.props.openPanelMaster('masterInfo', master)}
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