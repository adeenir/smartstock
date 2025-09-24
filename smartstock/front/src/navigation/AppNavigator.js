"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigate = exports.navigationRef = void 0;
var react_1 = require("react");
var native_1 = require("@react-navigation/native");
var native_stack_1 = require("@react-navigation/native-stack");
var IndexScreen_tsx_1 = require("../screens/IndexScreen.tsx");
var ForgotPasswordScreen_tsx_1 = require("../screens/ForgotPasswordScreen.tsx");
var RegisterScreen_tsx_1 = require("../screens/RegisterScreen.tsx");
var HomeScreen_1 = require("../screens/HomeScreen");
var NotificationsScreen_1 = require("../screens/NotificationsScreen");
var StockScreen_1 = require("../screens/StockScreen");
var ProductRegisterScreen_1 = require("../screens/ProductRegisterScreen");
var ProductCodeInputScreen_1 = require("../screens/ProductCodeInputScreen");
var AlertsScreen_1 = require("../screens/AlertsScreen");
var RecipesScreen_1 = require("../screens/RecipesScreen");
var MyAccountScreen_tsx_1 = require("../screens/MyAccountScreen.tsx");
var PasswordScreen_tsx_1 = require("../screens/PasswordScreen.tsx");
var SettingsScreen_tsx_1 = require("../screens/SettingsScreen.tsx");
var Stack = (0, native_stack_1.createNativeStackNavigator)();
exports.navigationRef = react_1.default.createRef();
function navigate(name, params) {
    var _a;
    (_a = exports.navigationRef.current) === null || _a === void 0 ? void 0 : _a.navigate(name, params);
}
exports.navigate = navigate;
function AppNavigator() {
    return (<native_1.NavigationContainer ref={exports.navigationRef}>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen name="Index" component={IndexScreen_tsx_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen_tsx_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={RegisterScreen_tsx_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Home" component={HomeScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Notifications" component={NotificationsScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Stock" component={StockScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="ProductRegister" component={ProductRegisterScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="ProductCodeInput" component={ProductCodeInputScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Alerts" component={AlertsScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Recipes" component={RecipesScreen_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="MyAccount" component={MyAccountScreen_tsx_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Password" component={PasswordScreen_tsx_1.default} options={{ headerShown: false }}/>
                <Stack.Screen name="Settings" component={SettingsScreen_tsx_1.default} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </native_1.NavigationContainer>);
}
exports.default = AppNavigator;
