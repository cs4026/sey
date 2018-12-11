import React from 'react';
import { StyleSheet, Text, View,TouchableWithoutFeedback,Alert,ScrollView,RefreshControl,Image,FlatList } from 'react-native';
import axios from 'axios'



export default class App extends React.Component {
  constructor(props) {
     super(props);
     this.state={
       fetching:false,
       tableHead: [],
       tableData: [],
       refreshing:false,
       widthArr:[150, 60, 80, 100, 120, 140, 160, 180, 200]
     }
     this.fetchData=this.fetchData.bind(this);
     this.changeDetail = this.changeDetail.bind(this);
  }

  componentDidMount(){
    this.fetchData()
  }

  changeDetail(index){
    let table = this.state.tableHead
    let c = table[index]
    c.showDetail = !c.showDetail
    this.setState({tableHead:table})
  }

   fetchData() {
     this.setState({fetching:true})
     return axios.get('http://172.20.10.2:8080',{},{
       headers: {Connection:'keep-alive'}
      }).then((responseJson) => {
          let arr = []
          let head =[]
          responseJson.data.values.map( ( val, index ) =>{
            let company = val[0]
            console.log("company",company);
            if( company != undefined && company != "undefined" && company != ""){
                 company = company.toLowerCase()
                // let wl = company.length;
                // if(wl%2!=0){
                //   company = company+" ";
                //   wl = company.length;
                // }
                // let diff = (60 - wl)/2;
                // let r = " ".repeat(diff);
                // company = r + company + r;
                // console.log("LEN ",company,company.length);
                head.push({name:company,bulk:9,retail:9,showDetail:false})
            }
             //else{ arr.push(val) }
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

        <ScrollView style={styles.container}
        contentContainerStyle={{flex:1,justifyContent:'center', alignItems:"center"} }
         refreshControl={
           <RefreshControl
             refreshing={this.state.refreshing}
             onRefresh={this._onRefresh}
           />
         }>

          <ScrollView style={{marginTop:50}} >
            <View>
            {
              this.state.tableHead.map( ( item , index ) =>{
                return <Company key={index} company={item} index={index} changeDetail={this.changeDetail}/>
              })
            }
            </View>
          </ScrollView>
        </ScrollView>

      );
    }
  }
}

/**

    **/

class Company extends React.Component{
  render(){
    const index = this.props.index
    if(!this.props.company.showDetail){
      return (
        <TouchableWithoutFeedback  onPress={ ()=>{ this.props.changeDetail(index) } } >
          <View style={styles.wrap}>
            <Text>{this.props.company.name}</Text>
            </View>
        </TouchableWithoutFeedback>
      )
    }else{
      return (
        <TouchableWithoutFeedback  onPress={ ()=>{ this.props.changeDetail(index) } } >
          <View style={styles.wrap}>
            <Text> {this.props.company.name}   </Text>
            <Text> {this.props.company.bulk}   </Text>
            <Text> {this.props.company.retail} </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}

const textStyles= (word,wordLength) => {
  let varFixed = 50;
  varPad = varFixed - wordLength;
  console.log(word,wordLength,varPad,varPad+wordLength);
  return StyleSheet.create({
    item: {borderWidth:1,marginBottom:10,fontWeight:"bold",fontSize:20,padding:varPad}
  })
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30 },
  head: { height: 40 },
  dataWrapper: { marginTop: -1 },
  text2:{fontWeight:"bold"},
  text: { margin: 6 },
  row: { height: 40 },
  wrap: {flex:1, alignItems:'center',justifyContent:'center',padding: 20,borderWidth:1,marginBottom:10},
  item: {fontWeight:"bold",fontSize:35,}
});
