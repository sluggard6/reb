import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

import Main from './main'
import Channel from './channel'
import User from './user'
import BgirlTabBar from '../component/bgirl_tab_bar'
import Global from '../utils/global'
import AlertWinow from '../component/windows'
import HitButton from '../component/hit_button'




export default class FullPicView extends Component {

  constructor(props) {
		super(props);
  }

  componentWillUpdate(nextProps, nextState){
  }

  _doAlert() {
    if(Global.isAlert) {
      return (<AlertWinow unLock={this.props.unLock}/>)
    }
    return
  }

  render() {
    return (
      <View style={styles.container}>
        {this._doAlert()}
        <Image source={{uri: this.props.pic.max}} style={styles.image}>
        </Image>
        <HitButton
          pic={this.props.pic}
        />
      </View>
    );
  }

}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    width: Global.size.width,
    height: Global.size.height-(280/Global.pr),
  },
  image: {
    width: Global.size.width,
    height: Global.size.height-(280/Global.pr),
    resizeMode: Image.resizeMode.contain
  },
})
