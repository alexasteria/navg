import React from 'react';
import {ANDROID, IOS, ModalPage, ModalPageHeader, ModalRoot, PanelHeaderButton, platform} from "@vkontakte/vkui";
import Icon24Done from '@vkontakte/icons/dist/24/done';
const osname = platform();

export default function Modal(props){
    return(
        <ModalRoot
            activeModal={props.activeModal}
            onClose={props.onClose}
        >
            <ModalPage dynamicContentHeight
                       id={props.pageId}
                       onClose={props.onClose}
                       header={
                           <ModalPageHeader
                               left={osname === ANDROID && props.leftButton &&
                               <PanelHeaderButton onClick={props.onClose}>{'Сохранить'}</PanelHeaderButton>}
                               right={props.rightButton && <PanelHeaderButton onClick={props.onClose}>{osname === IOS  ? 'Сохранить' :
                                   <Icon24Done/>}</PanelHeaderButton>}
                           >
                               {props.header}
                           </ModalPageHeader>
                       }
            >
                {props.content}
            </ModalPage>
        </ModalRoot>
    )
}