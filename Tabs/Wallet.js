//contains integrated Wallet

import React, { Component } from 'react';
import { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	//Text,
	StatusBar,
	//Button,
	TextInput,
	Alert,
	Image,
	ImageBackground,

} from 'react-native';

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

import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { setEnabled } from 'react-native/Libraries/Performance/Systrace';
import { VictoryPie } from 'victory-native';

/* 
Objects needed - 
TotalBudgetEdit:false,
budgetChangeFlag:false,
TotalBudgetPrev:0,
TotalBudget:0,
SpentCash:0,
 */
export default class Wallet extends Component {
	constructor() {
		super()
		this.state = {
			//Id:null,
			Id: "sn178",
			TotalBudget: 0,
			SpentCash: 0,
			StartDate: null,
			TotalBudgetEdit: false,
			budgetChangeFlag: false,
			TotalBudgetPrev: 0,
			daysLeft: 0,
			partitionBudget: 0,
			partitionsSpent: 0,
			partitionName: '',
			partitions: [],
			togglePartition: false,
			test: '',
			todayDate: null,
			todaySpentCash: 0,
			transactions: [],
			graphicData: [],
			graphicColor: ['red', 'green', 'blue', 'yellow', 'black', 'pink'],
			mountedFLag: 0
		}
	}
	async componentDidMount() {


		await auth().onAuthStateChanged(async (user) => {
			/*   if(!user)
			 console.log("error has occured in authstatechanged ");
			 if(user){
				 let userName = user.email;
				 userName = userName.split("@")
				 if(userName[0].includes('.'))
				 userName[0] = userName[0].replace(/[.]/g,"+");
				 let Id = userName[0];
				 console.log(Id);
				 this.setState({Id:Id})
				 database().ref("Budget/"+Id).once('value',snap=>{
					 this.setState({
						 TotalBudget:snap.val().TotalBudget.Total,
						 TotalBudgetPrev:snap.val().TotalBudget.Total,
						 SpentCash:snap.val().SpentCash.Cash,
						 StartDate:new Date(snap.val().DaySet.Date)
					 },()=>{
						 let tempDate = new Date(this.state.StartDate)
						 let NodaysInMonth = this.daysInMonth(tempDate.getMonth()+1,tempDate.getFullYear())	
						 console.log("Year",tempDate.getFullYear())
						 console.log(NodaysInMonth,"Days")
						 this.setState({daysLeft:NodaysInMonth-tempDate.getDate()},()=>{console.log(this.state.daysLeft,"Days left")})
   
						 //console.log(this.state.TotalBudget,this.state.SpentCash,this.state.StartDate.getDay())
					 })
				 })
			 }  */
			if (user) {
				let userName = user.email;
				userName = userName.split("@")
				if (userName[0].includes('.'))
					userName[0] = userName[0].replace(/[.]/g, "+");
				let Id = userName[0];
				console.log(Id);
				await this.setState({ Id: Id })
				/* database().ref("Budget/"+Id).once('value',snap=>{
					this.setState({
						TotalBudget:snap.val().TotalBudget.Total,
						TotalBudgetPrev:snap.val().TotalBudget.Total,
						SpentCash:snap.val().SpentCash.Cash,
						StartDate:new Date(snap.val().DaySet.Date)
					},()=>{
						let tempDate = new Date(this.state.StartDate)
						let NodaysInMonth = this.daysInMonth(tempDate.getMonth()+1,tempDate.getFullYear())	
						console.log("Year",tempDate.getFullYear())
						console.log(NodaysInMonth,"Days")
						this.setState({daysLeft:NodaysInMonth-tempDate.getDate()},()=>{console.log(this.state.daysLeft,"Days left")})
	
						//console.log(this.state.TotalBudget,this.state.SpentCash,this.state.StartDate.getDay())
					})
				}) */
				await database().ref("Budget/" + Id).once('value', async (snap) => {
					console.log("Beofre updating states");

					await this.setState(state => {
						let TotalBudget = snap.val().TotalBudget.Total
						let TotalBudgetPrev = snap.val().TotalBudget.Total
						let SpentCash = snap.val().SpentCash.Cash
						let StartDate = new Date(snap.val().DaySet.Date)
						let partitions = []
						let todayDate = new Date(snap.val().Today.Date)
						let todaySpentCash = snap.val().Today.SpentCash;
						console.log("1");
						if (todayDate.getDate() < new Date().getDate()) {
							todayDate = new Date()
							todaySpentCash = 0;
							database().ref("Budget/" + this.state.Id + "/Today").set({
								SpentCash: todaySpentCash,
								Date: todayDate.getTime()
							})

						}
						console.log("2");
						if (snap.child("Partitions").val() != null) {
							snap.child("Partitions").forEach(subSnap => {
								let tempObject = new Object()
								tempObject.Name = subSnap.val().Name
								//console.log(typeof(subSnap.val().TotalBudget),"Mounting")
								tempObject.TotalBudget = subSnap.val().TotalBudget
								tempObject.SpentCash = subSnap.val().SpentCash
								tempObject.TotalBudgetEdit = false
								tempObject.budgetChangeFlag = false
								tempObject.TotalBudgetPrev = subSnap.val().TotalBudget
								partitions.push(tempObject)

							})
						}
						console.log("3");
						return {
							TotalBudget,
							TotalBudgetPrev,
							SpentCash,
							StartDate,
							partitions,
							todayDate,
							todaySpentCash
						}

					}, () => {
						console.log("4");
						console.log(this.state.TotalBudget)
						//let tempDate = new Date(this.state.StartDate)
						let tempDate = new Date()
						let NodaysInMonth = this.daysInMonth(tempDate.getMonth() + 1, tempDate.getFullYear())
						//console.log("Year",tempDate.getFullYear())
						//console.log(NodaysInMonth,"Days")
						this.setState({ daysLeft: NodaysInMonth - tempDate.getDate() }, () => {
							console.log("All states updated")
							this.setState({ mountedFLag: 1 });
							//console.log(this.state.daysLeft,"Days left")
						})




						//console.log(this.state.TotalBudget,this.state.SpentCash,this.state.StartDate.getDay())
					})

				})

			}

			//console.log("second")





		})

		database().ref("Budget/" + this.state.Id + "/SpentCash").on('value', snap => {
			// console.log(snap.val().Cash,"From Wallet")
			this.setState({
				SpentCash: snap.val().Cash
			})
			this.setPieData();
		})
		database().ref("Budget/" + this.state.Id + "/Partitions").on('value', snap => {
			if (snap.val() == null) {
				this.setState({
					partitions: []
				})
			}
			else {
				let partitions = []
				snap.forEach(subSnap => {
					let tempObject = new Object()
					tempObject.Name = subSnap.val().Name
					//console.log(typeof(subSnap.val().TotalBudget),"Mounting")
					tempObject.TotalBudget = subSnap.val().TotalBudget
					tempObject.SpentCash = subSnap.val().SpentCash
					tempObject.TotalBudgetEdit = false
					tempObject.budgetChangeFlag = false
					tempObject.TotalBudgetPrev = subSnap.val().TotalBudget
					partitions.push(tempObject)
				})
				this.setState({
					partitions: partitions
				}, () => {
					this.setPieData();
				});
			}
		})



		database().ref("Budget/" + this.state.Id + "/Today").on('value', snap => {
			console.log("Listening")
			let tempDate = new Date(snap.val().Date)
			//console.log(tempDate,"val of tempdate",tempDate.getDate(),"hey")
			if (tempDate.getDate() < new Date().getDate()) {
				//console.log("true")
				tempDate = new Date()
				database().ref("Budget/" + this.state.Id + "/Today").set({
					SpentCash: 0,
					Date: tempDate.getTime()
				})
				this.setState({
					todaySpentCash: 0,
					todayDate: tempDate
				})
			}
			else {
				this.setState({
					todaySpentCash: snap.val().SpentCash
				})
			}
			this.mountTransactions()

		})
		/* await this.mountTransactions() */

	}

