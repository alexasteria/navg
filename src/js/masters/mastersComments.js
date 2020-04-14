import React from 'react';
import {
    Group,
    Div,
    Cell,
    Avatar,
    Footer,
    CellButton,
    Textarea,
    Spinner,
    Separator,
    Slider,
    Counter, FormLayout, Snackbar
} from "@vkontakte/vkui"
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {BACKEND} from "../func/func";
import Pop from "../func/alert";
import bridge from "@vkontakte/vk-bridge";

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
            isLoad: false,
            rating: 3,
            snackbar: null
        };
    }
    componentDidMount() {
        this.setState({commentsArr: this.props.activeMaster.comments});
        //console.log('comments ',   this.props.activeMaster.comments);
        this.props.activeMaster.comments.map(comment => {
            if (comment.user.userId === this.props.user._id) {
                this.setState({isCommended: true})
            }
        });
        let count = this.props.activeMaster.comments.length;
        this.setState({countComments: count, isLoad: true});
    }
    sendComment = () => {
        if (this.state.body.length < 50) {
            this.setState({ snackbar:
                    <Snackbar
                        layout="vertical"
                        onClose={() => this.setState({ snackbar: null })}
                    >
                        Короткий отзыв будет бесполезен для пользователей. Опишите ваши впечатления подробнее.
                    </Snackbar>
            });
        } else {
            let comment = {
                user: {
                    userId: this.props.user._id,
                    firstname: this.props.user.firstname,
                    lastname: this.props.user.lastname,
                    avatarLink: this.props.user.avatarLink
                },
                rating: Number(this.state.rating),
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
    };
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
                this.sendMessage(data.body);
            }); // парсит JSON ответ в Javascript объект
    }
    getDate(comDate) {
        if (comDate === 'Только что') {
            return comDate;
        } else {
            let date = new Date(comDate);
            let hours = date.getHours();
            if (hours < 10) hours = '0'+hours;
            let minutes = date.getMinutes();
            if (minutes < 10) minutes = '0'+minutes;
            let date1 = date.getDate();
            if (date1 < 10) date1 = '0'+date1;
            let month = date.getMonth();
            if (month < 10) month = '0'+month;
            return date1+'.'+month+'.'+date.getFullYear()+' в '+hours+':'+minutes;
        }
    }
    sendMessage = (bodyComment) => {
        let token = "f663eda6fd8aa562fdfc872f13411acc87a73fe01a5d9b8de8c99557a1ecb9a34d9b0aaced498c8daecdf";
        let message = "Привет! У тебя новый комментарий: "+bodyComment;
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "params": {"random_id": Math.random(), "peer_id": "-193179174", "user_id": this.props.activeMaster.vkUid,"message": message, "v":"5.103", "access_token": token}})
            .then(result => {
                console.log(result);

            })
            .catch(e => console.log(e))
    };
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
                    <Group key={comment._id} separator={'hide'}>
                        <Cell
                            description={this.getDate(comment.date)}
                            before={ <Avatar size={40} src={comment.user.avatarLink} /> }
                        >
                            {comment.user.firstname+' '+comment.user.lastname}
                        </Cell>
                        <Cell multiline>{comment.body}</Cell>
                        <Cell><Counter mode="primary">Оценка: {comment.rating} из 5</Counter></Cell>
                        <Separator/>
                    </Group>
                )
            });
        }
    };
    validate() {
        //console.log(this.props.activeMaster.vkUid, this.props.user.vkUid);
        if (this.props.activeMaster.vkUid === this.props.user.vkUid) {
            return (
                <Div style={{fontSize: 12, color: 'darkgray'}}>Нельзя оставлять комментарий на самого себя</Div >
            )
        }
        else if (this.state.isCommended === true) {
            return (
                <Div style={{fontSize: 12, color: 'darkgray'}}>Вы уже оставляли комментарий об этом мастере</Div>
            )
        } else {
            return (
                <FormLayout>
                    <Slider
                        step={1}
                        min={1}
                        max={5}
                        value={Number(this.state.rating)}
                        onChange={rating => this.setState({rating})}
                        top="Оцените работу мастера"
                    />
                    <Counter mode="primary">Ваша оценка: {this.state.rating}</Counter>
                    <Textarea
                        name={'body'}
                        value={this.state.body}
                        status={this.state.body.length > 50 ? 'valid' : 'error'}
                        bottom={this.state.body.length > 50 ? '' : 'Опишите подробнее. Символов: '+this.state.body.replace(/ /g, "").length+' из 50' }
                        top={"Добавление отзыва"}
                        placeholder="Опишите, что вам понравилось или не понравилось в работе мастера"
                        onChange={this.handleChange}
                    />
                    <CellButton onClick={() => this.sendComment()} before={<Icon24Add />}>Добавить отзыв</CellButton>
                </FormLayout>
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
                    <Footer>{this.validate()}</Footer>
                    {this.state.snackbar}
                </Div>
        );
    }
}

export default MastersCard;