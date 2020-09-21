import React from 'react'
import {Cell, List, Panel, Placeholder, Search, Spinner, Select, SimpleCell, Subhead} from '@vkontakte/vkui'
import Icon56PlaceOutline from '@vkontakte/icons/dist/56/place_outline'
import {BACKEND} from "../func/func"
import {connect} from "react-redux"

class CityList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            search: '',
            isLoad: false,
            cities: [],
            countryList: [],
            targetCountry: null
        }
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        if (this.props.user.location.country) this.setState({targetCountry: this.props.user.location.country}, ()=>this.getCities(this.state.search, this.state.targetCountry))
        this.getCountries()
    }

    getCountries(){
        fetch(BACKEND.vkapi.getCountries)
            .then(res=>res.json())
            .then(res=>{
                this.setState({countryList: res.countryList, isLoad: true})
            })
            .catch(e=>console.log(e))
    }

    getCities(filter, country) {
        this.setState({loading: true})
        const data = {
            search: filter.toLowerCase(),
            country_id: country.id,
        }
        fetch(BACKEND.vkapi.getCities,{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data),
        })
            .then(res=>res.json())
            .then(res=>{
                if (res.error){
                    console.log(res.error)
                } else {
                    this.setState({cities: res.cityList, isLoad: true, loading: false})
                }
            })
            .catch(e=>console.log(e))
}

    renderCityList = () => {
        if (this.state.cities.length > 0){
            return (
                <List>
                    {this.state.cities.map(city =>
                        <Cell
                            description={city.region || ''}
                            onClick={()=>this.props.changeCity({city: city, country: this.state.targetCountry})}
                            key={city.id}
                        >
                            {city.title}
                        </Cell>
                    )}
                </List>
            )
        } else {
            return (
                <Placeholder
                    icon={<Icon56PlaceOutline />}
                    header="Город не найден"
                >
                    Проверьте опечатки или измените критерии поиска
                </Placeholder>
            )
        }
    }

    onChange(e) {
        this.setState({search: e.target.value})
        this.getCities(e.target.value, this.state.targetCountry)
    }

    render() {
        if(this.state.isLoad === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                        <React.Fragment>
                                {
                                    this.state.changeCountry ?
                                        <Select
                                            onChange={(e)=>{
                                                const country = this.state.countryList.map(country=>{
                                                    if (country.id === Number(e.target.value)) return country
                                                })
                                                this.setState({targetCountry: country.filter(Boolean)[0], changeCountry: false}, ()=> this.getCities(this.state.search, this.state.targetCountry))
                                            }}
                                            placeholder={'Выберите страну'}
                                        >
                                            {
                                                this.state.countryList.map(country=>{
                                                    if (country.id === this.props.user.location.country.id){
                                                        console.log(country.id === this.props.user.location.country.id)
                                                        return <option value={country.id} selected>{country.title}</option>
                                                    } else {
                                                        return <option value={country.id}>{country.title}</option>
                                                    }
                                                })
                                            }
                                        </Select> :
                                        <SimpleCell
                                            expandable
                                            onClick={()=>this.setState({changeCountry: true})}
                                            indicator={<Subhead weight="regular">{this.state.targetCountry ? this.state.targetCountry.title : this.props.user.location.country.title}</Subhead>}
                                        ><Subhead weight="regular">Выбранная страна</Subhead></SimpleCell>
                                }
                            {
                                this.state.targetCountry !== null ?
                                    <React.Fragment>
                                        <Search value={this.state.search} onChange={this.onChange} after={null}/>
                                        {
                                            this.state.loading ?
                                                <Spinner size="large" style={{ marginTop: 20 }} /> :
                                            this.renderCityList()
                                        }
                                    </React.Fragment> :
                                <Placeholder
                                icon={<Icon56PlaceOutline />}
                                header="Выберите страну"
                                >
                                Если нужной Вам страны нет в списке - напишите нам!
                                </Placeholder>
                            }
                        </React.Fragment>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(putStateToProps) (CityList)