	checkDate = () => {
		database().ref("Budget/" + this.state.Id + "/Today").once('value', snap => {
			let tempDate = new Date(snap.val().Date)
			if (tempDate.getDate() < new Date().getDate()) {
				database().ref("Budget/" + this.state.Id + "/Today").set({
					SpentCash: 0,
					Date: new Date().getTime()
				})
				this.setState({
					todayDate: new Date(),
					todaySpentCash: 0
				})
			}

		})
	}

	daysInMonth = (month, year) => {
		return new Date(year, month, 0).getDate();
	}

	logout = () => {
		auth()
			.signOut()
			.then(() => {
				console.log('User signed out!')
				this.props.navigation.navigate("Auth")
			});
	}

	saveChanges = (item, index) => {
		if (!item) {
			let val = this.state.TotalBudget

			if (!isNaN(val) && !isNaN(parseFloat(val)) && parseInt(val) > 0) {
				let verification;
				if (this.state.TotalBudget > this.state.TotalBudgetPrev)
					verification = true
				else {
					if (this.state.partitions.length != 0) {
						let partitions = this.state.partitions
						let sum = 0;
						let totalPartitionSpent = 0;
						partitions.map((item, index) => {
							sum += parseInt(item.TotalBudgetPrev)
							totalPartitionSpent += item.SpentCash;
						})
						//console.log("Total budget " + this.state.TotalBudget + " " + sum)
						if (this.state.SpentCash > totalPartitionSpent)
							sum += this.state.SpentCash - totalPartitionSpent
						if (this.state.TotalBudget >= sum)
							verification = true
						else {
							verification = false
							alert("The Budget can only be reduced by " + (parseInt(this.state.TotalBudgetPrev) - sum))
						}
					}

					else {
						if (this.state.TotalBudget < this.state.SpentCash) {
							alert("Enter a valid budget value");
							verification = false;
						}
					}


				}

				if (verification) {
					this.setState({
						budgetChangeFlag: false,
						TotalBudgetPrev: parseInt(this.state.TotalBudget),
						TotalBudgetEdit: false
					})
					database().ref("Budget/" + this.state.Id + "/TotalBudget").set({
						Total: parseInt(this.state.TotalBudget)
					})

				}


			}
			else {
				Alert.alert("Enter valid Number in Total Budget")
			}

		}
		else {
			let val = item.TotalBudget
			console.log("CHnaged budget " + val + " " + typeof (val))
			let x = parseInt(val);
			console.log(x, typeof (x), x > 0)
			if (!isNaN(val) && !isNaN(parseFloat(val))) {

				if (parseInt(val) >= 0) {
					let verification = this.verifyPartitionChange(item, index)
					if (verification) {
						this.setState(state => {
							let partitions = state.partitions
							partitions[index].budgetChangeFlag = false
							partitions[index].TotalBudgetPrev = parseInt(partitions[index].TotalBudget)
							partitions[index].TotalBudgetEdit = false
							return {
								partitions
							}
						})
						database().ref("Budget/" + this.state.Id + "/Partitions/" + item.Name).set({
							Name: item.Name,
							SpentCash: item.SpentCash,
							TotalBudget: parseInt(item.TotalBudget),
						})
					}

				}
				else {
					alert("Entered value is less than 0")
				}


			}
			else {
				Alert.alert("Enter valid Number in ", partitions[index].Name)
			}



		}

	}

