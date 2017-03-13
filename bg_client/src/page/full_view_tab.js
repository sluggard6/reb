import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackAndroid
} from 'react-native';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

import Http from '../utils/http'
import Global from '../utils/global'
import Application from '../utils/application'
import FullPicView from './full_view'
import FullPicTabBar from '../component/full_pic_bar'



export default class FullViewTab extends Component {

  constructor(props) {
		super(props);
    console.log("group_id:"+props.groupId)
    this.state = {
      pics: "",
      loaded: false
    }
    this._loadData = this._loadData.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData() {
    url = Application.getUrl(Global.urls.group)+this.props.groupId
    Http.httpGet(url, this._setData.bind(this))
  }

  _setData(responseData) {
    this.setState({
      pics: responseData.pics,
      loaded: true
    })
  }

  render() {
    if(!this.state.loaded){
      return (
        <View style={styles.loading}>
          <Text>
            Loading data...
          </Text>
        </View>
      );
    }else{
      pics = [];

      return (
        <ScrollableTabView
          renderTabBar={() => <FullPicTabBar/>}
          tabBarPosition="top"
          >
          {
            this.state.pics.map((pic, index) => {
              return (<FullPicView pic={pic} tabLabel={index+1} key={index}/>);  // 单行箭头函数无需写return
            })
          }
        </ScrollableTabView>
      );
    }

  }

}
var styles = StyleSheet.create({
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
