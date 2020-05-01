import React from 'react';
import {Avatar, Button, Cell, Group, Placeholder, Separator} from "@vkontakte/vkui";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

export default function FindList(props){
    console.log(props);
    if (props.findArr.length === 0) {
        return (
            <Placeholder
                icon={<Icon56UsersOutline />}
                header="Не расстраивайтесь"
                action={<Button onClick={this.share} size="l">Поделиться</Button>}
            >
                В данный момент в городе {this.props.user.location.city.title} нет поиска моделей. Мы расширяем базу мастеров, и скоро - предложения появятся.
                Поделитесь приложением с мастерами, которых Вы знаете.
            </Placeholder>
        )
    } else {
        return (
            props.findArr.map(find => {
                return (
                    <Group key={find._id}>
                        <Separator style={{ margin: '12px 0' }} />
                        <Cell expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                            // description={'Место под категории'}
                              before={<Avatar src={find.avatarLink} size={50}/>}
                              size="l"
                              onClick={() => this.props.openMasterOnId(find.masterId)}
                              bottom=""
                        >{find.firstname} {find.lastname}
                        </Cell>
                        <Cell multiline>
                            {find.body}
                        </Cell>
                    </Group>
                )
            })
        )
    }
}