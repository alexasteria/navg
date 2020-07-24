import React from 'react';
import {Cell, List, Panel, Placeholder, Search, Spinner, withModalRootContext} from '@vkontakte/vkui';
import PropTypes from 'prop-types'
import Icon56PlaceOutline from '@vkontakte/icons/dist/56/place_outline';
import Head from "./panelHeader";
import {BACKEND} from "../func/func";

class CityList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            isLoad: false,
            cities: [
                {id: 621, title: 'Дзержинск'},
                {id: 49, title: 'Екатеринбург'}
            ]
        };
        this.onChange = this.onChange.bind(this);

    }
    static propTypes = {
        // Сообщает ModalRoot, что высота модальной страницы могла измениться
        updateModalHeight: PropTypes.func,
    };
    componentDidMount() {
        this.getCities()
    }

    getCities() {
        const data = {
            search: this.state.search.toLowerCase(),
            country_id: 1,
        };
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
                    this.setState({cities: res.cityList, isLoad: true})
                }
            })
            .catch(e=>console.log(e));
}

    onChange(e) {
        this.setState({search: e.target.value});
        this.getCities()
    }

    render() {
        if(this.state.isLoad === false) {
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                        <React.Fragment>
                            <Search value={this.state.search} onChange={this.onChange} after={null}/>
                            {this.state.cities.length > 0 ?
                            <List>
                                {this.state.cities.map(city =>
                                    <Cell
                                        description={city.region || ''}
                                        onClick={()=>this.props.changeCity(city)}
                                        key={city.id}
                                    >
                                        {city.title}
                                    </Cell>
                                )}
                            </List> :
                                <Placeholder
                                    icon={<Icon56PlaceOutline />}
                                    header="Город не найден"
                                >
                                    Проверьте опечатки или измените критерии поиска
                                </Placeholder>
                            }
                        </React.Fragment>
            );
        }
    }
}
export default withModalRootContext (CityList)