import React from 'react'
import HeadCity from "../elements/headCity"
import {Div, Panel, PanelHeader, Placeholder, SelectMimicry, Spinner} from "@vkontakte/vkui"
import MastersList from './mastersList'
import ScrollSubcat from '../elements/scrollSubcat'
import {BACKEND} from "../func/func"
import {connect} from "react-redux"
import {
    changeMastersList,
    changeMasterslistScroll,
    changeTargetCategory,
    changeTargetCity,
    setFilter
} from "../store/actions"
import {bindActionCreators} from "redux"
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline'
import Icon24Filter from '@vkontakte/icons/dist/24/filter';

class Masters extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoad: false,
            filter: []
        }
    }

    componentDidMount() {
        if (this.props.mastersList.length === 0) {
            this.loadList()
        } else {
            this.setState({filteredList: this.props.mastersList, isLoad: true})
        }
    }

    componentWillMount() {
        if (this.props.mastersListScroll) {
            window.scrollTo(0, this.props.mastersListScroll)
        }
    }

    componentWillUnmount() {
        this.props.changeMasterslistScroll(window.self.pageYOffset)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.targetCity !== this.props.targetCity) {
            this.setState({isLoad: false}, () => this.loadList())
        }
    }

    loadList = () => {
        this.props.setFilter([])
        if (this.props.targetCategory === '') {
            fetch(BACKEND.masters.category + 'all/' + this.props.user.location.country.id + '/' + this.props.targetCity.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.props.changeMastersList(mastersList)
                    this.filter()
                })
                .catch(e => this.setState({warnConnection: true}))
        } else {
            fetch(BACKEND.masters.category + this.props.targetCategory._id + '/' + this.props.user.location.country.id + '/' + this.props.targetCity.id)
                .then(res => res.json())
                .then(mastersList => {
                    this.props.changeMastersList(mastersList)
                    this.filter()
                })
                .catch(e => this.setState({warnConnection: true}))
        }
    };

    checkSubcat = (e) => {
        if (this.props.filter.includes(e.currentTarget.id)) {
            let index = this.props.filter.indexOf(e.currentTarget.id)
            let filter = this.props.filter
            if (index > -1) {
                filter.splice(index, 1)
            } else filter.splice(0, index)
            this.setState({filter: filter}, () => this.filter())
        } else {
            let filter = this.props.filter
            filter.push(e.currentTarget.id)
            this.props.setFilter(filter)
            this.filter()
        }
    };

    filter() {
        if (this.props.filter.length === 0) {
            this.setState({filteredList: this.props.mastersList, isLoad: true})
        } else {
            let filteredList = this.props.mastersList.filter(master => {
                let i = 0
                this.props.filter.forEach(filter => {
                    if (master.categories.subcat) {
                        if (master.categories.subcat.includes(filter)) i++
                    } else {
                        return false
                    }
                })
                if (i > 0) return true
            })
            this.setState({filteredList: filteredList, isLoad: true})
        }
    }

    render() {
        if (this.state.warnConnection) {
            return (
                <React.Fragment>
                    <HeadCity changeCity={() => this.props.changeCity()}/>
                    <Placeholder
                        stretched
                        icon={<Icon56WifiOutline/>}
                        header={'Что-то не так!'}
                    >
                        Проверьте интернет-соединение.
                    </Placeholder>
                    {this.state.snackbar}
                </React.Fragment>
            )
        } else {
            const {targetCategory, user} = this.props
            return (
                <Panel id="mastersList">
                    <PanelHeader>Мастера</PanelHeader>
                    <HeadCity changeCity={() => this.props.changeCity()}/>
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
                                checkSubcat={(e) => this.checkSubcat(e)}
                                filter={this.props.filter}
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
                            <Spinner size="large" style={{marginTop: 20}}/>
                    }
                    {this.props.snackbar}
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
        user: state.user,
        filter: state.filter
    }
}

const putActionsToProps = (dispatch) => {
    return {
        changeMastersList: bindActionCreators(changeMastersList, dispatch),
        changeTargetCategory: bindActionCreators(changeTargetCategory, dispatch),
        changeTargetCity: bindActionCreators(changeTargetCity, dispatch),
        changeMasterslistScroll: bindActionCreators(changeMasterslistScroll, dispatch),
        setFilter: bindActionCreators(setFilter, dispatch)
    }
}

export default connect(putStateToProps, putActionsToProps)(Masters)