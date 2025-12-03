"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var fontawesome6_1 = require("@react-native-vector-icons/fontawesome6");
var native_1 = require("@react-navigation/native");
function BottomNavBar(_a) {
    var _b = _a.onlyHome, onlyHome = _b === void 0 ? false : _b;
    var navigation = (0, native_1.useNavigation)();
    return (<react_native_1.View style={styles.bottomBar}>
      <react_native_1.TouchableOpacity style={styles.iconButton} onPress={function () { return navigation.navigate('Home'); }}>
        <fontawesome6_1.default name="house" size={24} color="white" iconStyle="solid"/>
      </react_native_1.TouchableOpacity>
      {!onlyHome && (<>
          <react_native_1.TouchableOpacity style={styles.iconButton} onPress={function () { return navigation.navigate('ProductCodeInput'); }}>
            <fontawesome6_1.default name="camera" size={24} color="white" iconStyle="solid"/>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.iconButton} onPress={function () { return navigation.navigate('Notifications'); }}>
            <fontawesome6_1.default name="bell" size={24} color="white" iconStyle="solid"/>
          </react_native_1.TouchableOpacity>
        </>)}
    </react_native_1.View>);
}
exports.default = BottomNavBar;
var styles = react_native_1.StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        backgroundColor: '#A6B48A',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 0,
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
});
