import React from 'react';
import {Avatar, Button, Cell, Div, Group} from "@vkontakte/vkui";
import {BACKEND} from "../func/func";

class MasterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            mastersList: [],
            title: ''
        };
    }
    componentDidMount() {
        if(this.state.category === '') {
            fetch(BACKEND.masters.all)
                .then(res => res.json())
                .then(mastersList => this.setState({mastersList: mastersList}, () =>
                    this.setTitle(this.state.mastersList.length)
                ));
        } else {
            fetch(BACKEND.masters.category+this.state.category)
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
    renderProducts() {
        console.log(this.state.mastersList.length);
        if(Array.isArray(this.state.mastersList)) {
            if(this.state.mastersList.length === 0) {
                console.log(this.state.mastersList.length);
                return (<Cell>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав <Button level="commerce">Поделиться</Button></Cell>)
            } else {
                //console.log(this.state.mastersList);
                return this.state.mastersList.map(master => {
                    //console.log(master);
                    return (
                        <Cell expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                            description={'Рэйтинг'}
                            bottomContent={
                                <Div>{
                                    master.category.map(category => {
                                        if (category.active === true) {
                                            return category.label+' '
                                        }
                                    })
                                }</Div>
                            }
                            before={<Avatar src={master.avatarLink} size={80}/>}
                            size="l"
                              onClick={() => this.props.openPanelMaster('masterInfo', master._id)}
                        >{master.firstname} {master.lastname}</Cell>
                    );
                })
            }
        } else {
            return (<Cell multiline>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав <Button level="commerce">Поделиться</Button></Cell>)
        }
    }
    render() {
        return (
            <Group title={this.state.title}>
                {this.renderProducts()}
            </Group>
        )
    }
}

export default MasterList