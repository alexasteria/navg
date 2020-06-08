import React from 'react';
import HeadCity from "../elements/headCity";
import {PanelHeader, SelectMimicry, Spinner, Div} from "@vkontakte/vkui";
import MastersList from './mastersList';
import ScrollSubcat from '../elements/scrollSubcat'
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'
import {connect} from "react-redux";
import {changeMastersList, changeTargetCategory, changeTargetCity, changeMasterslistScroll} from "../store/actions";
import {bindActionCreators} from "redux";

class Masters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoad:false,
            filter: []
        };
    }

    componentDidMount() {
        console.log(window.history);
        if (this.props.mastersList.length === 0) {
            this.loadList()
        } else {
            this.setState({filteredList: this.props.mastersList, isLoad: true}, ()=> {
                if (this.props.mastersListScroll){
                    window.scrollTo(0, this.props.mastersListScroll)
                }
            });
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
                });
        } else {
            fetch(BACKEND.masters.category+this.props.targetCategory._id+'/'+this.props.targetCity.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.props.changeMastersList(mastersList);
                    this.filter();
                });
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
        const {targetCategory, user} = this.props;
            return (
                <React.Fragment>
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
                </React.Fragment>
            )
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