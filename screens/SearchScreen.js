import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import db from '../config'

export default class Searchscreen extends React.Component {
 constructor(){
   super()
   this.state={
     AllTransactions:[],
   }
 }

 componentDidMount = async()=>{
  const query = await db.collection('Transaction').get()
  query.docs.map((doc)=>{
   this.setState({
     AllTransactions:[...this.state.AllTransactions,doc.data()]
   })
  })
 }

    render() {
      return (
        <FlatList data={this.state.AllTransactions}
        renderItem={({item})=>{
          console.log(item.BookID);
          <View style={{borderBottomWidth:2}}>
            <Text>{'BookID:'+item.BookID}</Text>
            <Text>{'StudentID:'+item.StudentID}</Text>
            <Text>{'TransactionType:'+item.transactionType}</Text>
          </View>
        }}
        keyExtractor={(item,index)=>index.toString()}/>
      );
    }
  }