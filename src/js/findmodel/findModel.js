import React from 'react';
import {Avatar, Cell, Div, Group, Separator} from "@vkontakte/vkui"
import {BACKEND} from "../func/func";


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
            findArr: []
        };
    }
    componentDidMount() {
        console.log(BACKEND.findModel.onCity+this.props.user.city.id);
        fetch(BACKEND.findModel.onCity+this.props.user.city.id)
            .then(res => res.json())
            .then(find => {
                console.log(find);
                this.setState({findArr: find});
                console.log('Найдено '+find.length);

            });
    }

    findList = () => {
        return (
            this.state.findArr.map(find => {
                return (
                    <Group key={find._id}>
                        <Separator style={{ margin: '12px 0' }} />
                        <Cell expandable
                              photo="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg"
                              description={'Место под категории'}
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
    };
    render(){
        return (
            <Div>
                {this.findList()}
            </Div>

        );
    }
}

export default FindModel;