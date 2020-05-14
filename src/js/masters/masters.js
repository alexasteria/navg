import React from 'react';
import HeadCity from "../elements/headCity";
import {Group, Header, PanelHeader, SelectMimicry, Cell, Spinner} from "@vkontakte/vkui";
import MastersList from './mastersList';
import ScrollSubcat from '../elements/scrollSubcat'
import {BACKEND} from "../func/func";
import Spin from '../elements/spinner'

export default class Masters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoad:false,
            filter: []
        };
    }

    componentDidMount() {
        console.log('store',this.props);
        if (this.props.mastersList.length === 0) {
            this.loadList()
        } else {
            this.setState({filteredList: this.props.mastersList, isLoad: true}, ()=> {
                if (this.props.scroll){
                    console.log('scroll');
                    window.scrollTo(0, this.props.scroll)
                }
            });
        }
    }

    componentWillUnmount() {
        this.props.changeMasterslistScroll(window.self.pageYOffset);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.targetCity !== this.props.targetCity) {
            console.log('chnge city');
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
        let buttonSubcat = document.getElementById(e.currentTarget.id);
        if(buttonSubcat.style.backgroundColor==='lavender'){
            buttonSubcat.style.backgroundColor='#fff';
            let index = this.state.filter.indexOf(e.currentTarget.id);
            let filter = this.state.filter;
            if (index > -1) {
                filter.splice(index, 1);
            } else filter.splice(0, index);
            this.setState({filter: filter}, ()=> this.filter());
        } else {
            buttonSubcat.style.backgroundColor='lavender';
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
        return (
            <React.Fragment>
                <PanelHeader>Мастера</PanelHeader>
                <HeadCity
                    targetCity={this.props.targetCity}
                    changeCity={()=>this.props.changeCity()}
                />
                <SelectMimicry
                    top="Выберите категорию"
                    placeholder="Показаны мастера всех категорий"
                    onClick={this.props.user.location.city === 'Не определено' ?
                        this.props.openSnack('Сначала выберите город') :
                        this.props.changeCategory
                    }
                >{this.props.targetCategory.label}</SelectMimicry>
                {
                    this.props.targetCategory && this.state.isLoad &&
                    <ScrollSubcat
                        targetCategory={this.props.targetCategory}
                        mastersList={this.props.mastersList}
                        checkSubcat={(e)=>this.checkSubcat(e)}
                    />
                }
                    {
                        this.state.isLoad ?
                        <MastersList
                            openSnack={this.props.openSnack}
                            mastersList={this.state.filteredList}
                            category={this.props.targetCategory}
                            city={this.props.user.location.city}
                            openPanelMaster={this.props.openPanelMaster}
                        /> :
                            <Spin/>
                    }
            </React.Fragment>
        )
    }
}