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
        this.loadList()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props) {
            this.setState({isLoad: false},()=>this.loadList())
        }
    }

    loadList = () => {
        if(this.props.targetCategory === '') {
            fetch(BACKEND.masters.category+'all/'+this.props.user.location.city.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.setState({mastersList: mastersList}, ()=> this.filter());
                    this.setTitle(mastersList.length)
                });
        } else {
            fetch(BACKEND.masters.category+this.props.targetCategory._id+'/'+this.props.user.location.city.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.setState({mastersList: mastersList}, ()=> this.filter());
                    this.setTitle(mastersList.length)
                });
        }
    };

    setTitle(count) {
        if (count === undefined){
            this.setState({title: 'Мы никого не нашли :( пока не нашли...'});
        } else {
            this.setState({title: 'Найдено мастеров: '+count});
        }
    }

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
            this.setState({filteredList: this.state.mastersList,isLoad: true}, ()=>this.setTitle(this.state.mastersList.length))
        } else {
            let filteredList = this.state.mastersList.filter(master=> {
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
            this.setState({filteredList: filteredList,isLoad: true}, ()=>this.setTitle(filteredList.length));
        }
    }

    render() {
        return (
            <React.Fragment>
                <PanelHeader>Мастера</PanelHeader>
                <HeadCity
                    userCity={this.props.user.location.city}
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
                        mastersList={this.state.mastersList}
                        checkSubcat={(e)=>this.checkSubcat(e)}
                    />
                }
                <Group separator="hide" header={<Header mode="secondary">{this.state.title}</Header>}>
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
                </Group>
            </React.Fragment>
        )
    }
}