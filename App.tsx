import React, {useState, createContext, useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalenderAgenda from './Components/Calenders/CalenderAgenda';
import { AgendaSchedule } from 'react-native-calendars';
import FirestoreService from './Components/Firestore/FirestoreService';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


interface AppContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  globalEvents: AgendaSchedule;
  setGlobalEvents: (value: AgendaSchedule) => void;
}

export const AppContext = createContext<AppContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  globalEvents: {},
  setGlobalEvents: () => {},
});

const StudyGroupScreen = React.memo(() => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Study Group Screen</Text>
  </View>
));

const ScheduleScreen = React.memo(() => (
  <CalenderAgenda rootCollection='Events' eventDocs="PersonalEvents" eventCollection="useremail@ucsd.edu" />
));

const EventsScreen = React.memo(() => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Events Screen</Text>
  </View>
));

const Tab = createBottomTabNavigator();
function BottomTabs() {
  return (
    <Tab.Navigator
      detachInactiveScreens={true} 
      initialRouteName='Schedule'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap: { [key: string]: string } = {
            'Study Group': 'people-outline',
            Schedule: 'calendar-outline',
            Events: 'today-outline',
          };
          const iconName = iconMap[route.name] || 'help-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Study Group" component={StudyGroupScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [globalEvents, setGlobalEvents] = useState<AgendaSchedule>({});
  
  useEffect(() => {
    FirestoreService.fetchGlobalEvents();
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, globalEvents,setGlobalEvents }}>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="bottomTab" component={BottomTabs} />
      </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
    
  );
  
}
