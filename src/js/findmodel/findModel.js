import React from 'react';
import {BACKEND} from "../func/func";
import FindList from './components/findList';
import HeadCity from '../elements/headCity'
import Spin from '../elements/spinner'
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changeFindModelsList, changeFindModelsListScroll,} from "../store/actions";


class FindModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false
        };
    }
    componentDidMount() {
        if(this.props.findModelsList.length === 0){
            this.loadFind()
        } else {
            this.setState({findArr: this.props.findModelsList, isLoad: true}, ()=>{
                if (this.props.findModelsListScroll){
                    window.scrollTo(0, this.props.findModelsListScroll)
                }
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.targetCity !== this.props.targetCity) {
            this.setState({isLoad: false},()=>this.loadFind())
        }
    }

    componentWillUnmount() {
        this.props.changeFindModelsListScroll(window.self.pageYOffset);
    }

    loadFind = () =>{
            fetch(BACKEND.findModel.onCity+this.props.targetCity.id)//ловим обьявления по городу юзера
                .then(res => res.json())
                .then(find => {
                    this.setState({findArr: find, isLoad: true});
                    this.props.changeFindModelsList(find);
                });
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
                        changeCity={()=>this.props.changeCity()}
                    />
                    <FindList
                        findArr={this.state.findArr}
                        share={()=>this.share}
                        user={this.props.user}
                        openMasterOnId={this.props.openMasterOnId}
                    />
                </React.Fragment>
            );
        }
    }
}

const putStateToProps = (state) => {
    return {
        targetCity: state.targetCity,
        user: state.user,
        findModelsListScroll: state.findModelsListScroll,
        findModelsList: state.findModelsList
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeFindModelsList: bindActionCreators(changeFindModelsList, dispatch),
        changeFindModelsListScroll: bindActionCreators(changeFindModelsListScroll, dispatch),
    };
};

export default connect(putStateToProps, putActionsToProps)(FindModel);