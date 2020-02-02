import React from 'react';
import {Cell, Div, Group} from "@vkontakte/vkui"


class Sale extends React.Component {
    render(){
        return (
            <Div>
                <Cell expandable onClick={() => this.setState({ activePanel: 'nothing' })} indicator="Дзержинск">Выбранный город</Cell>
                <Group>
                    <Div style={{ backgroundImage: 'url(https://static.chance.ru/sites/default/files/styles/photo_galleryformatter_slide/public/images/4F305684-6F6D-4FD5-BB3B-E33918F0567B.jpeg?itok=pUhn9TyQ)', backgroundSize: 'cover', height: 200 }} />
                </Group>
                <Group>
                    <Div style={{ backgroundImage: 'url(http://varletstydio.ru/wp-content/uploads/2019/11/Montazhnaya-oblast-96-kopiya-3x-8.png)', backgroundSize: 'cover', height: 200 }} />
                </Group>
                <Group>
                    <Div style={{ backgroundImage: 'url(http://trigraces-ural.ru/images_ckeditor/263-a548d23dc3d2b93c31ca340fa47853cc.jpg)', backgroundSize: 'cover', height: 200 }} />
                </Group>
                <Group>
                    <Div style={{ backgroundImage: 'url(http://lavanda.salon/akciya-na-manikyur.jpg)', backgroundSize: 'cover', height: 200 }} />
                </Group>
            </Div>
        );
    }
}

export default Sale;