	verifyPartitionChange = (item, index) => {
		if (item.TotalBudget < item.TotalBudgetPrev) {

			if (item.TotalBudgetPrev - item.TotalBudget <= item.TotalBudgetPrev - item.SpentCash)
				return true
			else {
				alert("Maximum possible decrement is " + (item.TotalBudgetPrev - item.SpentCash));
				return false;
			}
		}
		else {
			let sum = 0;
			let totalPartitionSpent = 0;
			this.state.partitions.map((itemLoop, indexLoop) => {
				sum += itemLoop.TotalBudgetPrev
				totalPartitionSpent += itemLoop.SpentCash;

			})
			if (totalPartitionSpent < this.state.SpentCash) {
				sum += this.state.SpentCash - totalPartitionSpent;
			}
			if (sum + (item.TotalBudget - item.TotalBudgetPrev) > this.state.TotalBudget) {
				alert("The permissible increment is " + (parseInt(this.state.TotalBudget) - sum))
				return false;
			}
			else
				return true;
		}
	}

	showButtonSaveChanges = (item, index) => {
		if (!item) {
			if (this.state.TotalBudgetEdit && this.state.TotalBudgetPrev != this.state.TotalBudget) {
				return (
					<TouchableHighlight onPress={() => { this.saveChanges() }}>
						<Icon name="save" size={30} ></Icon>
					</TouchableHighlight>
				);
			}
			else {
				return null;
			}
		}
		else {
			if (item.TotalBudgetEdit && item.TotalBudgetPrev != item.TotalBudget) {

				return (
					<TouchableHighlight onPress={() => { this.saveChanges(item, index) }}>
						<Icon name="save" size={30} ></Icon>
					</TouchableHighlight>
				)

			}
		}
	}
	toggleChangeBudget = (item, index) => {
		if (!item) {
			if (this.state.budgetChangeFlag) {
				this.setState({ TotalBudget: this.state.TotalBudgetPrev, budgetChangeFlag: false })
			}

			this.setState({
				TotalBudgetEdit: !this.state.TotalBudgetEdit
			})
		}
		else {

			if (item.budgetChangeFlag) {
				this.setState(state => {
					let partitions = state.partitions
					partitions[index].TotalBudget = item.TotalBudgetPrev
					partitions[index].budgetChangeFlag = false

					return {
						partitions
					}

				})
			}
			this.setState(state => {
				let partitions = state.partitions
				partitions[index].TotalBudgetEdit = !partitions[index].TotalBudgetEdit
				return {
					partitions
				}
			})
		}
	}

