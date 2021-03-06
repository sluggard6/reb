import React, {Component} from 'react';
import {
  Platform,
  AsyncStorage,
  ToastAndroid
} from 'react-native';

import Global from './global'
import Http from './http'
import TabBarView from '../page/tab_bar_view'


export default class Application {

  static saveLoginInfo(uname, pwd) {
    AsyncStorage.setItem('uname', uname)
    AsyncStorage.setItem('pwd', pwd)
  }

  static localLogin(seid) {
    Http.httpGet(Application.getUrl(Global.urls.user)+"?seid="+seid, (res) => {
      if(res.success === true) {
        Global.user = res.user
        AsyncStorage.setItem('seid', seid)
        Global.isLogin = true
      }else{
        Application.localLogout()
      }
    })
  }

  static clearLoginInfo() {
    AsyncStorage.removeItem('uname')
    AsyncStorage.removeItem('pwd')
  }

  static localLogout() {
    Global.user = {}
    Global.isLogin = false
    AsyncStorage.removeItem('seid')
  }

  static autoLogin() {
    AsyncStorage.getItem('seid').then((seid) => {
      if(seid != null) {
        Application.localLogin(seid)
      }
    })
  }


  static login(uname, pwd, callback) {
    params = {
      uname: uname,
      pwd: pwd
    }
    Http.httpPost(Application.getUrl(Global.urls.login), params, (res) => {
      if(res.success === true) {
        Application.saveLoginInfo(uname, pwd)
        Application.localLogin(res.msg)
        if(typeof callback === 'function'){
          callback()
        }
      }else{
        ToastAndroid.show(res.message,ToastAndroid.SHORT)
      }
    });
  }

  static logout(callback){
    Http.httpGet(Application.getUrl(Global.urls.logout), (res) => {
      if(res.success === true) {
        Application.clearLoginInfo()
        Application.localLogout()
        if(typeof callback === 'function'){
          callback()
        }
      }else{
        ToastAndroid.show(res.message,ToastAndroid.SHORT)
      }
    });
  }

  static unSupport() {
    ToastAndroid.show('敬请期待', ToastAndroid.SHORT);
  }

  static isVip() {
    if(Global.isLogin){
      return Global.user.vipend > Global.serverTime
    }
    return false
  }

  static doAlert(callback) {
    Global.isAlert = true;
    if(typeof callback === 'function'){
      callback()
    }
  }

  static cannel() {
    Global.isAlert = false;
  }

  static getHost() {
    return Global.host||Global.default_host
  }

  static getUrl(url) {
    return Application.getHost() + url
  }

  static getPrice(productId) {
    return Global.products[productId]
  }

}
