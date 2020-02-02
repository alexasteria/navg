import React from 'react';
import {Select, Root, List, Cell, HeaderButton, View, Button, Div, SelectMimicry, Panel, Group, PanelHeader,  ModalRoot, ModalPage, ModalPageHeader, FormLayout, FormLayoutGroup} from "@vkontakte/vkui";
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel.js';
import Icon24Done from '@vkontakte/icons/dist/24/done.js';
import FcarList from './fcarlist.js';
const APIURL = 'http://localhost:3012/';

class Garage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeModal: null,
            modalHistory: [],
            activeView: 'garage',
            fcar: '',
            error: null,
            isLoaded: false,
            fcars: [],
            targetFcar: null
        };
        this.loadFirms = () => {
            fetch(APIURL+"fcar")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.state.fcars = result;
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                );
        };
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
    }
    setActiveModal(activeModal) {
        activeModal = activeModal || null;
        let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];

        if (activeModal === null) {
            modalHistory = [];
        } else if (modalHistory.indexOf(activeModal) !== -1) {
            modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
        } else {
            modalHistory.push(activeModal);
        }

        this.setState({
            activeModal,
            modalHistory
        });
    };
    render(){
        const MODAL_PAGE_ADDCAR = 'addcar';
        const MODAL_PAGE_FCAR = 'fcar';
        const IS_PLATFORM_IOS = true;
        const IS_PLATFORM_ANDROID = false;
        const boxStyle = {marginTop: 56};

        const modal = (
            <ModalRoot activeModal={this.state.activeModal}>
                <ModalPage
                    id={MODAL_PAGE_ADDCAR}
                    onClose={this.modalBack}
                    header={
                        <ModalPageHeader
                            left={IS_PLATFORM_ANDROID && <HeaderButton onClick={this.modalBack}><Icon24Cancel /></HeaderButton>}
                            right={<HeaderButton onClick={this.modalBack}>{IS_PLATFORM_IOS ? 'Готово' : <Icon24Done />}</HeaderButton>}
                        >
                            Фильтры
                        </ModalPageHeader>
                    }
                >
                    <FormLayout>
                            {this.loadFirms()}
                            <FcarList fcars={this.state.fcars}/>
                        <FormLayoutGroup top="Модели">
                            <Group>
                                <Div>Lorem</Div>
                            </Group>
                            <Group>
                                <Div>Lorem</Div>
                            </Group>
                            <Group>
                                <Div>Lorem</Div>
                            </Group>
                        </FormLayoutGroup>
                    </FormLayout>
                </ModalPage>
            </ModalRoot>
        );
        return (
            <Root activeView={this.state.activeView}>

            <View activePanel="garage" modal={modal} id="garage">
            <Panel id="garage">
                <PanelHeader noShadow={true}>Гараж</PanelHeader>
                <Group title='Гараж'>
                    <Div>Ваш гараж еще пуст. Добавьте свой автомобиль и у Вас появится возможность записаться на сервис.</Div>
                </Group>
                <Group style={boxStyle}>
                    <FormLayout>
                        <Button size="xl" level="secondary" onClick={() => this.setActiveModal(MODAL_PAGE_ADDCAR)}>
                            Добавить Авто в гараж
                        </Button>
                    </FormLayout>
                </Group>
            </Panel>
            </View>
            </Root>


        );
    }
}
export default Garage;