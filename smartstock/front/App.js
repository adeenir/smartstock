"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AppNavigator_tsx_1 = require("./src/navigation/AppNavigator.tsx");
var react_native_magnus_1 = require("react-native-magnus");
function App() {
    return (<react_native_magnus_1.ThemeProvider>
            <AppNavigator_tsx_1.default />
        </react_native_magnus_1.ThemeProvider>);
}
exports.default = App;
