import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Warn from './Warn';
import * as serviceWorker from './serviceWorker';
//import bridge from '@vkontakte/vk-bridge-mock';
import bridge from '@vkontakte/vk-bridge';
import {createStore} from "redux";
import {Provider} from "react-redux"
import {rootReducer} from "./js/store/reducers";
import {BACKEND} from "./js/func/func";
const qs = require('query-string');
const crypto = require('crypto');

const store = createStore(rootReducer);

bridge.send("VKWebAppInit", {})
    .then(data => {
        signValidate();
    });
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

function signValidate(){
    const urlParams = qs.parse(window.location.search);
    const ordered = {};
    Object.keys(urlParams).sort().forEach((key)=>{
        if (key.slice(0,3) === 'vk_'){
            ordered[key] = urlParams[key];
        }
    });

    const secretKey = BACKEND.secretKey;
    const stringParams = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', secretKey)
        .update(stringParams)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '')

    console.log(paramsHash === urlParams.sign);
    if(paramsHash === urlParams.sign){
        ReactDOM.render(<Provider store={store}><App linkParams={linkParams} params={params} /></Provider>, document.getElementById('root'));
    } else {
        ReactDOM.render(<Warn />, document.getElementById('root'));
    }
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
