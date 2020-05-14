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
    Spinner, CardGrid, Card
} from "@vkontakte/vkui";
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'


class FindModelMaster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            master: '',
            body: '',
            isLoaded: false,
            isActive: false,
            error: ''
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
                        if (find.length > 0) {
                            this.setState({body:find[0].body, error: '', isLoaded: true, isActive: true, loadFind: find[0]});
                        } else {
                            let error = <Cell>У вас нет активных поисков</Cell>;
                            this.setState({error: error, isLoaded: true});
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
        if (this.state.isActive === true) {
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
            .then(result=>{
                console.log(result);
                this.setState({loadFind: result, isActive: true})
            })

    }
    render(){
        if (this.state.isLoaded === false){
            return (<Spin />)
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
                    <Separator style={{ margin: '12px 0' }} />
                    {
                        this.state.isActive &&
                        <CardGrid>
                            <Cell>Ваш активный поиск:</Cell>
                            <Card size='l'>
                                <Cell expandable
                                      photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                      description={'Так будет выглядеть запрос в ленте'}
                                      before={<Avatar src={this.state.loadFind.avatarLink} size={50}/>}
                                      size="l"
                                >{this.state.loadFind.firstname} {this.state.loadFind.lastname}
                                </Cell>
                                <Cell multiline>
                                    {this.state.body}
                                </Cell>
                            </Card>
                        </CardGrid>
                    }
                </FormLayout>
            );
        }

    }
}

export default FindModelMaster;