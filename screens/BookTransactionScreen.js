import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, ToastAndroid, Alert, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import db from '../config.js'
import *as firebase from 'firebase'

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal',
        transactionMessage:''
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    }
    
    initiateBookIssue = async()=>{
      db.collection('Transaction').add({
        'StudentID':this.state.scannedStudentId,
        'BookID':this.state.scannedBookId,
        'Date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':'Issue'
      })
      db.collection('Books').doc(this.state.scannedBookId).update({
        'BookAvailability':false,
      })
      db.collection('Students').doc(this.state.scannedStudentId).update({
        'NumberOfBookIssue':firebase.firestore.FieldValue.increment(1)
      })
      Alert.alert('BookIssue')
      this.setState({
        scannedBookID:'',
        scannedStudentId:''
      })
    }
    initiateBookReturn = async()=>{
      db.collection('Transaction').add({
        'StudentID':this.state.scannedStudentId,
        'BookID':this.state.scannedBookId,
        'Date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':'Return'
      })
      db.collection('Books').doc(this.state.scannedBookId).update({
        'BookAvailability':true,
      })
      db.collection('Students').doc(this.state.scannedStudentId).update({
        'NumberOfBookIssue':firebase.firestore.FieldValue.increment(-1)
      })
      Alert.alert('BookReturn')
      this.setState({
        scannedBookID:'',
        scannedStudentId:''
      })
    }

    checkStudentEligibilityForBookIssue = async()=>{
      const StudentsRef=await db.collection('Students').where('StudentID','==', this.state.scannedStudentId).get()
      var isStudentEligible=''
      if(StudentsRef.doc.length===0){
        this.setState({
          scannedStudentId:'',
          scannedBookId:''
        })
       isStudentEligible=false
       Alert.alert('Student Does Not Exist')
      }
      else{
        StudentsRef.docs.map((doc)=>{
          var Student=doc.data()
          if(Student.NumberOfBookIssue=2){
            isStudentEligible=true
          }
          else{
            isStudentEligible=false
            Alert.alert('Student Already Issued 2 Books')
            this.setState({
              scannedStudentId:'',
              scannedBookId:''
            })
          }
        })
      }
      return isStudentEligible
    }

    checkStudentEligibilityForBookIssue = async()=>{
      const TransactionRef = await db.collection('Transaction').where('BookID','==', this.state.scanneBookId).limit(1).get()
       var isStudentEligible=''
       TransactionRef.docs.map((doc)=>{
         var lastBookTransaction=doc.data()
         if(lastBookTransaction.StudentID===this.state.scannedStudentId){
           isStudentEligible=true
         }
        else{
          isStudentEligible=false
          Alert.alert('Book Was Not Issued By The Student')
          this.setState({
            scannedStudentId:'',
            scannedBookId:''
          })
        }
     })
     return isStudentEligible
    }

    checkBookEligibility = async()=>{
      const BookRef = await db.collection('Books').where('BookID','==', this.state.scanneBookId).get()
      var Transaction=''
      if(BookRef.docs.length===0){
       transactionType=false
      }
      else{
        BookRef.docs.map((doc)=>{
         if(Book.BookAvailability){
           transactionType='Issue'
         }
         else{
          transactionType='Return'
        }
        })
      }
      return transactionType
    }

    handleTransaction = async()=>{
      var transactionMessage=await this.checkBookEligibility()
       if(!transactionType){
        Alert.alert('The Book Does Not Exist In The Library')
        this.setState({
          scannedBookId:'',
          scannedStudentId:''
        })
       }
        else if(transactionType==='Issue'){
          var isStudentEligible=await this.checkStudentEligibilityForBookIssue()
          if(isStudentEligible){
          this.initiateBookIssue
          Alert.alert('Book Issued To The Student')
          }
        }
        else{
          var isStudentEligible=await this.checkStudentEligibilityForReturn()
          if(isStudentEligible){
          this.initiateBookReturn
          Alert.alert('Book Returned To The Library')
          }
        }
      }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }
      else if (buttonState === "normal") {
        return (
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View>
              <Image
                source={require("../assets/booklogo.jpg")}
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ textAlign: "center", fontSize: 30, fontWeight:'bold', textDecorationLine:'underline' }}>Wily</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputBox}
                placeholder="Book Id"
                onChangeText={text => {
                  this.setState({
                    scannedBookId: text
                  });
                }}
                value={this.state.scannedBookId}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => {
                  this.getCameraPermissions("BookId");
                }}
              >
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
  
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputBox}
                placeholder="Student Id"
                onChangeText={text => {
                  this.setState({
                    scannedStudentId: text
                  });
                }}
                value={this.state.scannedStudentId}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => {
                  this.getCameraPermissions("StudentId");
                }}
              >
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.transactionAlert}>
              {this.state.transactionMessage}
            </Text>
            <TouchableOpacity
              style={styles.SubmitButton}
              onPress={async () => {
                var transactionMessage = this.handleTransaction();
              }}
            >
              <Text style={{textAlign:'center', color:'white', fontSize:20, fontWeight:'bold', padding:12}}>SUBMIT</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    SubmitButton:{
      backgroundColor: '#66BB6A',
      width: 150,
      height:50,
      textAlign:'center'
    }
  });