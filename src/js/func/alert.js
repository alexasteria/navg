import React from 'react';
import {Alert} from "@vkontakte/vkui";

export default class Pop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    openAlert = () => {
        this.setState({ popout:
                <Alert
                    actionsLayout="vertical"
                    actions={[{
                        title: 'Закрыть',
                        autoclose: true,
                        mode: 'cancel'
                    }]}
                    onClose={this.closeAlert}
                >
                    <h2>Изменения сохранены</h2>
                    <p>Внесенные изменение отобразятся в поиске в течении 2-х минут.</p>
                </Alert>
        });
    };
    closeAlert = () => {
        this.setState({ popout: null });
    };
    render() {
       return (
           this.openAlert()
       )
    }
}