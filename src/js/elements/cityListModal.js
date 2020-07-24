import React from 'react';
import {Cell, List, Search, withModalRootContext } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types'
import {BACKEND} from "../func/func";

class CityListModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            cities: [{id:1, title: 'City'}]
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
        return (
            <React.Fragment>
                <Search value={this.state.search} onChange={this.onChange} after={null}/>
                {this.state.cities.length > 0 &&
                <List>
                    {this.state.cities.map(city =>
                        <Cell
                            description={city.region || ''}
                            onClick={()=>this.props.changeTargetCity(city)}
                            key={city.id}
                        >
                            {city.title}
                        </Cell>
                    )}
                </List>
                }
            </React.Fragment>
        );
    }
}
export default withModalRootContext (CityListModal)