import React from 'react';
import {Group, Div, Cell, Avatar, List, CellButton, Textarea, Button, Spinner} from "@vkontakte/vkui"
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {BACKEND} from "../func/func";

class MastersCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: {
                id: '1',
                body: 'ТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТестТест',
                author: 'Тест Тестович',
                date: Date.now()
            },
            body: '',
            commentsArr: [],
            isLoad: false
        };
    }
    componentDidMount() {
        //console.log('comments ',  this.props);
        fetch(BACKEND.comment.onMasterId+this.props.activeMaster._id)
            .then(res => res.json())
            .then(commentsArr => {
                commentsArr.map(comment => {
                    if (comment.user.userId === this.props.user._id) {
                        this.setState({isCommended: true})
                    }
                })
                this.setState({commentsArr: commentsArr})
                let count = commentsArr.length;
                this.setState({countComments: count})
                this.setState({isLoad: true})
            });

    }
    sendComment = () => {
        let comment = {
            user: {
                userId: this.props.user._id,
                firstname: this.props.user.firstname,
                lastname: this.props.user.lastname,
                avatarLink: this.props.user.avatarLink
            },
            body: this.state.body
        };
        this.postData(BACKEND.comment.new+this.props.activeMaster._id, comment, 'POST');
    }
    postData(url = '', data = {}, method) {
        // Значения по умолчанию обозначены знаком *
        return fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
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
            .then(response => console.log(response.json())); // парсит JSON ответ в Javascript объект
    }
    commentList() {
        if (this.state.isLoad === false) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Spinner size="large" style={{ marginTop: 20 }} />
                </div>
            )
        } else {
            return this.state.commentsArr.map(comment => {
                return (
                    <List key={comment._id}>
                        <Cell before={ <Avatar size={40} src={comment.user.avatarLink} /> }>{comment.user.firstname+' '+comment.user.lastname}</Cell>
                        <Cell multiline>{comment.body}</Cell>
                        <Cell>{comment.date}</Cell>
                    </List>
                )
            });
        }
    };
    validate() {
        if (this.state.isCommended === true) {
            return (
                <Cell multiline>Вы уже оставляли комментарий об этом пользователе</Cell>
            )
        } else {
            return (
                <Div>
                    <Textarea
                        name={'body'}
                        value={this.state.body}
                        top="Добавление отзыва"
                        placeholder="Опишите, что вам понравилось или не понравилось в работе мастера"
                        onChange={this.handleChange}
                    />
                    <CellButton onClick={() => this.sendComment()} before={<Icon24Add />}>Добавить отзыв</CellButton>
                </Div>
            )
        }
    }
    handleChange = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value});
    };
    render(){
        return (
            <Group title="">
                <Div>
                    {this.commentList()}
                    {this.validate()}

                </Div>
            </Group>
        );
    }
}

export default MastersCard;