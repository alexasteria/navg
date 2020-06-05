import React from 'react';
import {Avatar, Card, CardGrid, Cell, RichCell, Button, Counter} from "@vkontakte/vkui";

export default function FindCard(props){
    return (
        <CardGrid key={props.key}>
            <Card size="l">
                <RichCell
                    disabled
                    //after={<Icon28UserAddOutline />}
                    before={<Avatar size={72} src={props.find.avatarLink} />}
                    caption={props.date}
                    bottom={<Counter>{props.find.sale}</Counter>}
                    actions={
                        <React.Fragment>
                            <Button mode="outline" onClick={()=>props.openMasterOnId(props.find.masterId)}>На страницу мастера</Button>
                        </React.Fragment>
                    }
                >
                    {props.find.firstname} {props.find.lastname}
                </RichCell>
                <Cell multiline>
                    {props.find.body}
                </Cell>
                <CardGrid style={{marginBottom: 10}}>
                    {
                        props.find.images.map((image,i)=>{
                            return (
                                <Card
                                    style={{padding: 2, borderRadius: 13, margin: 0}}
                                    size="s"
                                    mode="shadow"
                                    key={i}
                                >
                                    <div style={{borderRadius: 13, height: 96, backgroundImage: 'url('+image+')', backgroundSize: 'cover'}} />
                                </Card>
                            )
                        })
                    }
                </CardGrid>
            </Card>
        </CardGrid>
    )
}