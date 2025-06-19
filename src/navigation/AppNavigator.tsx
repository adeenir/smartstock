import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens/IndexScreen.tsx';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.tsx';
import RegisterScreen from '../screens/RegisterScreen.tsx';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StockScreen from '../screens/StockScreen';
import ProductRegisterScreen from '../screens/ProductRegisterScreen';
import ProductCodeInputScreen from '../screens/ProductCodeInputScreen';
import AlertsScreen from '../screens/AlertsScreen';
import RecipesScreen from '../screens/RecipesScreen';
import MyAccountScreen from '../screens/MyAccountScreen.tsx';
import PasswordScreen from '../screens/PasswordScreen.tsx';

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
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Stock" component={StockScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="ProductRegister" component={ProductRegisterScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="ProductCodeInput" component={ProductCodeInputScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Alerts" component={AlertsScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Recipes" component={RecipesScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Password" component={PasswordScreen} options={{ headerShown: false }}  />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
