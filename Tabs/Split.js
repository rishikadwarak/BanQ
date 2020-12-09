import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  //Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { Button, CardItem, Body } from 'native-base';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Split extends Component {

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  };

  constructor() {
    super()
    this.state = {
      Id: '',
      personYouAreOwed: '',
      moneyYouAreOwed: 0,
      personYouOwe: '',
      moneyYouOwe: 0,
      people: [],
      youOwe: [],
      youAreOwed: [],
      toggleYouOwe: false,
      toggleYouAreOwed: false,
      toggleSplit: false,
      splitAmount: 0,
      splitNames: [],
      splitNameInput: '',
    }
  }

  async componentDidMount() {
    await auth().onAuthStateChanged(async (user) => {
      if (!user)
        console.log("error has occured in authstatechanged ");
      if (user) {
        console.log("The is the user " + user);
        let userName = user.email;
        userName = userName.split("@")
        if (userName[0].includes('.'))
          userName[0] = userName[0].replace(/[.]/g, "+");
        let Id = userName[0];
        console.log(Id);
        await this.setState({
          Id: Id
        })

      }
      //let Id = "rt347"
      console.log(Id);
      console.log("In auth chnage")

    })
    // console.log(new Date(2020, 10, 18).getTime())
    database().ref("Split/" + this.state.Id).on('value', snap => {
      if (snap.child("You Owe").val() != null) {
        let list = []
        snap.child("You Owe").forEach(subSnap => {
          console.log("inside you owe")
          // console.log(subSnap)
          let temp = new Object
          temp.name = subSnap.val().name
          temp.amount = subSnap.val().amount
          list.push(temp);
          console.log(list);
        })
        this.setState({ youOwe: list })
      }
      if (snap.child("You Are Owed").val() != null) {
        let list = []
        snap.child("You Are Owed").forEach(subSnap => {
          console.log("inside you are owed")
          let temp = new Object
          temp.name = subSnap.val().name
          temp.amount = subSnap.val().amount
          list.push(temp);
        })
        this.setState({ youAreOwed: list })
        // console.log(this.state.youAreOwed);
      }
    })

  }
  logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
        this.props.navigation.navigate("Auth")
      });
  }

  removeMoneys = (Name, money_amount, where) => {
    database().ref("Split/" + this.state.Id + "/" + where + "/").on('value', (snapshot) => {
      console.log(snapshot.val());
      snapshot.forEach(subSnap => {
        if (subSnap.val().name == Name && subSnap.val().amount == money_amount) {
          console.log(subSnap.key)
          database().ref("Split/" + this.state.Id + "/" + where + "/" + subSnap.key + "/").remove();
        }
      })
    })

  }

  displayYouOwe = () => {
    /* SAJAL
    Also fix the touchable opacity items and make them more presentable */
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column' }}>
          {
            <FlatList style={{ width: '100%' }}
              data={this.state.youOwe}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '600', fontFamily: 'Oxygen-Bold'
                    }}>{item.name} :<Text style={{ marginLeft: 20 }}> Rs. {item.amount}</Text></Text>
                    {/* <Text>{item.name} {" :  Rs."} {item.amount} </Text> */}
                    <TouchableOpacity style={styles.button} onPress={() => { this.removeMoneys(item.name, item.amount, "You Owe") }}>
                      <Text>  x  </Text>
                    </TouchableOpacity>
                  </View>)
              }} />

          }
        </View>
      </View>
    )
  }

  displayYouAreOwed = () => {
    /* SAJAL
    Also fix the touchable opacity items and make them more presentable */
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column' }}>
          {
            <FlatList style={{ width: '100%' }}
              data={this.state.youAreOwed}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '600', fontFamily: 'Oxygen-Bold'
                    }}>{item.name} :<Text style={{ marginLeft: 20 }}> Rs. {item.amount}</Text></Text>
                    {/* <Text>{item.name} {" :  Rs."} {item.amount} </Text> */}
                    <TouchableOpacity style={styles.button} onPress={() => { this.removeMoneys(item.name, item.amount, "You Are Owed") }}>
                      <Text>  x  </Text>
                    </TouchableOpacity>
                  </View>)
              }} />

          }
        </View>
      </View>
    )
  }

  toggleYouOweFunc = () => {
    console.log("boiiii");
    //console.log(this.state.toggleAddButton);
    this.setState({
      toggleYouOwe: !this.state.toggleYouOwe
    })

  }
  toggleYouAreOwedFunc = () => {
    //console.log("New Item Being added");
    //console.log(this.state.toggleAddButton);
    this.setState({
      toggleYouAreOwed: !this.state.toggleYouAreOwed
    })

  }
  toggleSplitFunc = () => {
    //console.log("New Item Being added");
    //console.log(this.state.toggleAddButton);
    this.setState({
      toggleSplit: !this.state.toggleSplit
    })

  }

  saveChangesYouOwe = () => {
    database().ref("Split/" + this.state.Id + "/You\ Owe/").push({
      name: this.state.personYouOwe,
      amount: this.state.moneyYouOwe,
    })
    this.setState({ toggleYouOwe: false })
  }

  saveChangesYouAreOwed = () => {
    console.log("Save button pressed boi")
    database().ref("Split/" + this.state.Id + "/You\ Are\ Owed/").push({
      name: this.state.personYouAreOwed,
      amount: this.state.moneyYouAreOwed,
    })
    this.setState({ toggleYouAreOwed: false })
  }

  saveChangesSplit = () => {
    console.log("Split save button pressed boi")
    var list = this.state.splitNameInput.split(",")
    console.log(list);
    this.setState({ splitNames: list })
    let num = list.length;
    let splitmoneys = this.state.splitAmount / (num + 1);
    splitmoneys = Math.round(splitmoneys)
    list.forEach(Name => {
      // console.log("inside loop");
      console.log(Name);
      database().ref("Split/" + this.state.Id + "/You\ Are\ Owed/").push({
        name: Name,
        amount: splitmoneys,
      })

    })
    // database().ref("Split/" + this.state.Id + "/You\ Are\ Owed/").push({
    //   name: this.state.personYouAreOwed,
    //   amount: this.state.moneyYouAreOwed,
    // })
    this.setState({ toggleSplit: false })
  }

  checkCommonsYouOwe = () => {


  }

  checkCommonsYouAreOwed = () => {

  }


  showYouOwe = () => {
    /* SAJAL
    This is where you need to fix the text inputs and the save button */
    // console.log("Entering show new item")
    if (this.state.toggleYouOwe) {
      return (
        <View style={{ backgroundColor: 'green' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Amount</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ moneyYouOwe: input }) }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Name</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ personYouOwe: input }) }} style={{ width: 50, color: 'red' }} />
          </View>
          {/* <Button title="save changes" onPress={() => { this.saveChangesYouOwe() }}></Button> */}
          <Button full
            style={styles.buttonStyle} onPress={() => this.saveChangesYouOwe()}>
            <Text style={styles.buttonTextStyle}>Save Changes</Text>
          </Button>
        </View>
      )
    }

  }

  showYouAreOwed = () => {
    /* SAJAL
    This is where you need to fix the text inputs and the save button */
    if (this.state.toggleYouAreOwed) {
      return (
        <View style={{ backgroundColor: 'green' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Amount</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ moneyYouAreOwed: input }) }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Name</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ personYouAreOwed: input }) }} style={{ width: 50, color: 'red' }} />
          </View>
          {/* <Button title="save changes" onPress={() => { this.saveChangesYouAreOwed() }}></Button> */}
          <Button full
            style={styles.buttonStyle} onPress={() => this.saveChangesYouAreOwed()}>
            <Text style={styles.buttonTextStyle}>Save Changes</Text>
          </Button>
        </View>
      )
    }

  }

  showSplit = () => {
    /* SAJAL
   This is where you need to fix the text inputs and the save button */
    if (this.state.toggleSplit) {
      return (
        <View style={{ backgroundColor: 'green' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Amount</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ splitAmount: input }) }} style={{ width: 50, color: 'red' }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Names</Text>
            <TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ splitNameInput: input }) }} />
          </View>
          {/* <Button title="save changes" onPress={() => { this.saveChangesSplit() }}></Button> */}
          <Button full
            style={styles.buttonStyle} onPress={() => this.saveChangesSplit()}>
            <Text style={styles.buttonTextStyle}>Save Changes</Text>
          </Button>
        </View>
      )
    }

  }

  render() {

    return (
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
        imageStyle={{
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
        source={require('../assets/bg.png')}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 40,
            height: 51,
            resizeMode: 'contain',
            justifyContent: 'flex-start',
            padding: 25,
            margin: 10,
          }}
        />
        <View>
          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Button full
              style={styles.buttonStyle} onPress={() => this.toggleYouOweFunc()}>
              <Text style={styles.buttonTextStyle}>You Owe</Text>
            </Button>
            {this.showYouOwe()}
          </View>

          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Button full
              style={styles.buttonStyle} onPress={() => this.toggleYouAreOwedFunc()}>
              <Text style={styles.buttonTextStyle}>You Are Owed</Text>
            </Button>
            {this.showYouAreOwed()}
          </View>

          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Button full
              style={styles.buttonStyle} onPress={() => this.toggleSplitFunc()}>
              <Text style={styles.buttonTextStyle}>Split</Text>
            </Button>
            {this.showSplit()}
          </View>
          <CardItem style={styles.cardItem}>
            <Body style={{ margin: 25 }}>
              <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: '600', fontFamily: 'Oxygen-Bold' }}>LEDGER</Text>
              <View>
                <Text style={{
                  alignSelf: 'flex-start', fontSize: 18,
                  fontWeight: '600', fontFamily: 'Oxygen-Bold'
                }}>You Owe:</Text>
                {this.displayYouOwe()}
                <Text style={{
                  alignSelf: 'flex-start', fontSize: 18,
                  fontWeight: '600', fontFamily: 'Oxygen-Bold'
                }}>You Are Owed:</Text>
                {this.displayYouAreOwed()}
                {/* <Text style={{fontSize: 15,
                 fontWeight: '600', fontFamily: 'Oxygen-Bold'}}>Jane :<Text style={{marginLeft: 20}}> Rs. 40</Text></Text> */}
              </View>
            </Body>
          </CardItem>
        </View>
      </ImageBackground>
      // <ScrollView>
      //   <View style={styles.container}>
      //     <Text>SPLIT</Text>
      //   </View>
      //   <View>
      //     <Button title="YOU OWE" onPress={() => this.toggleYouOweFunc()} />
      //     {this.showYouOwe()}
      //     <Button title="YOU ARE OWED" onPress={() => this.toggleYouAreOwedFunc()} />
      //     {this.showYouAreOwed()}
      //     <Button title="SPLIT" onPress={() => this.toggleSplitFunc()} />
      //     {this.showSplit()}
      //   </View>
      //   <View>
      //     <Text>YOU OWE:</Text>
      //     {this.displayYouOwe()}
      //     <Text>YOU ARE OWED:</Text>
      //     {this.displayYouAreOwed()}
      //   </View>

      //   {/* <Button title="Logout" onPress={() => { this.logout() }} /> */}

      // </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    fontSize: 20,
    fontFamily: 'Oxygen-Regular',
    fontWeight: '600',
    marginLeft: -10,
    paddingBottom: 3,
  },
  viewStyle: {
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: 'gray',
    marginBottom: 25,
  },
  cardItem: {
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    height: 'auto',
  },
  logocard: {
    borderRadius: 500,
    width: 200,
    height: 200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginTop: 5,
    borderRadius: 25,
    backgroundColor: '#EA5656',
    alignSelf: 'center',
    width: '90%',
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: 'Oxygen-Bold',
    fontWeight: 'bold',
    color: 'white',
  },
  linkTextStyle: {
    alignSelf: 'center',
    margin: 20,
    fontFamily: 'Oxygen-Light',
  },
  linkStyle: {
    color: 'blue',
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#777',
//     padding: 8,
//     margin: 10,
//     width: 200,
//   },
//   button: {
//     justifyContent: 'center',
//     textAlign: 'center',
//     width: 25,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     margin: 20,
//     //position: 'absolute',
//     //right: 0,
//   },
// });