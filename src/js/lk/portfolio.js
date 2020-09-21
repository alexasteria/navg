import React from 'react'
import {
    Group,
    Div,
    File,
    FormLayout,
    CardGrid,
    Card,
    Snackbar,
    Cell,
    PanelSpinner,
    Spinner,
    CellButton, Alert, FixedLayout, Placeholder, Footer, Button
} from "@vkontakte/vkui"
import {BACKEND} from '../func/func.js'
import Icon24Camera from '@vkontakte/icons/dist/24/camera'
import bridge from '@vkontakte/vk-bridge'
import fetchJsonp from "fetch-jsonp"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {setMaster} from "../store/actions"
import Icon28WriteSquareOutline from '@vkontakte/icons/dist/28/write_square_outline'
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline'
import Icon24Add from '@vkontakte/icons/dist/24/add'
import Head from "../elements/panelHeader";

class Portfolio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeMaster: {},
            photoArr: [],
            isLoad: false,
            photoFile: '',
            images: [],
            deleteMode: false
        }
    }

    componentDidMount() {
        this.setState({images: this.props.master.photos, isLoad: true})
    }

    componentWillUnmount() {
        this.props.setAlert(null)
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

    openShowImages(images, index) {
        bridge.send("VKWebAppShowImages", {
            images: images,
            start_index: index
        }).then(data => console.log('ok'))
    }

    deletePhoto = (link) => {
        this.props.setAlert(
            <Alert
                actionsLayout="vertical"
                actions={[{
                    title: 'Удалить фотографию',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => setTimeout(this.delete(link), 500),
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                onClose={() => this.props.setAlert(null)}
            >
                <h2>Подтвердите действие</h2>
                <p>Вы уверены, что хотите удалить выбранную фотографию?</p>
            </Alert>
        )
    }

    delete = (link) => {
        this.setState({loading: true})
        fetch(BACKEND.vkapi.delPhoto, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json',},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify({params: this.props.params, photo: link}),
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    if (res.master.photos.length === 0) this.setState({deleteMode: false})
                    this.setState({images: res.master.photos, loading: false})
                    this.props.setMaster(res.master)
                    this.props.setAlert(null)
                }
            })
            .catch(e => console.log(e))
    }

    async getAlbum() {
        const user_albums = encodeURI('https://api.vk.com/method/photos.getAlbums?owner_id=' + this.props.params.vk_user_id + '&access_token=' + this.state.token + '&v=5.103')
        let album_id = null
        await fetchJsonp(user_albums)
            .then(res => res.json())
            .then(res => {
                if (res.response) {
                    res.response.items.map(album => {
                        if (album.title === "Навигатор красоты") {
                            album_id = album.id
                        }
                    })
                }
            })
            .catch(e => console.log(e))
        if (album_id === null) {
            return {status: 'none'}
        } else {
            return {status: true, album_id: album_id}
        }
    };


    uploadPhoto = async () => {
        try {
            let token = await this.getToken();
            if (token === null) throw 'Ошибка. Не получен токен пользователя.'
            let selectedFile = document.getElementById('input').files[0]
            if (!selectedFile.type.match('image.*')) throw 'Допустимо загружать только изображения.'
            let getAlbum = await this.getAlbum()
            if (getAlbum.status === false) throw 'Не получен альбом для загрузки.'
            let album
            if (getAlbum.status === 'none') {
                const create_album = encodeURI('https://api.vk.com/method/photos.createAlbum?title=Навигатор красоты&access_token=' + this.state.token + '&v=5.103')
                await fetchJsonp(create_album)
                    .then(res => res.json())
                    .then(res => {
                        console.log('Создали альбом в ИД ', res.response.id)
                        album = res.response.id
                    })
                    .catch(e => console.log(e))
            } else {
                album = getAlbum.album_id
            }

            const uploadServer = await this.getUploadServer(this.state.token, album)

            if (uploadServer.status === false) throw 'Ошибка. Не получена ссылка на загрузку фото.'

            this.setState({loading: true})
            const formData = new FormData()
            formData.append('master', this.props.master.firstname + ' ' + this.props.master.lastname)
            formData.append('uploadUrl', uploadServer.url)
            formData.append('token', this.state.token)
            formData.append('file1', selectedFile)
            formData.append('masterId', this.props.master._id)
            fetch(BACKEND.vkapi.uploadPhoto, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        this.setState({loading: false})
                        this.openSnack(res.error)
                    } else {
                        fetchJsonp(res.saveUrl, {
                            mode: 'no-cors',
                            method: 'GET'
                        })
                            .then(result => result.json())
                            .then(result => {
                                if (result.error) {
                                    this.setState({loading: false})
                                    this.openSnack('При загрузке фото возникла ошибка.')
                                } else {
                                    let savePh = {
                                        url: result.response[0].sizes[4].url,
                                        params: this.props.params
                                    }
                                    fetch(BACKEND.vkapi.savePhoto, {
                                        method: 'POST',
                                        mode: 'cors',
                                        cache: 'no-cache',
                                        credentials: 'same-origin',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        redirect: 'follow',
                                        referrer: 'no-referrer',
                                        body: JSON.stringify(savePh)
                                    })
                                        .then(res => res.json())
                                        .then(res => {
                                            if (res.error) {
                                                this.setState({loading: false})
                                                this.openSnack(res.error)
                                            } else {
                                                let imgArr = this.state.images
                                                imgArr.unshift(res.img)
                                                this.openSnack('Фото успешно загружено.')
                                                this.setState({images: imgArr, loading: false})
                                            }
                                        })
                                        .catch(e => {
                                            this.setState({loading: false})
                                            console.log(e)
                                        })
                                }
                            })
                            .catch(e => {
                                this.setState({loading: false})
                                console.log(e)
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.setState({loading: false})
                    this.openSnack('Ошибка при загрузке.')
                })
        } catch (e) {
            console.log(e)
            document.getElementById("input").value = ""
            this.openSnack(e || 'Какая-то ошибка. Попробуем еще разок?')
        }

    };

    getUploadServer = async (token, album) => {
        return await bridge.send("VKWebAppCallAPIMethod", {
            "method": "photos.getWallUploadServer",
            "params": {"album_id": album, "v": "5.103", "access_token": token}
        })
            .then(result => {
                this.setState({uploadUrl: result.response.upload_url})
                return {status: true, url: result.response.upload_url}
            })
            .catch(e => {
                console.log(e)
                return {status: false}
            })

    };

    getToken = async () => {
        return await bridge.send("VKWebAppGetAuthToken", {"app_id": 7170938, "scope": "photos"})
            .then(result => {
                if (result.access_token) {
                    this.setState({token: result.access_token})
                    return result.access_token
                }
            })
            .catch(error => {
                console.log(error)
                return null
            })
    };

    gridPhoto() {
        if (this.state.images.length > 0) {
            return (
                <CardGrid>
                    {
                        this.state.images.map((image, index) => {
                            return (
                                <Card
                                    style={{padding: 2, borderRadius: 13, margin: 0}}
                                    size="s"
                                    mode="shadow"
                                    key={index}
                                    onClick={
                                        this.state.deleteMode ?
                                            () => this.deletePhoto(image) :
                                            () => this.openShowImages(this.state.images, index)
                                    }
                                >
                                    <div style={{
                                        height: 96,
                                        backgroundImage: 'url(' + image + ')',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center 35%',
                                        backgroundRepeat: 'no-repeat',
                                        borderRadius: 13
                                    }}>
                                    </div>
                                    {
                                        this.state.deleteMode ?
                                            <div style={{color: 'red', textAlign: 'center'}}>Удалить</div> :
                                            null
                                    }
                                </Card>
                            )
                        })
                    }
                </ CardGrid>
            )
        } else {
            return (
                <Placeholder
                    icon={<Icon56GalleryOutline />}
                    header="Фотографий еще нет"
                >
                    Разрешите доступ к разделу "Фотографии" и загрузите первое фото в Ваше портфолио
                </Placeholder>
            )
        }
    }

    render() {
        if (this.state.isLoad === false) {
            return (
                <Spinner size="large" style={{marginTop: 20}}/>
            )
        } else {
            return (
                <Div style={{WebkitUserSelect: 'none', userSelect: 'none'}}>
                    <Head
                        title={'Портфолио'}
                        goBack={() => this.props.goBack('lk')}
                    />
                    {
                        this.state.loading ?
                            <Div style={{webkitUserSelect: 'none', userSelect: 'none'}}>
                                <Cell multiline>Подождите немного...</Cell>
                                <PanelSpinner/>
                            </Div> :
                            <React.Fragment>
                                <Div style={{display: 'flex'}}>
                                    {
                                        this.state.deleteMode === false &&
                                        <File
                                            stretched
                                            before={<Icon24Add />}
                                            controlSize="l"
                                            mode="outline"
                                            onChange={this.uploadPhoto}
                                            id="input"
                                            style={{ marginRight: 8 }}
                                        >Добавить</File>
                                    }
                                    {
                                        this.state.images.length > 0 ?
                                            this.state.deleteMode === false ?
                                                <Button
                                                    size="l"
                                                    mode="outline"
                                                    onClick={() => this.setState({deleteMode: true})}
                                                    before={<Icon28WriteSquareOutline/>}
                                                >Редактировать</Button> :
                                                <Button
                                                    stretched
                                                    size="l"
                                                    mode="outline"
                                                    onClick={() => this.setState({deleteMode: false})}
                                                    before={<Icon28WriteSquareOutline/>}
                                                >Завершить редактирование</Button> : null
                                    }
                                </Div>
                                {this.gridPhoto()}
                            </React.Fragment>
                    }
                    {this.state.snackbar}
                </Div>
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

const putActionsToProps = (dispatch) => {
    return {
        setMaster: bindActionCreators(setMaster, dispatch)
    }
}

export default connect(putStateToProps, putActionsToProps)(Portfolio)