import React from 'react';
import {Avatar, Button, Cell, Group, Placeholder, Separator,CardGrid,Card} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import {BACKEND} from "../../func/func";

function getDate(comDate) {
    if (comDate === 'Только что') {
        return comDate;
    } else {
        let date = new Date(comDate);
        let hours = date.getHours();
        if (hours < 10) hours = '0'+hours;
        let minutes = date.getMinutes();
        if (minutes < 10) minutes = '0'+minutes;
        let date1 = date.getDate();
        if (date1 < 10) date1 = '0'+date1;
        let month = date.getMonth();
        if (month < 10) month = '0'+month;
        return date1+'.'+month+'.'+date.getFullYear()+' в '+hours+':'+minutes;
    }
}

function renderLastPhoto(arr){
    for (let i =0; i<arr.length; i++){
        if (!arr[i]) break;
        return (
            <Card
                size="s"
                mode="shadow"
                key={i}
                //onClick={() => this.openShowImages(this.state.images, index)}
            >
                <div style={{height: 96, backgroundImage: 'url('+arr[i]+')', backgroundSize: 'cover'}} />
            </Card>
        )
    }
}

export default function FindList(props){
    if (props.findArr.length === 0) {
        console.log(props);
        return (
            <Placeholder
                icon={<Icon56UsersOutline />}
                header="Не расстраивайтесь"
                action={<Button onClick={props.share} size="l">Поделиться</Button>}
            >
                В данный момент в городе {props.user.location.city.title} нет поиска моделей. Мы расширяем базу мастеров, и скоро - предложения появятся.
                Поделитесь приложением с мастерами, которых Вы знаете.
            </Placeholder>
        )
    } else {
        return (
            props.findArr.map(find => {
                return (
                    <CardGrid key={find._id}>
                        <Card size="l">
                                <Cell expandable
                                      photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                                      description={getDate(find.date)}
                                      before={<Avatar src={find.avatarLink} size={50}/>}
                                      size="l"
                                      onClick={() => this.props.openMasterOnId(find.masterId)}
                                      bottom=""
                                >{find.firstname} {find.lastname}
                                </Cell>
                                <Cell multiline>
                                    {find.body}
                                </Cell>
                        </Card>
                    </CardGrid>
                )
            })
        )
    }
}