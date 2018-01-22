import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Constants } from 'expo';
import {
  Container,
  Header,
  Text,
  Button,
  Content,
  Icon,
  Left,
  Tab,
  Tabs,
  Footer,
  FooterTab,
} from 'native-base';
import styles from './style';
import VehicleList from '../List/List';
import BikeDetail from '../BikeDetail/BikeDetail';
import { getAllBikes, getAllScooters } from '../../api/Api';

const defaultProps = {
  list: ['bikes', 'scooters'],
};

export class Home extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#ffffff',
      borderBottomColor: '#fff',
      shadow: 'none',
    },
  };

  constructor(props) {
    super(props);

    this.renderSelectedTab = this.renderSelectedTab.bind(this);
    this.showDeatil = this.showDeatil.bind(this);
    // this.renderTabs = this.renderTabs.bind(this);

    this.state = {
      selectedTab: 'bikes',
      bikeList: [],
      scooterList: [],
    };
  }

  componentDidMount() {
    getAllBikes((err, data) => {
      if (data) {
        this.setState({
          bikeList: data,
        });
      }
    });
    getAllScooters((err, data) => {
      if (data) {
        this.setState({
          scooterList: data,
        });
      }
    });
  }

  showDeatil(details) {
    this.props.navigation.navigate('BikeDetail', { details });
  }

  renderSelectedTab() {
    switch (this.state.selectedTab) {
      case 'bikes':
        return (<VehicleList
          listToRender={this.state.bikeList}
        // listToRender={() => getAllBikes() || this.state.bikeList}
          selectedType="Bikes"
          onTap={(details) => { this.showDeatil(details); }}
        />);
      case 'scooters':
        return (<VehicleList
          listToRender={this.state.scooterList}
          selectedType="Scooters"
          onTap={(details) => { this.showDeatil(details); }}
        />);
      default:
        return null;
    }
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={{ shadowColor: '#fff' }}>
        <View style={styles.statusBar} />
        <Spinner visible={this.state.bikeList.length === 0} />
        <ScrollView>
          {this.renderSelectedTab()}
        </ScrollView>
        <Footer>
          {Platform.OS === 'iOS' ?
            <FooterTab>
              <Button
                active={this.state.selectedTab === 'bikes'}
                onPress={() => this.setState({ selectedTab: 'bikes' })}
              >
                <MaterialCommunityIcons name="motorbike" size={32} color="#2874F0" />
              </Button>
              <Button
                active={this.state.selectedTab === 'scooters'}
                onPress={() => this.setState({ selectedTab: 'scooters' })}
              >
                <Icon name="camera" />
              </Button>
            </FooterTab>
          : null}
        </Footer>
      </Container>
    );
  }
}

export default StackNavigator({
  Home: {
    screen: Home,
  },
  BikeDetail: {
    screen: BikeDetail,
  },
}, {
  headerMode: 'none',
});

