import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import styles from './styles'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3BBF45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  textDanger: {
    color: '#f00',
    fontstyle: 'bold',
    fontSize: '50px',
  },
  textNormal: {
    color: '#fff',
    fontstyle: 'bold',
    fontSize: '50px',
  },
});

class Count extends React.Component {
  format(time) {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;

    let ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  render() {
    return (
      <View>
        <Text style={this.getStyle()}>{this.format(this.props.count)}</Text>
      </View>
    )
  }

  getStyle() {
    if (this.props.count < 20) {
      return styles.textDanger
    }
    return styles.textNormal
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      count: 30,
      started: false,
      title: "Start",
      pause: false,
      alert: "Le temps est écoulé !",
      isEnd: false,
    }
  }

  startCount = () => {
    if (!this.state.started) {
      this.interval = setInterval(this.inc, 1000);
      this.state.started = true;
      this.state.title = "Working";
    } else {
      if (!this.state.pause) {
        this.setState(prevState => ({ title: "Paused" }))
      } else {
        this.setState(prevState => ({ title: "Working" }))
      }
      this.state.pause = !this.state.pause;
      this.setState(prevState => ({ isEnd: false }));
    }
  }

  resetCount = () => {
    if (this.state.started) {
      this.setState(prevState => ({ title: "Start" }))
      this.setState(prevState => ({ count: 30 }))
      this.state.pause = true
      this.setState(prevState => ({ isEnd: false }));
    }
  }

  removeTime = (time) => {
    if (this.state.count - time > 0) {
      this.setState(prevState => ({ count: prevState.count - time }))
    }
  }

  addTime = (time) => {
    this.setState(prevState => ({ count: prevState.count + time }))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUnmount() { clearInterval(this.interval) }

  inc = () => {
    if (!this.state.pause) {
      if (this.state.count > 0) {
        this.setState(prevState => ({ count: prevState.count - 1 }))
      } else {
        this.setState(prevState => ({ title: "Start" }))
        this.setState(prevState => ({ count: 30 }))
        this.state.pause = !this.state.pause
        this.setState(prevState => ({ isEnd: true }));
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize:'50px', color:'#476ECC' }}>Pomodoro</Text>
        <View style={styles.view}>
          <Button onPress={() => this.removeTime(60)} title={"-1 min"}></Button>
          <Button onPress={() => this.removeTime(30)} title={"-30 sec"}></Button>
          <Button onPress={() => this.addTime(30)} title={"+30 sec"}></Button>
          <Button onPress={() => this.addTime(60)} title={"+1 min"}></Button>
        </View>
        <View style={styles.view} style={{borderWidth:  3, borderRadius: '10px', borderColor:'#476ECC'}}>
          <Count count={this.state.count} main={this} />
        </View>
        <View style={styles.view}>
          <Button onPress={this.startCount} title={this.state.title} />
          <Button onPress={this.resetCount} title={"Reset"} />
        </View>
        <Text style={styles.textDanger}>{this.state.isEnd ? this.state.alert : ""}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}