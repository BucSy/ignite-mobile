import React from 'react';
import { Component } from 'react';
import {Platform, Text, View, TextInput, Button} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../logic/saga/app/appActions';
import { IApp } from '../../logic/redux/app/appReducer'
import { IStore } from '../../logic/IStore';
import { getLocale } from '../../logic/redux/app/appSelector';
import styles from './styles';
import { NavigationInjectedProps } from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type IdispatchProps = {
  next: (payload: string) => void;
  textBasic: () => void;
}

type Props = IdispatchProps & {
  app: IApp;
};

class App extends Component<Props & NavigationInjectedProps> {
  constructor(props: Props & NavigationInjectedProps) {
    super(props);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
  }

  onButtonPress() {
    this.props.textBasic();
  }

  onTextInputChange(text: any) {
    this.props.next(text);
  }

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>Hi</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <TextInput placeholder={"hi"} value={this.props.app.textFromInputBox} onChangeText={this.onTextInputChange}/>
        <Button title="TEXT_TO_BASICTEXT" onPress={this.onButtonPress} />
      </View>
    );
  }
}

const mapStateToProps = (state: IStore, props: Props) => {
  return {
    app: state.app,
    ...props
  }
};

const mapDispatchToProps = (dispatch: any): IdispatchProps => {
  return bindActionCreators({
    next: actions.textInputBox,
    textBasic: actions.textToBasictext,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);