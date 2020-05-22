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
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";

class MastersComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 3,
            body: '',
            isLoad: false,
            snackbar: null
        };
    }
    componentDidMount() {
        this.props.activeMaster.comments.map(comment => {
            if (comment.user.userId === this.props.user._id) {
                this.setState({isCommended: true})
            }
        });
        let count = this.props.activeMaster.comments.length;
        this.setState({commentsArr: this.props.activeMaster.comments, countComments: count, isLoad: true});
    }
    sendComment = () => {
        try {
            if (this.state.body.length < 20) throw 'Короткий отзыв будет бесполезен для пользователей. Опишите ваши впечатления подробнее.';
            if (this.state.body.length > 200) throw 'Длина отзыва ограничена 200 символами.';
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
            this.postData(BACKEND.comment.new+this.props.activeMaster._id, comment, 'POST');
            this.setState({isCommended: true});
        } catch (e) {
            console.log(e);
            this.setState({ snackbar:
                    <Snackbar
                        layout="vertical"
                        onClose={() => this.setState({ snackbar: null })}
                    >
                        {e}
                    </Snackbar>
            });
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
        let message = "Привет! У тебя новый отзыв: "+bodyComment;
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
        if (this.state.isLoad === true){
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
                            onChange={rating=>this.setState({rating})}
                            top="Оцените работу мастера"
                        />
                        <Counter mode="primary">Ваша оценка: {this.state.rating}</Counter>
                        <Textarea
                            name={'body'}
                            value={this.state.body}
                            status={this.state.body.length > 20 ? 'valid' : 'error'}
                            bottom={this.state.body.length > 20 ? '' : 'Опишите подробнее. Символов: '+this.state.body.replace(/ /g, "").length+' из 50' }
                            top={"Добавление отзыва"}
                            placeholder="Опишите, что вам понравилось или не понравилось в работе мастера"
                            onChange={this.handleChange}
                        />
                        <CellButton onClick={() => this.sendComment()} before={<Icon24Add />}>Добавить отзыв</CellButton>
                    </FormLayout>
                )
            }
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

const putStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(putStateToProps)(MastersComments);