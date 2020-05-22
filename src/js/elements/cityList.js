import React from 'react';
import {Cell, List, Search, Spinner, withModalRootContext} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types'

class CityList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            isLoad: true,
            cities: [
                {id: 621, title: 'Дзержинск'},
                {id: 1, title: 'Другой город'}
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
        const search = this.state.search.toLowerCase();
        const token = '17e5eb3d17e5eb3d17e5eb3dee17888047117e517e5eb3d4a4130ddab66ef8955df224b';
        bridge.send("VKWebAppCallAPIMethod", {
            "method": "database.getCities",
            "params": {
                "country_id": 1,
                "q": search,
                "v": "5.103",
                "access_token": token
            }
        })
            .then(result => {
                this.setState({cities: result.response.items, isLoad: true}, () => this.props.updateModalHeight())
            })
            .catch(e => console.log(e))
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
                    {this.state.cities.length > 0 &&
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
                    </List>
                    }
                </React.Fragment>
            );
        }
    }
}
export default withModalRootContext (CityList)