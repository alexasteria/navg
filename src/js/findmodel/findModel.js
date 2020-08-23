import React from 'react';
import {BACKEND} from "../func/func";
import FindList from './components/findList';
import HeadCity from '../elements/headCity'
import {Button, ConfigProvider, Footer, Panel, Placeholder, Spinner, View} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changeFindModelsList, changeFindModelsListScroll,} from "../store/actions";
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline';


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
                    //window.scrollTo(0, this.props.findModelsListScroll)
                    bridge.send("VKWebAppScroll", {"top": this.props.findModelsListScroll, "speed": 600});
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
                    this.props.changeFindModelsList(find);
                    this.setState({findArr: find, isLoad: true});
                })
                .catch(e=>this.setState({warnConnection: true}))
    };

    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938'})
            .then(result => {
                if (result.type === 'VKWebAppShareResult'){
                    this.openSnackAvatar('Ссылка на приложение отправлена.', this.state.activeMaster.avatarLink)
                }
            })
    };
    render(){
        if (this.state.warnConnection){
            return (
                <React.Fragment>
                    <HeadCity changeCity={()=>this.props.changeCity()}/>
                            <Placeholder
                                stretched
                                icon={<Icon56WifiOutline />}
                                header={'Что-то не так!'}
                                //action={<Button size="l" onClick={()=>this.auth(this.props.launchParams)}>Повторить</Button>}
                            >
                                Проверьте интернет-соединение.
                            </Placeholder>
                            {this.state.snackbar}
                </React.Fragment>
            )
        } else if (this.state.isLoad === false){
            return (
                <React.Fragment>
                    <HeadCity
                        changeCity={()=>this.props.changeCity()}
                    />
                    <Spinner size="large" style={{ marginTop: 20 }} />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <HeadCity
                        changeCity={()=>this.props.changeCity()}
                    />
                    <FindList
                        findArr={this.state.findArr}
                        share={this.share}
                        user={this.props.user}
                        openMasterOnId={this.props.openMasterOnId}
                    />
                    <Footer/>
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