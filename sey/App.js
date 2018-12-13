import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  RefreshControl,
  Image,
  FlatList,
  Modal,
  TouchableHighlight,
  TextInput
} from 'react-native';
import axios from 'axios'



export default class App extends React.Component {
  constructor(props) {
     super(props);
     this.state={
       fetching:false,
       tableHead: [],
       tableData: [],
       refreshing:false,
       modalVisible: false,
       modalViewData: false,
       refresh:false,
     }
     this.fetchData=this.fetchData.bind(this);
     this.changeDetail = this.changeDetail.bind(this);
     this.modalSet=this.modalSet.bind(this);
     this.closeModal=this.closeModal.bind(this);
     this.refresh = this.refresh.bind(this)
  }

  componentDidMount(){
    this.fetchData()
    if(this.state.refresh==true){ this.setState({refresh:false}) }
  }

  refresh(){
    this.setState({refresh:true})
  }

  changeDetail(index){
    let table = this.state.tableHead
    let c = table[index]
    c.showDetail = !c.showDetail
    this.setState({tableHead:table})
  }

   fetchData() {
     this.setState({fetching:true})
     return axios.get('http://192.168.1.9:8080',{},{
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
              copyCoffee[i].name     = coffees[i].name
              copyCoffee[i].bulk     = coffeeLbs[j]
              copyCoffee[i].retail   = coffeeLbs[j+1]
              copyCoffee[i].editable = false
              j = j+2
            }
            company = company.toLowerCase()
            head.push({name:company,bulk:9,retail:9,showDetail:false,coffees:copyCoffee})
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
  setModalVisible(visible) {
  this.setState({modalVisible: visible});
  }

  modalSet(index){
    let visibility = this.state.modalVisible
    this.setState({ modalViewData:index , modalVisible : !visibility})
  }

  closeModal(){
    this.setState({modalVisible:false,modalViewData:false})
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

         <View >
           <Modal
             animationType="fade"
             transparent={false}
             visible={this.state.modalVisible}>
             <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <CompanyModal refresh={this.refresh} closeModal={this.closeModal} company={this.state.tableHead[this.state.modalViewData]} />
             </View>
           </Modal>
         </View>

          <ScrollView style={{marginTop:50}} >
            <View>
            {
              this.state.tableHead.map( ( item , index ) =>{
                return <Company modalSet={this.modalSet} key={index} company={item} index={index} changeDetail={this.changeDetail}/>
              })
            }
            </View>
          </ScrollView>
        </ScrollView>

      );
    }
  }
}

class CompanyModal extends React.Component{
  render(){
    return (
      <TouchableWithoutFeedback  onLongPress={this.props.closeModal}>
        <View style={{height:700, alignItems:'center',justifyContent:'center',padding: 30,borderWidth:1}}>
          <Text> {this.props.company.name}</Text>
          <CoffeeContainerModal refresh={this.props.refresh} editCell={this.props.editCell} coffees={this.props.company.coffees} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class CoffeeContainerModal extends React.Component{

  render(){
    const coffees = this.props.coffees;
    const editCell=(index)=>{
       const truth = coffees[index].editable
       coffees[index].editable=!truth;
       this.props.refresh(true)
    }
    return (
      <View>
        {
          coffees.map( ( coffee , index) => {
            return <CoffeeModal editCell={editCell} coffee={coffee} key={index} index={index} />
          })
        }
      </View>
    )
  }
}

class CoffeeModal extends React.Component{
  render(){
    const coffee = this.props.coffee;
    const index = this.props.index;
    const editiable = coffee.editable;
    let bulk = coffee.bulk
    let retail = coffee.retail
    if(editiable==true){
      return(
        <TouchableWithoutFeedback onLongPress={()=>{ this.props.editCell(index) }}>
        <View key={index} style={{flex:1, flexDirection:"row",alignItems:'center',justifyContent:'center',padding:50,borderWidth:1,marginBottom:10}}>
          <TouchableWithoutFeedback onPress={()=>{ this.props.editCell(index) }}>
            <View style={{paddingRight:20}}><Text style={{fontSize:25,color:'red'}}>X</Text></View>
          </TouchableWithoutFeedback>
          <Text style={{width:100}}> {coffee.name}</Text>
          <Text> b:</Text>
          <TextInput
             keyboardType={"numeric"}
             placeholder={bulk}
             onChangeText={(text) => {coffee.bulk=text}}
             style={{width:30}}
           />
          <Text > r:     </Text>
          <TextInput
             keyboardType={"numeric"}
             placeholder={retail}
             onChangeText={(text) => {coffee.retail=text}}
             style={{width:30}}
           />
        </View>
        </TouchableWithoutFeedback>

      )
    }else{
      return (
        <TouchableWithoutFeedback onLongPress={()=>{ this.props.editCell(index) }} >
          <View key={index} style={{flex:1, flexDirection:"row",alignItems:'center',justifyContent:'center',padding:5,borderWidth:1,marginBottom:10}}>
            <Text style={{width:100}}> {coffee.name}</Text>
            <Text style={{width:55}}> b: {coffee.bulk}    </Text>
            <Text style={{width:55}}> r: {coffee.retail}    </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}

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
        <TouchableWithoutFeedback  onPress={ ()=>{ this.props.changeDetail(index) } } onLongPress={()=>{this.props.modalSet(index)}}>
          <View style={styles.wrap}>
            <Text> {this.props.company.name}</Text>
            <CoffeeContainer modalSet={this.props.modalSet} companyIndex={index} setModalVisible={this.props.setModalVisible} coffees={this.props.company.coffees} />
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}

class CoffeeContainer extends React.Component{
  render(){
    const coffees = this.props.coffees;
    const company = this.props.companyIndex;
    return (
      <TouchableWithoutFeedback  onLongPress={()=>{this.props.modalSet(company)}}>
      <View>
        {
          coffees.map( ( coffee , index) => {
            return <Coffee company={company} modalSet={this.props.modalSet} coffee={coffee} key={index} index={index} />
          })
        }
      </View>
      </TouchableWithoutFeedback>
    )
  }
}


class Coffee extends React.Component{
  render(){
    const coffee = this.props.coffee;
    const index = this.props.index;
    return (
      <TouchableWithoutFeedback onLongPress={()=>{this.props.modalSet(this.props.company)}}>
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
