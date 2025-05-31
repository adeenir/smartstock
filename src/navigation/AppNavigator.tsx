import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens/IndexScreen.tsx';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.tsx';
import RegisterScreen from '../screens/RegisterScreen.tsx';

const Stack = createNativeStackNavigator();
export const navigationRef = React.createRef<any>();
export function navigate(name: string, params?: object) {
    navigationRef.current?.navigate(name, params);
}

export default function AppNavigator()
{
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen name="Index" component={IndexScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}  />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
