import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Grid,
  Col,
  Row,
  Left,
  Thumbnail,
  Button,
  Icon,
  Right,
} from 'native-base';

import auth from '@react-native-firebase/auth';

export default class Profile extends Component {
  // SignOUt = () => {
  //   auth()
  //   .signOut()
  //   .then(() =>{
  //     window.alert('Signed Out');
  //   })
  // }

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <ImageBackground
          style={styles.imgBackground}
          imageStyle={styles.imgBG}
          source={require('../assets/bg.png')}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoStyle}
          />
          <CardItem style={styles.logocard}>
            <Image
              source={require('../assets/thumbnail.png')}
              style={{
                width: 83,
                height: 108,
                resizeMode: 'contain',
                margin: 10,
              }}
            />
          </CardItem>

          <Card
            style={{
              alignSelf: 'center',
              padding: 20,
              height: 100,
              width: 350,
              borderRadius: 20,
            }}>
            <Body
              style={{
                textAlign: 'left',
                padding: 0,
                height: 100,
                width: 300,
                borderRadius: 20,
              }}>
              <Text style={styles.largeTextHead}>Sajal Ganjewala</Text>
              <Text note style={styles.smallTextHead}>
                Shiv Nadar University
              </Text>
            </Body>
          </Card>

          <Card
            style={{
              alignSelf: 'center',
              padding: 20,
              height: 300,
              width: 350,
              borderRadius: 20,
            }}>
            <Grid>
              <Body
                style={{
                  textAlign: 'left',
                  padding: 0,
                  height: 100,
                  width: 300,
                  borderRadius: 20,
                  marginTop: 50,
                  paddingBottom: 10,
                }}>
                <Text style={styles.largeText}>Settings</Text>
              </Body>
            </Grid>
            <Grid style={{ marginTop: 0, paddingBottom: 30 }}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="envelope"
                    style={{ fontSize: 30, color: '#1EE1A8' }}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>sparsh@sparsh.com</Text>
                </Body>
              </Col>
            </Grid>

            <Grid style={{ marginTop: 0, paddingBottom: 30 }}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="phone-square"
                    style={{ fontSize: 30, color: '#38A5C7' }}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>9971372420</Text>
                </Body>
              </Col>
            </Grid>

            <Grid style={{ marginTop: 0, paddingBottom: 30 }}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="key"
                    style={{ fontSize: 30, color: '#DD1243' }}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>Edit</Text>
                </Body>
              </Col>
            </Grid>

            <Grid style={{ marginTop: 0, paddingBottom: 30 }}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="bell"
                    style={{ fontSize: 30, color: '#C18934' }}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>On/Off</Text>
                </Body>
              </Col>
            </Grid>

            <Grid style={{ marginTop: 0, paddingBottom: 30 }}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="question-circle-o"
                    style={{ fontSize: 30, color: '#EFE9CB' }}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>About</Text>
                </Body>
              </Col>
            </Grid>
          </Card>

          {/* LOGOUT */}
        </ImageBackground>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            rounded
            // onPress={() => {this.props.navigation.navigate('Home')}}
            style={styles.buttonStyleLogout}>
            <Text style={styles.buttonTextStyle}>Logout</Text>
          </Button>
        </View>
      </View>
    );
    // } else {
    //   return (
    //     <View>
    //       <Button title="close" onPress={this.close} />
    //       <NavBar />
    //     </View>
    //   );
    // }
  }
}

const styles = StyleSheet.create({
  imgBackground: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  imgBG: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logoStyle: {
    width: 40,
    height: 51,
    resizeMode: 'contain',
    justifyContent: 'flex-start',
    padding: 25,
    margin: 10,
  },
  nameCard: { textAlign: 'center', padding: 20 },
  cardItemStyle: { backgroundColor: 'transparent' },
  largeTextHead: {
    color: 'black',
    fontFamily: 'Oxygen-Bold',
    fontSize: 30,
  },
  largeText: {
    color: 'black',
    fontFamily: 'Oxygen-Bold',
    fontSize: 20,
  },
  logocard: {
    borderRadius: 300,
    width: 150,
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  smallTextHead: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Oxygen-Regular',
  },
  smallTextHead: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Oxygen-Regular',
  },
  rightText: {
    color: 'black',
    fontFamily: 'Oxygen-Bold',
    fontSize: 20,
  },
  rightTextSmall: {
    color: 'black',
    fontFamily: 'Oxygen-Regular',
    fontSize: 15,
  },
  buttonStyleLogout: {
    borderRadius: 25,
    width: '50%',
    justifyContent: 'center',
    backgroundColor: '#EA5656',
    marginTop: '50%',
  },
  buttonTextStyle: {
    fontSize: 30,
    fontFamily: 'Oxygen-Bold',
    fontWeight: 'bold',
    color: 'white',
  },
});