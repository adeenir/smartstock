"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_magnus_1 = require("react-native-magnus");
var globalStyles_1 = require("../styles/globalStyles");
function LogoComponent() {
    return (<react_native_magnus_1.Div alignItems="center" mb="xl">
            <react_native_magnus_1.Image source={require('../assets/images/logo_st.png')} style={globalStyles_1.default.logoSmartStock}/>
        </react_native_magnus_1.Div>);
}
exports.default = LogoComponent;
