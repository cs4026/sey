import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,Alert,ScrollView,RefreshControl,Image } from 'react-native';
import axios from 'axios'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default class App extends React.Component {
  constructor(props) {
     super(props);
     this.state={
       fetching:false,
       tableHead: [],
       tableData: [],
       refreshing:false,
       widthArr:[40, 60, 80, 100, 120, 140, 160, 180, 200]
     }
     this.fetchData=this.fetchData.bind(this)
  }

  componentDidMount(){
    this.fetchData()
  }
   fetchData() {
     this.setState({fetching:true})
     return axios.get('http://192.168.1.38:8080',{},{
       headers: {Connection:'keep-alive'}
      }).then((responseJson) => {
          let arr = []
          let head =[]
          responseJson.data.values.map( ( val, index ) =>{
             if(index==0){ head=val; }
             else{ arr.push(val) }
           })
           this.setState({tableHead:head,tableData:arr,data:true,fetching:false})
           return Promise.resolve()
         return Promise.resolve()
       })
       .catch((error) => {
         Alert.alert("Error")
         console.error(error);
         return Promise.resolve()
       });

    }

    _onLongPressButton() {
      Alert.alert('You long-pressed the button!')
    }

    _onRefresh = () => {
    this.setState({refreshing: true,fetching:true});
    this.fetchData().then(() => {
      this.setState({refreshing: false,fetching:false});
    });
  }

  render() {
    if(this.state.fetching){
      return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image source={require('./giphy.gif')} />
          <Text>~~~L-O-A-D-I-N-G~~~</Text>
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.text}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  {
                    this.state.tableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={this.state.widthArr}
                        style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                      />
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

/**
contentContainerStyle={{flex:1,justifyContent:'center'} }
 refreshControl={
   <RefreshControl
     refreshing={this.state.refreshing}
     onRefresh={this._onRefresh}
   />
 }
    **/

class Tables extends React.Component{
  render(){
    console.log(this.props.data);
    return (<Text>{this.props.data}</Text>)
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30 },
  head: { height: 40 },
  dataWrapper: { marginTop: -1 },
  text2:{fontWeight:"bold"},
  text: { margin: 6 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});
