import React from 'react';
import HeadCity from "../elements/headCity";
import {PanelHeader, SelectMimicry, Spinner, Div, Panel, View, Placeholder} from "@vkontakte/vkui";
import MastersList from './mastersList';
import ScrollSubcat from '../elements/scrollSubcat'
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll} from "../store/actions";
import {bindActionCreators} from "redux";
import bridge from '@vkontakte/vk-bridge';
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline';

class Masters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoad:false,
            filter: []
        };
    }

    componentDidMount() {
        if (this.props.mastersList.length === 0) {
            this.loadList()
        } else {
            this.setState({filteredList: this.props.mastersList, isLoad: true});
        }
    }

    componentWillMount() {
        if (this.props.mastersListScroll){
            //window.scrollTo(0, this.props.mastersListScroll)
            bridge.send("VKWebAppScroll", {"top": this.props.mastersListScroll});
        }
    }

    componentWillUnmount() {
        this.props.changeMasterslistScroll(window.self.pageYOffset);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.targetCity !== this.props.targetCity) {
            this.setState({isLoad: false},()=>this.loadList())
        }
    }

    loadList = () => {
        if(this.props.targetCategory === '') {
            fetch(BACKEND.masters.category+'all/'+this.props.targetCity.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.props.changeMastersList(mastersList);
                    this.filter();
                })
                .catch(e=>this.setState({warnConnection: true}))
        } else {
            fetch(BACKEND.masters.category+this.props.targetCategory._id+'/'+this.props.targetCity.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.props.changeMastersList(mastersList);
                    this.filter();
                })
                .catch(e=>this.setState({warnConnection: true}))
        }
    };

    checkSubcat = (e) => {
        if(this.state.filter.includes(e.currentTarget.id)){
            let index = this.state.filter.indexOf(e.currentTarget.id);
            let filter = this.state.filter;
            if (index > -1) {
                filter.splice(index, 1);
            } else filter.splice(0, index);
            this.setState({filter: filter}, ()=> this.filter());
        } else {
            let filter = this.state.filter;
            filter.push(e.currentTarget.id);
            this.setState({filter: filter}, ()=> this.filter());
        }
    };

    filter() {
        if(this.state.filter.length === 0) {
            this.setState({filteredList: this.props.mastersList, isLoad: true})
        } else {
            let filteredList = this.props.mastersList.filter(master=> {
                let i = 0;
                this.state.filter.forEach(filter=>{
                    if(master.categories.subcat){
                        if(master.categories.subcat.includes(filter)) i++
                    }else{
                        return false
                    }
                });
                if (i>0) return true
            });
            this.setState({filteredList: filteredList,isLoad: true});
        }
    }

    render() {
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
        } else {
            const {targetCategory, user} = this.props;
            return (
                // <React.Fragment>
                <Panel id="mastersList">
                    <PanelHeader>Мастера</PanelHeader>
                    <HeadCity changeCity={()=>this.props.changeCity()}/>
                    <Div>
                        <SelectMimicry
                            top="Выберите категорию"
                            placeholder="Показаны мастера всех категорий"
                            onClick={user.location.city === 'Не определено' ?
                                this.props.openSnack('Сначала выберите город') :
                                this.props.changeCategory
                            }
                        >{targetCategory.label}</SelectMimicry>
                        {
                            targetCategory && this.state.isLoad &&
                            <ScrollSubcat
                                targetCategory={targetCategory}
                                mastersList={this.props.mastersList}
                                checkSubcat={(e)=>this.checkSubcat(e)}
                                filter={this.state.filter}
                            />
                        }
                    </Div>
                    {
                        this.state.isLoad ?
                            <MastersList
                                openSnack={this.props.openSnack}
                                mastersList={this.state.filteredList}
                                category={targetCategory}
                                city={user.location.city}
                                openPanelMaster={this.props.openPanelMaster}
                            /> :
                            <Spinner size="large" style={{ marginTop: 20 }} />
                    }
                    {this.props.snackbar}
                    {/*</React.Fragment>*/}
                </Panel>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        mastersList: state.mastersList,
        targetCategory: state.targetCategory,
        targetCity: state.targetCity,
        mastersListScroll: state.mastersListScroll,
        user: state.user
    };
};

const putActionsToProps = (dispatch) => {
    return {
        changeMastersList: bindActionCreators(changeMastersList, dispatch),
        changeTargetCategory: bindActionCreators(changeTargetCategory, dispatch),
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
        changeMasterslistScroll: bindActionCreators(changeMasterslistScroll, dispatch)
    };
};

export default connect(putStateToProps, putActionsToProps)(Masters);