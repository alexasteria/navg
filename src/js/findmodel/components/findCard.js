import React from 'react';
import {Avatar, Card, CardGrid, Cell, RichCell, Button, Counter, SimpleCell, MiniInfoCell} from "@vkontakte/vkui";
import Icon24MoneyCircle from '@vkontakte/icons/dist/24/money_circle';

export default function FindCard(props) {
    return (
        <CardGrid key={props.key}>
            <Card size="l">
                <RichCell
                    disabled
                    before={<Avatar size={52} src={props.find.avatarLink}/>}
                    caption={props.date}
                >
                    {props.find.firstname} {props.find.lastname}
                </RichCell>
                <Cell multiline>
                    {props.find.body}
                </Cell>
                <CardGrid style={{marginBottom: 10}}>
                    {
                        props.find.images.map((image, i) => {
                            return (
                                <Card
                                    style={{padding: 2, borderRadius: 13, margin: 0}}
                                    size="s"
                                    mode="shadow"
                                    key={i}
                                >
                                    <div style={{
                                        borderRadius: 13,
                                        height: 96,
                                        backgroundImage: 'url(' + image + ')',
                                        backgroundSize: 'cover'
                                    }}/>
                                </Card>
                            )
                        })
                    }
                </CardGrid>
                <SimpleCell width={15} height={15} before={<Icon24MoneyCircle/>}>{props.find.sale}</SimpleCell>
                <SimpleCell
                    onClick={() => props.openMasterOnId(props.find.masterId)}
                    expandable
                >Записаться</SimpleCell>
            </Card>
        </CardGrid>
    )
}