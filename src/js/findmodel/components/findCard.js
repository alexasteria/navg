import React from 'react';
import {Avatar, Card, CardGrid, Cell} from "@vkontakte/vkui";

export default function FindCard(props){
    return (
        <CardGrid key={props.key}>
            <Card size="l">
                <Cell expandable
                      photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                      description={props.date}
                      before={<Avatar src={props.find.avatarLink} size={50}/>}
                      size="l"
                      onClick={()=>props.openMasterOnId(props.find.masterId)}
                      bottom=""
                >{props.find.firstname} {props.find.lastname}
                </Cell>
                <Cell multiline>
                    {props.find.body}
                </Cell>
                <CardGrid>
                    {
                        props.find.images.map((image,i)=>{
                            return (
                                <Card size='s' key={i}>
                                    <div style={{height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}} />
                                </Card>
                            )
                        })
                    }
                </CardGrid>
            </Card>
        </CardGrid>
    )
}