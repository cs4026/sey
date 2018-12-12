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
          let companies = responseJson.data.values.filter( company =>  company[0] != undefined && company != null && company[0].length!=0 && company!= "" )
          let coffees = responseJson.data.values[0]
            .filter( cell => cell!="" && cell!= undefined)
            .map(c=>{
              return {
                name:c.toLowerCase(),
              }
            })
          companies.map( ( val, index ) =>{
            let copyCoffee = []
            let company = val[0]
            let coffeeLbs = val.slice(1)
            let j = 0;
            for(let i = 0;i<coffees.length;i++){
              copyCoffee[i]={}
              copyCoffee[i].name   = coffees[i].name
              copyCoffee[i].bulk   = coffeeLbs[j]
              copyCoffee[i].retail = coffeeLbs[j+1]
              j = j+2
            }
            company = company.toLowerCase()
            head.push({name:company,bulk:9,retail:9,showDetail:true,coffees:copyCoffee})
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
            <Text> {this.props.company.name}</Text>
            <CoffeeContainer coffees={this.props.company.coffees} />
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}

class CoffeeContainer extends React.Component{
  render(){
    const coffees = this.props.coffees;
    return (
      <View>
        {
          coffees.map( ( coffee , index) => {
            return <Coffee coffee={coffee} key={index} index={index} />
          })
        }
      </View>
    )
  }
}

class Coffee extends React.Component{
  render(){
    const coffee = this.props.coffee;
    const index = this.props.index;
    return (
      <TouchableWithoutFeedback  onPress={ ()=>{ Alert.alert(coffee.bulk) } } >
      <View key={index} style={{flex:1, flexDirection:"row",alignItems:'center',justifyContent:'center',padding:5,borderWidth:1,marginBottom:10}}>
        <Text style={{width:100}}> {coffee.name}</Text>
        <Text style={{width:55}}> b: {coffee.bulk}    </Text>
        <Text style={{width:55}}> r: {coffee.retail}    </Text>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}
//<Text style={{borderWidth:1,alignSelf:'flex-end'}}> {coffee.retail}  </Text>
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
  wrap: {flex:1, alignItems:'center',justifyContent:'center',padding: 50,borderWidth:1,marginBottom:10},
  item: {fontWeight:"bold",fontSize:35,}
});
