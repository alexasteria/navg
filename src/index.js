import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import bridge from '@vkontakte/vk-bridge'
import {createStore} from "redux"
import {Provider} from "react-redux"
import {rootReducer} from "./js/store/reducers"

require('dotenv').config()


const store = createStore(rootReducer)
bridge.send("VKWebAppInit", {})

let linkParams = window
    .location
    .hash
    .replace('#', '')
    .split('&')
    .reduce(
        function (p, e) {
            let a = e.split('=')
            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
            return p
        },
        {}
    )

let params = window
    .location
    .search
    .replace('?', '')
    .split('&')
    .reduce(
        function (p, e) {
            let a = e.split('=')
            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
            return p
        },
        {}
    )

ReactDOM.render(<Provider store={store}>
    <App launchParams={params} linkParams={linkParams}/>
</Provider>, document.getElementById('root'))

serviceWorker.unregister()
