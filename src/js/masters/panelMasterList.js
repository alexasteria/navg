import React from 'react';
import {Spinner, Separator, Avatar, Button, Cell, Div, Group, List} from "@vkontakte/vkui";
import Icon16Like from '@vkontakte/icons/dist/16/like';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import {BACKEND} from "../func/func";

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '', //{id: '1', label: 'Маникюр'},
            title: '',
            mastersList: this.props.mastersList
        };
    }
    componentDidMount() {
        console.log('dodmount');
        this.setTitle(this.props.mastersList.length);
        this.setState({mastersList: this.props.mastersList});
        this.setState({category: this.props.category});
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        //console.log(nextProps.category, this.state.category);
        if (nextProps.category !== this.state.category){
            //console.log(BACKEND.masters.category+nextProps.category.id);
            fetch(BACKEND.masters.category+nextProps.category.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.setState({mastersList: mastersList});
                    this.setTitle(this.state.mastersList.length);
                    //console.log(mastersList);
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