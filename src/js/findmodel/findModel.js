import React from 'react';
import {BACKEND} from "../func/func";
import FindList from './components/findList';
import HeadCity from '../elements/headCity'
import Spin from '../elements/spinner'
import bridge from "@vkontakte/vk-bridge";


class FindModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false
        };
    }
    componentDidMount() {
        if(!this.state.findArr){
            this.loadFind()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props) {
            this.setState({isLoad: false},()=>this.loadFind())
        }
    }

    loadFind = () =>{
            fetch(BACKEND.findModel.onCity+this.props.user.location.city.id)//ловим обьявления по городу юзера
                .then(res => res.json())
                .then(find => {this.setState({findArr: find, isLoad: true});});
    };

    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866'})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };
    render(){
        if (this.state.isLoad === false){
            return (<Spin/>)
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
                        share={()=>this.share}
                        user={this.props.user}
                    />
                </React.Fragment>
            );
        }
    }
}

export default FindModel;