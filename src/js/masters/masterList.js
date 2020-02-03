import React from 'react';
import {Avatar, Button, Cell, Div, Group} from "@vkontakte/vkui";

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
            console.log('http://localhost:3030/masters/category/all');
            fetch('http://localhost:3030/masters/category/all')
                .then(res => res.json())
                .then(mastersList => this.setState({mastersList}, () =>
                    console.log(this.state.mastersList)
                ));
        } else {
            console.log('http://localhost:3030/masters/category/'+this.state.category);
            fetch('http://localhost:3030/masters/category/'+this.state.category)
                .then(res => res.json())
                .then(mastersList => this.setState({mastersList}, () =>
                    console.log(this.state.mastersList)
                ));
        }
    }
    renderProducts() {
        if(Array.isArray(this.state.mastersList)) {
            if(this.state.mastersList.length === 0) {
                return (<Div>Увы, сейчас у нас нет данных о специалистах данного профиля в вашем городе.
                Помогите нам их найти :) Поделитесь ссылкой на наше приложение нажав <Button level="commerce">Поделиться</Button></Div>)
            } else {
                return this.state.mastersList.map(master => {
                    return (
                        <Cell expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                            description={master.category}
                            bottomContent={<Div>Rating</Div>}
                            before={<Avatar src={master.avatarLink} size={80}/>}
                            size="l"
                              onClick={() => this.props.openPanelMaster('masterInfo', master)}
                        >{master.firstname} {master.lastname}</Cell>
                    );
                })
            }
        }
        return (
            <Div>Пожалуйста, выберите категорию. Так мы сможем показать вам только мастеров нужного профиля.</Div>
        )
    }
    render() {
        if(this.state.mastersList.length !== undefined) {
            this.setState({title: 'Мастеров найдено: '+this.state.mastersList.length})
            //this.state.title = 'Мастеров найдено: '+this.state.mastersList.length;
        }
        return (
            <Group title={this.state.title}>
                {this.renderProducts()}
            </Group>
        )
    }
}

export default MasterList