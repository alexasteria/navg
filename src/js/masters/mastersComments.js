import React from 'react';
import {Group, Div, Cell, Avatar, Separator, CellButton, Textarea, Spinner} from "@vkontakte/vkui"
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {BACKEND} from "../func/func";
import Pop from "../func/alert";

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
                });
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
            try {
                this.postData(BACKEND.comment.new+this.props.activeMaster._id, comment, 'POST');
                this.setState({isCommended: true});
            } catch (e) {
                alert(e);
                console.log(e.message);
            }
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
            .then(response => {
                console.log(data);
                console.log(response.json());
                let arr = this.state.commentsArr;
                data.date = "Только что";
                arr.push(data);
                this.setState({commentsArr: arr});
            }); // парсит JSON ответ в Javascript объект
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
                    <Group key={comment._id}>
                        <Cell
                            description={comment.date}
                            before={ <Avatar size={40} src={comment.user.avatarLink} /> }
                        >
                            {comment.user.firstname+' '+comment.user.lastname}
                        </Cell>
                        <Cell multiline>{comment.body}</Cell>
                    </Group>
                )
            });
        }
    };
    validate() {
        //console.log(this.props.activeMaster.vkUid, this.props.user.vkUid);
        if (this.props.activeMaster.vkUid === this.props.user.vkUid) {
            return (
                <Cell multiline>Нельзя оставлять комментарий на самого себя</Cell>
            )
        }
        else if (this.state.isCommended === true) {
            return (
                <Cell multiline>Вы уже оставляли комментарий об этом мастере</Cell>
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
                <Div>
                    {this.commentList()}
                    {this.validate()}

                </Div>
        );
    }
}

export default MastersCard;