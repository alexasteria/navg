import React from 'react';
import {Cell, List, Spinner} from "@vkontakte/vkui";
import {BACKEND} from "../func/func";
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {connect} from "react-redux";

class CategoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false
        };
    }

    componentDidMount() {
        this.loadCategories()
    }

    loadCategories = () => {
        fetch(BACKEND.category.getAll)
            .then(res => res.json())
            .then(categories => {
                categories.unshift({_id: 'all', label: 'Мастера всех категорий'});
                this.setState({categories: categories, isLoad: true})
            })
            .catch(error => {
                console.log(error); // Error: Not Found
            });
    };

    render() {
        if (this.state.isLoad === false){
            return(
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Spinner size="large" style={{ marginTop: 20 }} />
                </div>
            )
        } else {
            return(
                <List>
                    {
                        this.state.categories.map(category => {
                            return (
                                <Cell
                                    key={category._id}
                                    onClick={()=>this.props.setCategory(category)}
                                    asideContent={this.props.targetCategory === category ?
                                        <Icon24Done fill="var(--accent)"/> : null}
                                >
                                    {category.label}
                                </Cell>
                            )
                        })
                    }
                </List>
            )
        }
    }
}

const putStateToProps = (state) => {
    return {
        targetCategory: state.targetCategory
    };
};

export default connect(putStateToProps)(CategoriesList);