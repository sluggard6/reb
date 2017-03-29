import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import Global from '../utils/global';

export default class TopBar extends Component {

  render(){
    return(
      <Image style={styles.top_bar} source={require('../images/top_bar.png')}/>
    );
  }
}

var styles = StyleSheet.create({

  top_bar: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    height: 200/Global.pr,
  },

});
