import React from 'react';
import {Cell, List, Search, withModalRootContext } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types'

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
                this.setState({cities: result.response.items}, () => this.props.updateModalHeight())
            })
            .catch(e => console.log(e))
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