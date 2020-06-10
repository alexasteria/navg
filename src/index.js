import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import bridge from '@vkontakte/vk-bridge';
import {createStore} from "redux";
import {Provider} from "react-redux"
import {rootReducer} from "./js/store/reducers";

const store = createStore(rootReducer);

bridge.send("VKWebAppInit", {});

let linkParams =  window
    .location
    .hash
    .replace('#','')
    .split('&')
    .reduce(
        function(p,e){
            let a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );
let params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            let a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );

ReactDOM.render(<Provider store={store}>
                    <App linkParams={linkParams} params={params} />
                </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
