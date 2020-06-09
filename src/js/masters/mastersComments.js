import React from 'react';
import {
    Group,
    Div,
    Cell,
    Avatar,
    Footer,
    Button,
    Textarea,
    Spinner,
    Separator,
    Slider,
    Counter, FormLayout, Snackbar, FormLayoutGroup, Banner
} from "@vkontakte/vkui"
import Icon24Add from '@vkontakte/icons/dist/24/add';
import {BACKEND} from "../func/func";
import bridge from "@vkontakte/vk-bridge";
import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import {connect} from "react-redux";
import Icon24FavoriteOutline from '@vkontakte/icons/dist/24/favorite_outline';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

class MastersComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            body: '',
            isLoad: false,
            snackbar: null,
            stars: []
        };
    }
    componentDidMount() {
        this.changeStars();
        this.props.activeMaster.comments.map(comment => {
            if (comment.user.userId === this.props.user._id) {
                this.setState({isCommended: true})
            }
        });
        let count = this.props.activeMaster.comments.length;
        this.setState({commentsArr: this.props.activeMaster.comments, countComments: count, isLoad: true});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.rating !== this.state.rating){
            this.changeStars()
        }
    }

    changeStars = () => {
        let stars = [];
        for(let i=1; i<=5; i++){
            if (i <= this.state.rating){
                stars.push(<Icon24Favorite width={36} height={36} id={i} onClick={()=>this.setState({rating: i})} fill={'ffbb00'} />);
            } else {
                stars.push(<Icon24FavoriteOutline width={36} height={36} id={i} onClick={()=>this.setState({rating: i})} fill={'ffbb00'} />);
            }
        }
        this.setState({stars: stars});
    };

    sendComment = () => {
        try {
            if (this.state.rating === 0) throw 'Укажите оценку работы мастера';
            if (this.state.body.length < 20) throw 'Короткий отзыв будет бесполезен для пользователей. Опишите ваши впечатления подробнее.';
            if (this.state.body.length > 100) throw 'Длина отзыва ограничена 100 символами.';
            let comment = {
                user: {
                    userId: this.props.user._id,
                    firstname: this.props.user.firstname,
                    lastname: this.props.user.lastname,
                    avatarLink: this.props.user.avatarLink
                },
                rating: Number(this.state.rating),
                body: this.state.body,
                moderation: false
            };
            console.log(comment);
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
                data.date = "Комментарий отправлен на проверку";
                arr.push(data);
                this.setState({commentsArr: arr});
                this.setState({ snackbar:
                        <Snackbar
                            layout="vertical"
                            onClose={() => this.setState({ snackbar: null })}
                        >
                            Комментарий отправлен на модерацию. После проверки он появится в профиле мастера.
                        </Snackbar>
                });
            }); // парсит JSON ответ в Javascript объект
    }
    getDate(comDate) {
        if (comDate === "Комментарий отправлен на проверку") {
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
                            <Cell multiline>{
                                comment.moderation === true ? comment.body :
                                    <Cell before={<Icon24CommentOutline/>}>Отзыв находится на модерации</Cell>
                            }
                            </Cell>
                            <Cell indicator={comment.rating+` из 5`}>Оценка</Cell>
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
                        <FormLayoutGroup>
                            <Cell
                                description={'Поставьте оценку мастеру'}
                            >
                                    <Div style={{display: 'inline-flex'}}>
                                        {
                                            this.state.stars.map(star=> {
                                                return star
                                            })
                                        }
                                    </Div>
                            </Cell>
                        </FormLayoutGroup>
                        {/*<Slider*/}
                        {/*    step={1}*/}
                        {/*    min={1}*/}
                        {/*    max={5}*/}
                        {/*    value={Number(this.state.rating)}*/}
                        {/*    onChange={rating=>this.setState({rating})}*/}
                        {/*    top={"Моя оценка работы мастера: "+this.state.rating}*/}
                        {/*    bottom='Перемещайте ползунок влево или вправо для изменения оценки'*/}
                        {/*/>*/}
                        <Textarea
                            name={'body'}
                            value={this.state.body}
                            bottom={this.state.body.length > 20 ? '' : 'Опишите подробнее. Отзыв должен состоять от 20 до 100 символов. Сейчас '+this.state.body.replace(/ /g, "").length+' из 100.' }
                            top={"Добавление отзыва"}
                            placeholder="Опишите, что вам понравилось или не понравилось в работе мастера"
                            onChange={this.handleChange}
                        />
                        <Button
                            mode="primary"
                            onClick={() => this.sendComment()}
                        >
                            Добавить отзыв
                        </Button>
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