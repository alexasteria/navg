import React from 'react';
import {Button, Placeholder,Card} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import FindCard from "./findCard";

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
                    <FindCard
                        date={getDate(find.date)}
                        key={find._id}
                        find={find}
                        openMasterOnId={props.openMasterOnId}
                    />
                )
            })
        )
    }
}