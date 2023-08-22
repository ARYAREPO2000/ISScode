import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar, ImageBackground, Image, Alert, FlatList, Dimensions } from 'react-native';
import axios from 'axios'

export default class MeteorTrackerScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      meteors:{}
    }
  }

  getMeteors=()=>{
    axios.get("https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=76rEvZHX5x2W9oOf24gWXitOa0rgSgdJCGSfnaU8")
  .then((response)=>{
    this.setState({meteors:response.data.near_earth_objects})
    console.log(this.state.meteors)
  }) 
  .catch((error)=>{
    Alert.alert(error.message)
  })  
  }

  renderItem=({item})=>{
    let meteor = item
    let bg_img, speed, size
    if (meteor.threat_score <= 30) {
      bg_img = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed3.gif");
      size=100;
    } else if(meteor.threat_score <= 75){
      bg_img = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed3.gif");
      size=150;
    }
    else{
      bg_img = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed3.gif");
      size=200;
    }

    return (
    <View>
      <ImageBackground source={bg_img} style={styles.backgroundImage} >
        <View style={styles.gifContainer}>
          <Image
            style={{width:size , height:size, alignSelf:'center'}}
            source={speed}
          />
          <View>
            <Text style={[styles.routeText,{marginTop:400, marginLeft:50}]}> {item.name} </Text>
            <Text style={[styles.routeText,{marginTop:20, marginLeft:50}]}> closest to the earth -- {item.close_approach_data[0].close_approach_date_full} </Text>
            <Text style={[styles.routeText,{marginTop:5, marginLeft:50}]}> minimum diameter -- (KM)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
            <Text style={[styles.routeText,{marginTop:5, marginLeft:50}]}> maximum diameter -- (KM)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
            <Text style={[styles.routeText,{marginTop:5, marginLeft:50}]}> velocity -- (KM/hour){item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
            <Text style={[styles.routeText,{marginTop:5, marginLeft:50}]}> missing earth by km -- (km){item.close_approach_data[0].miss_distance.kilometers}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
    )
  }
  keyExtractor = (item,index)=>{index.toString()}

  componentDidMount(){
    this.getMeteors();
  }

    render(){
      if (Object.keys(this.state.meteors).length === 0 ) {
        return(
          <View style={styles.container}>
            <Text>
                Loading....
            </Text>
          </View>
        )
      }
      else{
         let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => { return this.state.meteors[meteor_date] });
         let meteors = [].concat.apply([], meteor_arr);
         meteors.forEach(function (element) {
          let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
          let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
          element.threat_score = threatScore;
        });
        meteors.sort(function(A,B) {
          return B.threat_score-A.threat_score
        })
        meteors = meteors.slice(0,5)

        return (
          <View style={styles.container}>
            <SafeAreaView
            style={styles.droidSafeArea}
            />
            <FlatList
            keyExtractor={this.keyExtractor}
            data = {meteors}
            renderItem = {this.renderItem}
            horizontal = {true}
            />
          </View>
        );
          };
        }
      }
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        droidSafeArea:{
          marginTop:Platform.OS === 'android'? StatusBar.currentHeight:0
        },
        titleBar:{
          flex:0.15,
          justifyContent:'center',
          alignContent:'center',
          alignItems:'center',
          
        },
    
        titleText:{
          fontSize:30,
          fontWeight:'bold',
          color:'white'
        },
        
        routeCard:{
        fontSize:20,
        marginBottom:20,
        color:'white',
          },
    
        routeText:{
         color:'white',
        },
    
        background:{
          flex:1,
          resizeMode:"cover"
        },
    
        knowMore:{
          color:'red',
          paddingLeft:30,
          fontSize:30
        },
    
        Digit:{
          position:'absolute',
          color:"grey",
          fontSize:100,
          right:20,
          bottom:-15,
          zIndex:-1,
        },
    
        iconStyle:{
          position:'absolute',
          height:150,
          width:150,
          resizeMode:'contain',
          right:30,
          bottom:80,
        },
        
        gifContainer:{
          justifyContent:'center',
          alignItems:'center',
          flex:1
        },

        backgroundImage:{
          flex:1,
          resizeMode:'cover',
          width:Dimensions.get('window').width,
          height:Dimensions.get('window').height,
        },
      });
      
      