	togglePartitionView = () => {
		this.setState({
			togglePartition: !this.state.togglePartition
		})
	}

	savePartition = () => {
		let val = this.state.partitionBudget
		if (!isNaN(val) && !isNaN(parseFloat(val))) {
			if (parseInt(val) > 0) {
				//let verification = this.verifyPartition()
				let verification = this.verifyPartition()
				if (verification) {
					let newPartition = new Object()
					newPartition.Name = this.state.partitionName
					newPartition.TotalBudget = parseInt(this.state.partitionBudget)
					newPartition.SpentCash = 0
					newPartition.TotalBudgetPrev = parseInt(this.state.partitionBudget)
					newPartition.TotalBudgetEdit = false
					newPartition.budgetChangeFlag = false
					database().ref("Budget/" + this.state.Id + "/Partitions/" + newPartition.Name).set({
						Name: newPartition.Name,
						TotalBudget: parseInt(newPartition.TotalBudget),
						SpentCash: newPartition.SpentCash
					})
					this.setState(state => {
						let togglePartition = false
						let partitions = state.partitions.concat(newPartition)
						return {
							togglePartition,
							partitions
						}
					})
				}
				else {
					return
				}
			}
			else {
				alert("Pls enter number greater than 0");
			}



		}
		else
			Alert.alert("Valid Number not entered")
	}
	verifyPartition = () => {
		let partitions = this.state.partitions
		let sum = 0
		let totalPartitionSpent = 0;
		partitions.map((item) => {
			//console.log(typeof(item.TotalBudget))
			//console.log(item.TotalBudget + 3000,"something")
			sum += item.TotalBudgetPrev;
			totalPartitionSpent += item.SpentCash;
		})

		if ((this.state.SpentCash - totalPartitionSpent) > 0) {

			sum += this.state.SpentCash - totalPartitionSpent
		}
		//console.log(sum,"Sum",parseInt(this.state.partitionBudget),"partition")
		console.log(typeof (parseInt(this.state.partitionBudget)), "Partition", typeof (sum), "Sum")

		if (parseInt(this.state.partitionBudget) + sum > parseInt(this.state.TotalBudgetPrev)) {
			alert("Can't make a partition of this amount\n The permissible amount is " + (parseInt(this.state.TotalBudgetPrev) - sum))
			return false
		}
		else {
			return true
		}
	}

