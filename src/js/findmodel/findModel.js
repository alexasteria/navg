import React from 'react';
import {Avatar, Cell, Div, Group, Separator, Spinner, Placeholder, Button} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import FindList from './components/findList';
import HeadCity from '../elements/headCity'
import bridge from "@vkontakte/vk-bridge";


class FindModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category, //{id: '1', label: 'Маникюр'},
            mastersList: [],
            title: '',
            master: {
                vkUid: 9999999999,
                avatarLink: "https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg",
                firstname: 'Евгения',
                lastname: 'Плюхова'
            },
            isLoad: false
        };
    }
    componentDidMount() {
        console.log(BACKEND.findModel.onCity+this.props.user.location.city.id);
        if(!this.state.findArr){
            fetch(BACKEND.findModel.onCity+this.props.user.location.city.id)//ловим обьявления по городу юзера
                .then(res => res.json())
                .then(find => {this.setState({findArr: find, isLoad: true});});
        }
    }
    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866'})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };
    render(){
        if (this.state.isLoad === false){
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <React.Fragment>
                    <HeadCity
                        userCity={this.props.user.location.city}
                        targetCity={this.props.targetCity}
                        changeCity={()=>this.props.changeCity()}
                    />
                    <FindList
                        findArr={this.state.findArr}
                    />
                </React.Fragment>
            );
        }
    }
}

export default FindModel;