import React from 'react';
import {Avatar, Cell, Div, Group, Separator, Spinner, Placeholder, Button} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';
import bridge from "@vkontakte/vk-bridge";


class FindModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category, //{id: '1', label: 'Маникюр'},
            mastersList: [],
            title: '',
            master: {
                vkUid: 9999999999,
                avatarLink: "https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg",
                firstname: 'Евгения',
                lastname: 'Плюхова'
            },
            findArr: [],
            isLoad: false
        };
    }
    componentDidMount() {
        console.log(this.props.user);
        fetch(BACKEND.findModel.onCity+this.props.user.location.city.id)//ловим обьявления по городу юзера
            .then(res => res.json())
            .then(find => {
                console.log(find);
                this.setState({findArr: find});
                console.log('Найдено '+find.length);
                this.setState({isLoad: true})
            });
    }
    share = () => {
        bridge.send("VKWebAppShare", {"link": 'https://m.vk.com/app7170938_199500866'})
            .then(result => this.openSnackAvatar('Карточка мастера отправлена.', this.state.activeMaster.avatarLink))
    };
    findList = () => {
        if (this.state.findArr.length === 0) {
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
                this.state.findArr.map(find => {
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
    };
    render(){
        if (this.state.isLoad === false){
            return (<Spinner size="large" style={{ marginTop: 20 }} />)
        } else {
            return (
                <Div>
                    <Cell
                        //expandable
                        onClick={() => this.setState({ activePanel: 'nothing' })}
                        indicator={this.props.user.location.city.title}>Ваш город</Cell>
                    {this.findList()}
                </Div>
            );
        }
    }
}

export default FindModel;