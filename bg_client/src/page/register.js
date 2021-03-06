import React, { Component } from 'react';

import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import Global from '../utils/global';
import Application from '../utils/application'
import TabBarView from './tab_bar_view'
import Http from '../utils/http'
import TimerButton from '../component/timer_button'
import {TextTopBar} from '../component/top_bar'
import Login from './login'

const VCODE_URL = "/vcode"

const REGISTER_URL = "/user/register"

export default class Register extends Component{

  constructor(props) {
    super(props);
    this.state = {
      seconds: 60,
      phone: ""
    };
  }

  call() {
    let url = Application.getUrl(Global.urls.vcode) + "?phone=" + this.props.phone + "&type=" + this.props.type
    Http.httpGet(url,(res) => {
      if(res.success != true) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT)
      }
    })
  }

  doRegister() {
    let params = {
      key: this.state.vcode,
      pwd: this.state.pwd,
      uname: this.props.phone
    }
    let urlType = this.props.type==1?Global.urls.register:Global.urls.forgotPass

    if(this.state.pwd !== this.state.repwd) {
      ToastAndroid.show("两次密码不一致", ToastAndroid.SHORT)
      return
    }
    
    Http.httpPost(Application.getUrl(urlType), params, (res) => {
      if(res.success != true) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT)
      }else{
        if(this.props.type == 1){
          Application.localLogin(res.seid)
          Global.navigator.resetTo({
            component: TabBarView
          })
        }else{
          this.props.navigator.push({
            component: Login,
            params: {
              message: res.message
            }
          })
        }
      }
    })
  }

  render(){
    let title = this.props.type==1?"注   册":"找回密码"
    return (
      <View style={styles.loginContainer}>
        <TextTopBar text={title}/>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
          <View style={styles.shortInputContainer}>
            <Image source={require('../images/shouji_w.png')} style={styles.inputLogo}/>
            <TextInput
              onChangeText={(vcode) => {
                this.state.vcode = vcode
              }}
              underlineColorAndroid="transparent"
              style={styles.shortInput}
              placeholder='输入验证码'
            />
          </View>
          <TimerButton onPress={()=>this.onPress()}
              style={styles.vcodeBtn}
              disStyle={styles.disVcodeBtn}
              textStyle={{fontSize: 14, color: 'white'}}
              text="获取验证码"
              disText="重新获取"
              disTime={60}
              call={this.call.bind(this)}
              />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/mima_w.png')} style={styles.inputLogo}/>
          <TextInput
            onChangeText={(pwd) => {
              this.state.pwd = pwd
            }}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            style={styles.input}
            placeholder='密码'
            password={true} />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/mima_w.png')} style={styles.inputLogo}/>
          <TextInput
            onChangeText={(repwd) => {
              this.state.repwd = repwd
            }}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            style={styles.input}
            placeholder='重复密码'
            password={true} />
        </View>
        <TouchableOpacity onPress={this.doRegister.bind(this)}>
          <View style={styles.loginButton}>
            <Text style={{color: '#fff', fontSize: 16}} >完成</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  logoImage:{
    borderRadius: 35,
    height: 90,
    width: 90,
    marginTop: 120,
    alignSelf: 'center',
  },

  inputLogo: {
    height: 25,
    marginLeft: 10,
    resizeMode: Image.resizeMode.contain
  },

  vcodeBtn: {
    marginRight: 20,
    marginTop: 20,
    backgroundColor: "#ff4563",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: (Global.size.width - 40)*1/3 - 5
  },

  disVcodeBtn: {
    marginRight: 20,
    marginTop: 20,
    backgroundColor: "#949494",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: (Global.size.width - 40)*1/3 - 5
  },

  shortInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 7,
    marginTop: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    height:40,
    width: (Global.size.width - 40)*2/3 - 5
  },

  shortInput: {
    backgroundColor: '#e0e0e0',
    height: 40,
    width: 120,
    paddingLeft: 10,
    fontSize: 14,
    borderRadius: 5,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    height:40
  },

  input: {
    backgroundColor: '#e0e0e0',
    height: 40,
    width: Global.size.width - 100,
    paddingLeft: 10,
    fontSize: 14,
    borderRadius: 5,
  },

  checkedImage: {
    height: 15,
    resizeMode: Image.resizeMode.contain
  },

  loginButton:{
    margin: 20,
    backgroundColor: '#ff4563',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
