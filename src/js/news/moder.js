import React from 'react';
import {
    Placeholder,
    RichCell,
    Avatar, Tabs, CardGrid, Card, Button, TabsItem, Panel, Textarea, Cell
} from "@vkontakte/vkui"
import Icon56LikeOutline from '@vkontakte/icons/dist/56/like_outline';

import {BACKEND} from "../func/func";
import Head from "../elements/panelHeader";
import {connect} from "react-redux";

class Moder extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            mastersList: [],
            activeTab: 'masters',
            comments: [],
            mastersCount: 0,
            usersCount: 0
        };
    }

    handleChange = (event) => {
        let {name, value} = event.target;
        this.setState({[name]: value});
    };

    componentDidMount() {
        fetch(BACKEND.moder, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(this.props.params), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .then(mastersList => {
                this.setState({mastersList: mastersList})
            })
            .catch(e=>console.log(e))
        fetch(BACKEND.comment.moderation,{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(this.props.params), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .then(comments => {
                this.setState({comments: comments})
            });
    }

    good = (id, index) => {
        let mastersList = this.state.mastersList;
        if (index > -1) {
            mastersList.splice(index, 1);
        } else mastersList.splice(0, index);
        this.setState({mastersList: mastersList});
        let moderation = {
            id: id,
            status: true,
            reasons: [],
            params: this.props.params
        };
        fetch(BACKEND.moder+'good', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(moderation), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .catch(e=>console.log(e))
    };

    bad = (id, index) => {
        let mastersList = this.state.mastersList;
        // if (index > -1) {
        //     mastersList.splice(index, 1);
        // } else mastersList.splice(0, index);
        // this.setState({mastersList: mastersList});
        let reasons = [];
        reasons.push(this.state.reason);
        mastersList[index].moderation.reasons = reasons;
        let moderation = {
            id: id,
            status: false,
            reasons: reasons,
            params: this.props.params
        };
        fetch(BACKEND.moder+'bad', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(moderation), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .catch(e=>console.log(e))
        this.setState({mastersList: mastersList});
    };

    goodComment = (id, index) => {
        let comments = this.state.comments;
        if (index > -1) {
            comments.splice(index, 1);
        } else comments.splice(0, index);
        this.setState({comments: comments});
        let moderation = {
            id: id,
            params: this.props.params
        };
        console.log(BACKEND.moderCom+'good');
        fetch(BACKEND.moderCom+'good', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(moderation), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .then(res=>console.log(res))
            .catch(e=>console.log(e))
    };

    badComment = (id, index) => {
        let comments = this.state.comments;
        if (index > -1) {
            comments.splice(index, 1);
        } else comments.splice(0, index);
        this.setState({comments: comments});
        let moderation = {
            id: id,
            params: this.props.params
        };
        console.log(BACKEND.moderCom+'bad');
        fetch(BACKEND.moderCom+'bad', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(moderation), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(res => res.json())
            .then(res=>console.log(res))
            .catch(e=>console.log(e))
    };

    renderComments() {
        if (this.state.comments.length === 0){
            return (
                <Placeholder
                    icon={<Icon56LikeOutline/>}
                    header="На модерации"
                >Пока никого нет
                </Placeholder>
            )
        }
        return this.state.comments.map((comment, index)=> {
            if (comment === null) return null;
            return (
                <CardGrid key={index} style={{padding: 0}}>
                    <Card size="l" mode="shadow">
                        <RichCell
                            disabled
                            multiline
                            actions={
                                <React.Fragment>
                                    <Button onClick={()=>this.goodComment(comment._id, index)}>Одобрить</Button>
                                    <Button onClick={()=>this.badComment(comment._id, index)} mode="destructive">Удалить</Button>
                                </React.Fragment>
                            }
                        >
                            {comment.body}
                        </RichCell>
                    </Card>
                </CardGrid>
            )
        })
    }

    renderMasters() {
        if(this.state.mastersList.length === 0){
            return (
                <Placeholder
                    icon={<Icon56LikeOutline/>}
                    header="На модерации"
                >Пока никого нет
                </Placeholder>
            )
        } else {
            return this.state.mastersList.map((master, index) => {
                return (
                    <CardGrid key={master.vkUid} style={{padding: 0}}>
                        <Card size="l" mode="shadow">
                            <RichCell
                                disabled
                                multiline
                                before={<Avatar onClick={() => this.props.openMaster(master)} src={master.avatarLink} size={70}/>}
                                caption={master.location.city.title}
                                actions={
                                    <React.Fragment>
                                        <Cell>
                                            <Button onClick={()=>this.good(master._id, index)}>Одобрить</Button>
                                            <Button onClick={()=>this.setState({[master.vkUid]: true})} mode="secondary">Отклонить</Button>
                                        </Cell>
                                    </React.Fragment>
                                }
                            >
                                {master.firstname} {master.lastname}
                            </RichCell>
                            {
                                master.moderation.reasons.length > 0 &&
                                <Cell>
                                    {
                                        master.moderation.reasons.map(reason=>{
                                            return reason
                                        })
                                    }
                                </Cell>
                            }
                            {
                                this.state[master.vkUid] === true &&
                                <Cell>
                                    <Textarea name='reason' value={this.state.reason} onChange={(event)=>{
                                        console.log(this.state.reason);
                                        this.setState({reason: event.target.value})
                                    }
                                    }/>
                                    <Button onClick={()=>this.bad(master._id, index)} mode="secondary">Отклонить</Button>
                                </Cell>
                            }
                        </Card>
                    </CardGrid>
                );
            })
        }
    };

    render(){
        return (
            <Panel id="moder">
                <Head
                    title={'Модерация'}
                    goBack={() => this.props.goBack()}
                />
                    <div>
                        <Tabs>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'masters' })}
                                selected={this.state.activeTab === 'masters'}
                            >
                                Мастера
                            </TabsItem>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'comments' })}
                                selected={this.state.activeTab === 'comments'}
                            >
                                Комментарии
                            </TabsItem>
                        </Tabs>
                        {
                            this.state.activeTab === 'masters' ? this.renderMasters() : this.renderComments()
                        }
                    </div>
            </Panel>
        );
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master,
        params: state.params
    };
};

const putActionsToProps = (dispatch) => {
    return {

    };
};

export default connect(putStateToProps, putActionsToProps)(Moder);