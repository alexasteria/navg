import React from 'react';
import {FormLayoutGroup, File, Link, Button, Checkbox, Textarea, FormLayout, Input, Div, Panel, Group, PanelHeader, View} from "@vkontakte/vkui"
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

class RegistrationForm extends React.Component {
    render(){
        return (
            <FormLayout>
                <Input top="Имя" />
                <Input top="Фамилия" />
                <Textarea top="О себе" />
                <FormLayoutGroup top="Сфера деятельности" bottom="Укажите вид работы, в соответствии с тем, что вы выполняете. Так вас будет проще найти.">
                    <Checkbox>Маникюр</Checkbox>
                    <Checkbox>Педикюр</Checkbox>
                    <Checkbox>Ресницы</Checkbox>
                    <Checkbox>Брови</Checkbox>
                    <Checkbox>Шугаринг</Checkbox>
                    <Checkbox>Уход за волосами</Checkbox>
                </FormLayoutGroup>
                <File top="Загрузите портфолио Ваших работ" before={<Icon24Camera />} size="l">
                    Загрузить
                </File>
                <Checkbox>Согласен c <Link>условиями использования приложения</Link></Checkbox>
                <Button size="xl">Зарегистрироваться как мастер</Button>
            </FormLayout>
        );
    }
}

export default RegistrationForm;