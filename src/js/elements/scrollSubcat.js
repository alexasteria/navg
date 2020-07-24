import React from 'react';
import {Counter, HorizontalScroll, Tabs, TabsItem} from "@vkontakte/vkui";

function countSubcat(id,props){
    let count = 0;
    props.mastersList.map((master)=>{
        if (master.categories.subcat){
            if(master.categories.subcat.includes(id)) {count++}
        }
    });
    return count
}

const scrollSubcat = (props) => {
    if(props.targetCategory._id!=='all') {
        return (
            <HorizontalScroll>
                <Tabs>
                    {
                        props.targetCategory.subcat.map(subcat=>{
                            return (
                                <TabsItem
                                    after={<Counter size='s'>{countSubcat(subcat._id, props)}</Counter>}
                                    key={subcat._id}
                                    id={subcat._id}
                                    onClick={props.checkSubcat}
                                    selected={props.filter.includes(subcat._id)}
                                >
                                    {subcat.label}
                                </TabsItem>
                            )
                        })
                    }
                </Tabs>
            </HorizontalScroll>
        )
    } else {
        return null
    }
};

export default scrollSubcat;