	showPartition = () => { // edit addition of partition
		if (this.state.togglePartition) {
			return (
				<View style={{ backgroundColor: 'green' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text>Partiton Name</Text>
						<TextInput onChangeText={(input) => { this.setState({ partitionName: input }) }} style={{ width: 50, color: 'red' }} />
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text>Partiton Budget</Text>
						<TextInput onChangeText={(input) => { this.setState({ partitionBudget: input }) }} />
					</View>
					<Button full style={styles.buttonStyle} onPress={() => { this.savePartition() }}>
						<Text style={styles.buttonTextStyle}>Save Changes</Text>
					</Button>

				</View>
			)
		}
	}
	displayPartitions = () => { //partitions here
		if (this.state.partitions.length != 0) {
			let totalPar = this.state.partitions.length



			return (


				<View >
					{

						this.state.partitions.map((item, index) => (
							<Card
								style={{
									backgroundColor: 'green',
									alignSelf: 'center',
									padding: '3%',
									height: 150,
									width: 350,
									borderRadius: 20,
								}}>
								<Grid>
									<Col
										size={3}
										style={{ borderRadius: 20 }}>
										<Body
											style={{
												textAlign: 'left',
												height: 100,
												width: '80%',
												marginTop: 5,
												borderRadius: 20,
											}}>
											{/* <Text style={{alignSelf: 'flex-start', padding: 2}}>Total Budget</Text> */}
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', padding: 2 }}>
												<Text>Total Budget</Text>
												<TextInput editable={item.TotalBudgetEdit} onChangeText={(input) => {
													item.budgetChangeFlag = true
													let found = -1
													this.setState(
														state => {
															let partitions = state.partitions
															partitions[index].TotalBudget = input;
															return {
																partitions
															}
														}
													)
												}
												} value={this.state.partitions[index].TotalBudget.toString()} style={{ color: "black" }} />


											</View>


											{/* <Text style={{alignSelf: 'flex-start', padding: 2}}>Cash left</Text> */}
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', padding: 2 }}>
												<Text>Cash Left</Text>
												<Text>{item.TotalBudget - item.SpentCash}</Text>
											</View>


											{/* <Text style={{alignSelf: 'flex-start', padding: 2}}>Mahesh</Text> */}
											<View style={{ alignSelf: 'flex-start', padding: 2 }}>
												<Text>{item.Name}</Text>
											</View>
										</Body>
									</Col>

									{/* pencil here */}
									<Col size={1}>
										<Body style={{ flexDirection: 'row' }}>
											<TouchableHighlight onPress={() => {
												this.toggleChangeBudget(item, index)
											}} style={{ flexDirection: 'row' }}>
												<Icon name="pencil" size={30} ></Icon>

											</TouchableHighlight>
											{this.showButtonSaveChanges(item, index)}
										</Body>
									</Col>
								</Grid>
							</Card>


						))

					}

				</View>
			)
		}
		else
			return null
	}
	async setPieData() {
		let pieData = [];
		console.log(this.state.partitions);
		if (this.state.partitions.length != 0) {
			let totalPartitionSpent = 0;
			for (let i = 0; i < this.state.partitions.length; ++i) {
				let x = this.state.partitions[i].Name
				let y = this.state.partitions[i].SpentCash;
				let tempObj = new Object();
				tempObj.x = x;
				tempObj.y = y;
				if (y != 0) {
					pieData.push(tempObj)
					totalPartitionSpent += y;
				}

				if (i == this.state.partitions.length - 1) {
					if (this.state.SpentCash - totalPartitionSpent > 0) {
						x = "Main";
						y = this.state.SpentCash - totalPartitionSpent;
						let tempObj = new Object();
						tempObj.x = x;
						tempObj.y = y;
						if (y != 0) {
							pieData.push(tempObj)
						}
					}
				}
			}


		}
		else {
			let temp = new Object()
			temp.x = "Main";
			temp.y = this.state.SpentCash;
			if (temp.y != 0)
				pieData.push(temp);

		}

		this.setState({ graphicData: pieData })


	}

	async setPieTransData() {
		let pieData = [];
		let bois = await database().ref("Transactions/" + this.state.Id).orderByKey().once('value', snap => {
			if (snap != null) {
				snap.forEach(subSnap => {
					let tempKey = subSnap.key;

				})
			}
		})
	}

	async mountTransactions() {
		let key = [];

		let bois = await database().ref("Transactions/" + this.state.Id).orderByKey().once('value', snap => {
			if (snap != null) {
				snap.forEach(subSnap => {
					key.push(subSnap.key)
				})
			}
		})
		if (key.length == 0)
			return
		let noOftransactions = 0;
		let totalTransactions = 20;
		let trans = []
		//console.log(key,"keys")
		for (let i = key.length - 1; i >= 0; --i) {
			let transTemp = []
			/* await database().ref("Transactions/" +this.state.Id + "/" +key[i]).orderByKey().limitToLast(totalTransactions-noOftransactions).once('value',sanp=>{
			
			}) */
			await database().ref("Transactions/" + this.state.Id + "/" + key[i]).orderByKey().limitToLast(totalTransactions - noOftransactions).once('value', snap => {
				snap.forEach(subSnap => {
					if (noOftransactions < totalTransactions) {
						let tempObj = new Object()
						let tempDate = new Date(this.decode(subSnap.key))
						tempObj.itemName = subSnap.val().itemName
						tempObj.itemPartition = subSnap.val().itemPartition
						tempObj.itemPrice = subSnap.val().itemPrice
						tempObj.shopName = subSnap.val().shopName
						tempObj.date = tempDate
						transTemp.push(tempObj)

						++noOftransactions
					}
				})
			})
			let tempArr = []
			transTemp.map((item, index) => {
				tempArr.unshift(item)
			})
			trans = trans.concat(tempArr)

			if (noOftransactions >= totalTransactions)
				break;
		}
		trans.map((item) => {
			//console.log(item.itemName)
		})

		this.setState({ transactions: trans })

	}

	showTransactions = () => {
		if (this.state.transactions.length != 0) {
			//console.log("No transactions done")



			return (

				<View >
					{

						this.state.transactions.map((item, index) => (

							<Card
								style={{
									alignSelf: 'center',
									padding: 20,
									height: 100,
									width: '90%',
									borderRadius: 20,
								}}>
								<View>
									<Grid>
										<Row>
											<Col>
												<Text>{item.itemName}</Text>
											</Col>
											<Col>
												<Text>{item.date.getDate()} - {item.date.getMonth() + 1} - {item.date.getFullYear()}</Text>
											</Col>
										</Row>
										<Col style={{ marginLeft: 280, marginTop: 10 }}>
											<Text>{item.itemPrice}</Text>
										</Col>

										<Row style={{ marginTop: 20 }}>
											<Col>
												<Text>{item.shopName}</Text>
											</Col>
											<Col>
												<Text>{item.itemPartition}</Text>
											</Col>
										</Row>
									</Grid>
								</View>
							</Card>





						))

					}

				</View>
			);

		}

		else {
			//console.log("No transactions done")
			return null;
		}
	}
	decode = (id) => {
		var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
		id = id.substring(0, 8);
		var timestamp = 0;
		for (var i = 0; i < id.length; i++) {
			var c = id.charAt(i);
			timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
		}
		return timestamp;
	}

	checkMount = () => { //first 2 cards here , pie here
		if (this.state.mountedFLag) {
			return (
				<ImageBackground
					style={styles.imgBackground}
					imageStyle={styles.imgBG}
					source={require('../assets/bg.png')}>
					<Image
						source={require('../assets/logo.png')}
						style={styles.logoStyle}
					/>
					<View>
						<Card transparent style={styles.nameCard}>
							<CardItem style={styles.cardItemStyle}>
								<Left>
									<Thumbnail large source={require('../assets/thumbnail.png')} />
									<Body>
										<Text note style={{ color: 'white' }}>
											Welcome Back
						  </Text>
										<Text style={{ color: 'white' }}>Sajal Ganjewala</Text>
									</Body>
								</Left>
							</CardItem>
						</Card>
						<Button full style={styles.buttonStyle} onPress={() => { this.togglePartitionView() }}>
							<Text style={styles.buttonTextStyle}>Add Partition</Text>
						</Button>
						{this.showPartition()}
						<ScrollView>
							<View style={{ height: 10000 }}>
								<Card
									style={{
										alignSelf: 'center',
										padding: 20,
										height: 100,
										width: 350,
										borderRadius: 20,
									}}>
									<Grid>
										<Col>
											<Body
												style={{
													textAlign: 'left',
													padding: 0,
													height: 100,
													width: 300,
													borderRadius: 20,
												}}>
												<Text style={styles.largeText}>BANQ</Text>
												<Text note style={styles.smallText}>
													Spent Today
							</Text>
											</Body>
										</Col>
										<Col>
											<Body>
												<Text style={styles.rightText}>INR {this.state.todaySpentCash}</Text>
											</Body>
										</Col>
									</Grid>
								</Card>

								<Card
									style={{
										alignSelf: 'center',
										padding: 20,
										height: 150,
										width: 350,
										borderRadius: 20,
									}}>

									<Grid>
										<Col>
											<Body
												style={{
													textAlign: 'left',
													padding: 0,
													height: 100,
													width: 300,
													borderRadius: 20,
												}}>
												<Text style={styles.largeText}>Total</Text>

											</Body>

										</Col>

										<Col>
											<Body>
												<Text style={styles.rightText}>INR </Text>
											</Body>
										</Col>
										<Col>
											<Body>
												<TextInput editable={this.state.TotalBudgetEdit} onChangeText={(input) => { this.setState({ TotalBudget: input, budgetChangeFlag: true }); }} value={this.state.TotalBudget.toString()} style={{ color: "black" }} />
											</Body>
										</Col>
										<Col size={1}>
											<Body style={{ flexDirection: 'row' }}>
												<TouchableHighlight onPress={() => {
													this.toggleChangeBudget()
												}} style={{ flexDirection: 'row' }}>
													<Icon name="pencil" size={30} ></Icon>

												</TouchableHighlight>
												{this.showButtonSaveChanges()}
											</Body>
										</Col>
									</Grid>

									<Grid>
										<Col>
											<Body
												style={{
													textAlign: 'left',
													padding: 0,
													height: 100,
													width: 300,
													borderRadius: 20,
												}}>
												<Text style={styles.largeText}>Total Spent Cash</Text>

											</Body>
										</Col>
										<Col>
											<Body>
												<Text style={styles.rightText}>INR {this.state.TotalBudget - this.state.SpentCash}</Text>
											</Body>
										</Col>
									</Grid>

									<Grid style={{ marginTop: 0 }}>
										<Col>
											<Body
												style={{
													textAlign: 'left',
													padding: 0,
													height: 100,
													width: 300,
													borderRadius: 20,
												}}>
												<Text style={styles.smallText}>Days Left</Text>

											</Body>
										</Col>
										<Col>
											<Body>
												<Text style={styles.rightText}>INR {this.state.daysLeft}</Text>
											</Body>
										</Col>
									</Grid>
								</Card>
								{this.displayPartitions()}
								{this.checkDate()}

								{/* pie chart */}
								<Card
									style={{
										alignSelf: 'center',
										padding: 20,
										height: 150,
										width: 350,
										borderRadius: 20,
									}}>
									<Grid>
										<Col
											size={2}
											style={{ backgroundColor: 'red', borderRadius: 20 }}>
											<Body
												style={{
													textAlign: 'left',
													padding: 0,
													height: 100,
													width: 300,
													borderRadius: 20,
												}}>
												<Text style={styles.largeText}>LEGEND</Text>
											</Body>
										</Col>
										<Col size={3}>
											<Body>
												<VictoryPie data={this.state.graphicData} width={150} height={150} colorScale={this.state.graphicColor} innerRadius={50} />
											</Body>
										</Col>
									</Grid>
								</Card>
								{/*  <Card
						style={{
						  alignSelf: 'center',
						  padding: 20,
						  height: 100,
						  width: '90%',
						  borderRadius: 20,
						}}>
						<View>
						  <Grid>
							<Row>
							  <Col>
								<Text>Mathri</Text>
							  </Col>
							  <Col>
								<Text>8-10-12</Text>
							  </Col>
							</Row>
							<Col style={{marginLeft: 300, marginTop: 10}}>
							  <Text>5</Text>
							</Col>
		
							<Row style={{marginTop: 20}}>
							  <Col>
								<Text>Naveen's Tea Stall</Text>
							  </Col>
							  <Col>
								<Text>Mahesh</Text>
							  </Col>
							</Row>
						  </Grid>
						</View>
					  </Card> */}
								{this.showTransactions()}


							</View>
						</ScrollView>
					</View>
				</ImageBackground>
			)
		}

	}
	render() {
		return (
			<ScrollView>
				{this.checkMount()}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	imgBackground: {
		width: '100%',
		height: '100%',
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
	largeText: {
		color: 'black',
		fontFamily: 'Oxygen-Bold',
	},
	smallText: {
		color: 'black',
	},
	rightText: { color: 'black' },
});