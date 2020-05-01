import React from 'react';
import {
    FormLayout,
    Button,
    Cell,
    Group,
    FormLayoutGroup,
    Textarea,
    Separator,
    Avatar,
    Spinner
} from "@vkontakte/vkui";
import {BACKEND} from "../func/func";


class FindModelMaster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            master: '',
            body: '',
            isLoaded: false
        };
    }
    componentDidMount() {
        fetch(BACKEND.masters.vkuid+this.props.user.vkUid)
            .then(res => res.json())
            .then(master => {
                this.setState({master: master[0]});
                fetch(BACKEND.findModel.onMasterId+master[0]._id)
                    .then(res => res.json())
                    .then(find => {
                        this.setState({findArr: find, isLoaded: true});
                        if (find.length > 0) {
                            this.setState({body: find[0].body, loadFind: find[0]});
                            let activeFind =
                                <Group>
                                    <Cell>Ваш активный поиск</Cell>
                                    <Separator style={{ margin: '12px 0' }} />
                                    <Cell expandable
                                          photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                          description={'desf'}
                                          before={<Avatar src={this.state.master.avatarLink} size={50}/>}
                                          size="l"
                                    >{this.state.master.firstname} {this.state.master.lastname}
                                    </Cell>
                                    <Cell multiline>
                                        {this.state.findArr[0].body}
                                    </Cell>
                                </Group>
                            ;
                            this.setState({activeFind: activeFind});
                        } else {
                            let activeFind = <Cell>У вас нет активных поисков</Cell>;
                            this.setState({activeFind: activeFind});
                        }
                    });
            });
    }

    handleChange = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value});
    }
    save=()=>{
        let find = {
            masterId: this.state.master._id,
            body: this.state.body,
            location: this.state.master.location,
            firstname: this.state.master.firstname,
            lastname: this.state.master.lastname,
            avatarLink: this.state.master.avatarLink
        };
        console.log(this.state.loadFind);
        if (this.state.loadFind._id) {
            let f =this.state.loadFind;
            f.body = this.state.body;
            this.setState({loadFind: f});
            this.patchData(BACKEND.findModel.new+this.state.loadFind._id, find);
        } else {
            this.postData(BACKEND.findModel.new, find);
        }
    }
    patchData(url = '', data = {}) {
        return fetch(url, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response=>response.json()) // парсит JSON ответ в Javascript объект
            .then(result=>{
                console.log(result);
                this.props.popout();
            })
    }
    postData(url = '', data = {}) {
        // Значения по умолчанию обозначены знаком *
        fetch(url, {
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
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response=>response.json()) // парсит JSON ответ в Javascript объект
            .then(result=>console.log(result),(result)=>this.setState({loadFind: result}))

    }
    render(){
        if (this.state.isLoaded === false){
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <FormLayout>
                    <FormLayoutGroup>
                        <Cell>Добавить / изменить</Cell>
                        <Textarea
                            name={'body'}
                            bottom={this.state.body ? '' : 'Пожалуйста, напишите пару слов о себе'}
                            value={this.state.body}
                            onChange={this.handleChange}/>
                    </FormLayoutGroup>
                    <Button size="xl" onClick={this.save}>Сохранить</Button>
                    {
                        this.state.loadFind &&
                        <Group>
                            <Cell>Ваш активный поиск</Cell>
                            <Separator style={{ margin: '12px 0' }} />
                            <Cell expandable
                                  photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                  description={'Так будет выглядеть запрос в ленте'}
                                  before={<Avatar src={this.state.master.avatarLink} size={50}/>}
                                  size="l"
                            >{this.state.master.firstname} {this.state.master.lastname}
                            </Cell>
                            <Cell multiline>
                                {this.state.loadFind.body}
                            </Cell>
                        </Group>
                    }
                </FormLayout>
            );
        }

    }
}

export default FindModelMaster;