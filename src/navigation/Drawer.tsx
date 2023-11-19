import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppTabs } from './AppTabs';
import {
  EventScreen,
  AIScreen,
  EventOrganizerScreen,
  PaymentScreen,
  DistancePropertiesScreen,
  HomeScreen,
  ContactScreen,
  ClientScreen,
} from '../screens';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { Colors } from '../config';
import { BusinessCard } from '../components';

const Drawer = createDrawerNavigator();

export const MyDrawer = ({ navigation, ...restProps }) => {
  const [openBusinessCard, setOpenBusinessCard] = useState<boolean>(false);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerRight: () => (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => setOpenBusinessCard(true)} style={{ marginRight: 32 }}>
              <Icon
                as={MaterialCommunityIcons}
                name="qrcode"
                size="2xl"
                marginLeft="16px"
                color={Colors.black}
                borderWidth={1}
                alignItems="center"
              />
              <BusinessCard
                openBusinessCard={openBusinessCard}
                setOpenBusinessCard={setOpenBusinessCard}
                {...restProps}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Chat');
              }}
            >
              <Icon
                as={MaterialCommunityIcons}
                name="inbox"
                size="2xl"
                style={{ marginRight: 16 }}
                color={Colors.color2}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={AppTabs}
        initialParams={{
          user: restProps.route?.params?.currentUser || null,
        }}
      />
      <Drawer.Screen name="DealHub" component={ClientScreen} />
      <Drawer.Screen name="MarketView Pro" component={HomeScreen} />
      <Drawer.Screen name="Agent Showings" component={DistancePropertiesScreen} />
      <Drawer.Screen name="Contacts" component={ContactScreen} />
      {/*<Drawer.Screen name="Payment Method" component={PaymentScreen} />*/}
    </Drawer.Navigator>
  );
};
