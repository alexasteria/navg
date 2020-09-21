import React from 'react'
import {Cell, List, Spinner, Button, Banner, MiniInfoCell} from "@vkontakte/vkui"
import {BACKEND} from "../func/func"
import Icon24Done from '@vkontakte/icons/dist/24/done'
import {connect} from "react-redux"
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron'

class CategoriesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoad: false
        }
    }

    componentDidMount() {
        this.loadCategories()
    }

    loadCategories = () => {
        fetch(BACKEND.category.getAll)
            .then(res => res.json())
            .then(categories => {
                categories.unshift({_id: 'all', label: 'Мастера всех категорий'})
                this.setState({categories: categories, isLoad: true})
            })
            .catch(error => {
                console.log(error) // Error: Not Found
            })
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
                                <React.Fragment>
                                    <Banner
                                        key={category._id}
                                        onClick={()=>this.props.setCategory(category)}
                                        mode="image"
                                        header={category.label}
                                        subheader={
                                            category.subcat &&
                                            category.subcat.map((subcat, index)=>{
                                                if (index < category.subcat.length-1){
                                                    return <span style={{display: 'inline-flex'}}>{subcat.label}<Icon16Chevron /></span>
                                                } else {
                                                    return subcat.label
                                                }
                                            })
                                        }
                                        background={
                                            this.props.scheme !== 'space_gray' ?
                                            <div style={{background: 'linear-gradient(#ea9696, #c593b1)'}}/> :
                                            <div />
                                        }
                                        //actions={<Button onClick={()=>this.props.setCategory(category)} mode="overlay_primary">Выбрать</Button>}
                                    />
                                    {/*<Cell*/}
                                    {/*    key={category._id}*/}
                                    {/*    onClick={()=>this.props.setCategory(category)}*/}
                                    {/*    asideContent={this.props.targetCategory === category ?*/}
                                    {/*        <Icon24Done fill="var(--accent)"/> : null}*/}
                                    {/*>*/}
                                    {/*    {category.label}*/}
                                    {/*</Cell>*/}
                                </React.Fragment>
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
    }
}

export default connect(putStateToProps)(CategoriesList)