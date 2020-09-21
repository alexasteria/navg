import React from 'react'
import {
    FormLayout,
    Button,
    Cell,
    Select,
    Textarea,
    Separator, Card, Snackbar, Spinner, Banner, Switch, Div, CardScroll, Footer
} from "@vkontakte/vkui"
import {BACKEND} from "../func/func"
import FindCard from "../findmodel/components/findCard"
import {connect} from "react-redux"

class FindModelMaster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeMaster: '',
            body: '',
            isLoaded: false,
            isActive: false,
            error: '',
            loading: false,
            images: [],
            loadFind: {
                images: []
            },
            selectvalue: 'Укажите тип акции',
            visible: true,
            targetImg: []
        }
    }

    componentDidMount() {
        fetch(BACKEND.findModel.onMasterId + this.props.master._id)
            .then(res => res.json())
            .then(find => {
                if (find.length > 0) {
                    let targetImg = []
                    find[0].images.map(photo => {
                        if (this.props.master.photos.includes(photo)) targetImg.push(photo)
                    })
                    this.setState({
                        targetImg: targetImg,
                        loadFind: find[0],
                        body: find[0].body,
                        visible: find[0].visible,
                        error: '',
                        isLoaded: true,
                        selectvalue: find[0].sale,
                        isActive: true
                    })
                } else {
                    let error = <Cell multiline>У Вас нет активных постов о поиске</Cell>
                    this.setState({error: error, isLoaded: true})
                }
            })
    }

    targetImg = (url) => {
        try {
            if (this.state.targetImg.includes(url)) {
                let targetImg = this.state.targetImg
                let index = targetImg.indexOf(url)
                if (index > -1) {
                    targetImg.splice(index, 1)
                } else targetImg.splice(0, index)
                this.setState({targetImg: targetImg})
            } else {
                let targetImg = this.state.targetImg
                if (targetImg.length > 2) throw 'Выделить можно только 3 фотографии.'
                targetImg.push(url)
                this.setState({targetImg: targetImg})
            }
        } catch (e) {
            this.openSnack(e)
        }
    }

    openSnack(text) {
        if (this.state.snackbar) return
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({snackbar: null})}
                >
                    {text}
                </Snackbar>
        })
    }

    handleChangeSelect = (event) => {
        this.setState({selectvalue: event.target.value})
    };

    handleChange = (event) => {
        let {name, value} = event.target
        this.setState({[name]: value})
    };
    save = () => {
        try {
            if (this.state.body.replace(/ +/g, ' ').trim().length === 0) throw 'Пустое сообщение недопустимо.'
            if (this.state.body.replace(/ +/g, ' ').trim().length > 250) throw 'Максимальная длина сообщения - 250 символов.'
            if (this.state.targetImg.length < 3) throw 'Необходимо выбрать 3 фотографии из портфолио.'
            if (this.state.selectvalue === 'Укажите тип акции') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.'
            if (this.state.selectvalue === '') throw 'Вы не выбрали акцию. Размещение не акционных предложений недоступно.'

            if (this.state.isActive === true) {
                let find = this.state.loadFind
                find.body = this.state.body
                find.images = this.state.targetImg
                find.sale = this.state.selectvalue
                find.visible = this.state.visible
                find.params = this.props.params
                this.patchData(BACKEND.findModel.new + this.state.loadFind._id, find)
            } else {
                let find = this.state.loadFind
                find.body = this.state.body

                find.images = this.state.targetImg
                find.sale = this.state.selectvalue
                find.visible = this.state.visible
                find.params = this.props.params
                fetch(BACKEND.findModel.new, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json',},
                    redirect: 'follow',
                    referrer: 'no-referrer',
                    body: JSON.stringify(find),
                })
                    .then(res => res.json())
                    .then(res => {
                        this.setState({loadFind: res.find, isActive: true})
                        if (res.mStatus === false) {
                            this.setState({visible: false})
                            this.openSnack('Объявление о поиске модели создано, но пока не показывается. Его можно активировать сразу после прохождения модерации профиля мастера.')
                        } else {
                            this.openSnack('Объявление о поиске модели успешно создано.')
                        }
                    })
                    .catch(e => console.log(e))
            }
        } catch (e) {
            this.openSnack(e)
        }
    };

    patchData(url = '', data = {}) {
        return fetch(url, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                this.openSnack('Информация успешно обновлена.')
            })
            .catch(e => {
                this.openSnack('Не удалось обновить данные.')
                console.log(e)
            })
    }

    getDate(comDate) {
        if (comDate === 'Только что') {
            return comDate
        } else {
            let date = new Date(comDate)
            let hours = date.getHours()
            if (hours < 10) hours = '0' + hours
            let minutes = date.getMinutes()
            if (minutes < 10) minutes = '0' + minutes
            let date1 = date.getDate()
            if (date1 < 10) date1 = '0' + date1
            let month = date.getMonth()
            if (month < 10) month = '0' + month
            return date1 + '.' + month + '.' + date.getFullYear() + ' в ' + hours + ':' + minutes
        }
    }

    postData(url = '', data = {}) {
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                this.setState({loadFind: result, isActive: true})
            })

    }

    render() {
        if (this.state.isLoaded === false) {
            return (<Spinner size="large" style={{marginTop: 20}}/>)
        } else {
            return (
                <React.Fragment>
                    <Banner
                        header="Мастер ищет модель"
                        subheader="Правила размещения"
                        text="В данной категории можно разместиться, если вы предлагаете услуги по специальным условиям. Сейчас доступно три варианта: скидка 50%, оплата только за расходные материалы или полностью бесплатно, например, для пополнения портфолио."
                    />
                    <FormLayout>
                        <Textarea
                            name={'body'}
                            top="Основное сообщение"
                            value={this.state.body}
                            onChange={this.handleChange}
                        />
                        {
                            this.props.master.photos.length > 0 ?
                                <Div style={{webkitUserSelect: 'none', userSelect: 'none'}}>
                                    <Cell>Выполненые работы мастера</Cell>
                                    <CardScroll>
                                        {
                                            this.props.master.photos.map((photoUrl, index) => {
                                                return (
                                                    <Card
                                                        style={{padding: 2, borderRadius: 13, margin: 0}}
                                                        size="s"
                                                        mode="shadow"
                                                        key={index}
                                                        onClick={() => this.targetImg(photoUrl)}
                                                    >
                                                        {
                                                            this.state.targetImg.includes(photoUrl) ?
                                                                <div style={{
                                                                    width: 144,
                                                                    height: 96,
                                                                    backgroundImage: 'url(' + photoUrl + ')',
                                                                    backgroundSize: 'cover',
                                                                    borderRadius: 13
                                                                }}>
                                                                    <div style={{
                                                                        backgroundColor: 'grey',
                                                                        borderRadius: '13px 13px 0 0',
                                                                        textAlign: 'center'
                                                                    }}>Выбрано
                                                                    </div>
                                                                </div> :
                                                                <div style={{
                                                                    width: 144,
                                                                    height: 96,
                                                                    backgroundImage: 'url(' + photoUrl + ')',
                                                                    backgroundSize: 'cover',
                                                                    borderRadius: 13
                                                                }}/>
                                                        }
                                                    </Card>
                                                )
                                            })
                                        }
                                    </CardScroll>
                                </Div> :
                                <Cell multiline>У Вас в портфолио нет фото, разместить объявление о поиске можно, имея в
                                    портфолио не менее 3-х фотографий.</Cell>
                        }

                        <Select value={this.state.selectvalue} onChange={this.handleChangeSelect} top="Тип акции"
                                placeholder="Выберите тип акции">
                            <option value="Скидка 50%">Скидка 50%</option>
                            <option value="Оплата за материалы">Оплата за материалы</option>
                            <option value="Бесплатно">Бесплатно</option>
                        </Select>
                        <Cell
                            asideContent={<Switch
                                onChange={() => {
                                    if (this.props.master.moderation.status === true) {
                                        this.setState({visible: !this.state.visible})
                                    } else {
                                        this.openSnack('Ваш профиль находится на модерации. Вы можете создать объявление уже сейчас, но до завершения проверки пользователи его не увидят.')
                                    }
                                }}
                                checked={this.props.master.moderation.status === true ? this.state.visible : false}/>}>
                            Показывать объявление в поиске
                        </Cell>
                        <Button size="xl" onClick={this.save}>Сохранить</Button>
                    </FormLayout>
                    <Separator style={{margin: '12px 0'}}/>
                    {
                        this.state.isActive &&
                        <React.Fragment>
                            <Cell description={'Некликабельно'}>Ваш пост будет выглядеть так:</Cell>
                            <FindCard
                                date={this.getDate(this.state.loadFind.date)}
                                key={this.state.loadFind._id}
                                find={this.state.loadFind}
                                openMasterOnId={this.props.openMasterOnId}
                            />
                        </React.Fragment>
                    }
                    <Footer/>
                    {this.state.snackbar}
                </React.Fragment>
            )
        }

    }
}

const putStateToProps = (state) => {
    return {
        user: state.user,
        master: state.master,
        params: state.params
    }
}

export default connect(putStateToProps)(FindModelMaster)