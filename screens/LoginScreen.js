import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';

export default class Loginscreen extends React.Component {
constructor(){
 super()
 this.state={
  emailId:'',
  password:''
 }
}

login = async(email,password) => {
  if(email && password){
      try{
    const response=await firebase.auth().signInWithEmailAndPassword(email,password)

      if(response){
        this.props.navigation.navigate({Transactions})
      } 
    }

    catch(error){
     switch(error.code){
     case 'auth/user-not-found':
      Alert.alert('User Does Not Exist')
      break;
      case 'auth/invalid-email':
      Alert.alert('Incorrect Email Or Password')
     }
    }
   }
   else{
    Alert.alert('Enter Email And Password')
   }
 }


render(){
 return(
  <KeyboardAvoidingView style={{alignItems:'center', marginTop:20}}>

   <View>
       
    <Image source={require("../assets/booklogo.jpg")} 
    style={{ width: 200, height: 200 }} />
    
    <Text style={{ textAlign: "center", fontSize: 30, fontWeight:"bold", textDecorationLine:'underline' }}>Wily</Text>

  </View>

  <View>

   <TextInput style={{width: 300, height: 40, borderWidth: 1.5, borderRadius:2, paddingLeft:20, margin:20}}
   placeholder='abc@example.com'
   keyboardType='email.addres'
   onChangeText={(text)=>{
    this.setState({
      emailId:text
    })
   }}/>

   <TextInput style={{width: 300, height: 40, borderWidth: 1.5, borderRadius:2, paddingLeft:20, margin:20}}
   secureTextEntry={true}
   placeholder='Enter Password'
   onChangeText={(text)=>{
    this.setState({
      password:text
    })
   }}/>

  </View>

  <View>

   <TouchableOpacity style={{heigth:30, width:90, backgroundColor:'red', padding:10, borderRadius:2, borderWidth:2.5}}
   onPress={()=>{
     this.login(this.state.emailId, this.state.password)
   }}>

     <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold', textDecorationLine:'underline'}}> Login </Text>

   </TouchableOpacity>

  </View>

 </KeyboardAvoidingView>
  )
 }
}
