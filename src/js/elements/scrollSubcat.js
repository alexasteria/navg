import React from 'react';
import {Button, Counter, HorizontalScroll} from "@vkontakte/vkui";

function countSubcat(id,props){
    let count = 0;
    props.mastersList.map((master)=>{
        if (master.categories.subcat){
            if(master.categories.subcat.includes(id)) {count++}
        }
    });
    return count
}

export default function ScrollSubcat(props){
    const subcatStyle = {
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 10
    };
    if(props.targetCategory._id!=='all'){
        return(
            <HorizontalScroll>
                <div style={{display: 'flex'}}>
                    {
                        props.targetCategory.subcat.map(subcat=>{
                            return (
                                <div style={{subcatStyle}} key={subcat._id}>
                                    <Button
                                        after={<Counter size='s'>{countSubcat(subcat._id, props)}</Counter>}
                                        id={subcat._id}
                                        onClick={props.checkSubcat}
                                        style={{margin: '4px 4px 0px 0px'}}
                                        mode="outline"
                                    >
                                        {subcat.label}
                                    </Button>
                                </div>
                            )
                        })
                    }
                </div>
            </HorizontalScroll>
        )
    } else {
        return null
    }
}