"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_magnus_1 = require("react-native-magnus");
var fontawesome6_1 = require("@react-native-vector-icons/fontawesome6");
var native_1 = require("@react-navigation/native");
var MENU_SECTIONS = [
    {
        section: 'NOTIFICAÇÕES',
        items: [{ label: 'Notificações', icon: 'bell', screen: 'Notifications' }],
    },
    {
        section: 'MINHA CONTA',
        items: [
            { label: 'Minha conta', icon: 'user', screen: 'MyAccount' },
            { label: 'Alterar senha', icon: 'key', screen: 'Password' },
        ],
    },
    {
        section: 'CENTRAL DE OPÇÕES',
        items: [
            { label: 'Estoque', icon: 'boxes-stacked', screen: 'Stock' },
            { label: 'Cadastro de produtos', icon: 'camera', screen: 'ProductRegister' },
            { label: 'Alertas', icon: 'triangle-exclamation', screen: 'Alerts' },
            { label: 'Receitas', icon: 'book-open', screen: 'Recipes' },
        ],
    },
    {
        section: '',
        items: [{ label: 'Sair', icon: 'arrow-right-from-bracket', screen: 'Index' }],
    },
];
var UserHeader = function (_a) {
    var onSettingsPress = _a.onSettingsPress;
    return (<react_native_magnus_1.Div row alignItems="center" justifyContent="space-between" mb="md" mt="25">
    <react_native_magnus_1.Div>
      <react_native_magnus_1.Text color="white" fontWeight="bold" fontSize="xl">
        Leonardo Fadani
      </react_native_magnus_1.Text>
      <react_native_magnus_1.Text color="white" opacity={0.7} fontSize="sm" mb="10">
        Avenida Brasil, 621 - Palmitos/SC
      </react_native_magnus_1.Text>
    </react_native_magnus_1.Div>
    <react_native_magnus_1.Button bg="transparent" p={0} onPress={onSettingsPress}>
      <fontawesome6_1.default name="gear" size={20} color="white" iconStyle="solid"/>
    </react_native_magnus_1.Button>
  </react_native_magnus_1.Div>);
};
var SearchInput = function (_a) {
    var searchQuery = _a.searchQuery, setSearchQuery = _a.setSearchQuery, inputRef = _a.inputRef;
    return (<react_native_magnus_1.Div row alignItems="center" bg="transparent" rounded="md" px="md" py="sm" mb="md">
    <fontawesome6_1.default name="magnifying-glass" size={14} color="white" iconStyle="solid"/>
    <react_native_1.TextInput ref={inputRef} value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar..." placeholderTextColor="#888" style={styles.searchInput}/>
  </react_native_magnus_1.Div>);
};
var MenuSectionBlock = function (_a) {
    var section = _a.section, items = _a.items, onNavigate = _a.onNavigate;
    return (<react_native_magnus_1.Div bg="#2C3408" rounded={10} p="md" mb="md">
    {section ? (<react_native_magnus_1.Text color="white" fontWeight="bold" fontSize="xs" mb="sm">
        {section}
      </react_native_magnus_1.Text>) : null}
    {items.map(function (item, i) { return (<react_native_magnus_1.Button key={item.label} bg="transparent" row alignItems="center" mb={i < items.length - 1 ? 'sm' : 0} onPress={function () { return onNavigate(item.screen); }}>
        <fontawesome6_1.default name={item.icon} size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }}/>
        <react_native_magnus_1.Text color="white" fontSize="md">
          {item.label}
        </react_native_magnus_1.Text>
      </react_native_magnus_1.Button>); })}
  </react_native_magnus_1.Div>);
};
function SideMenu(_a) {
    var searchQuery = _a.searchQuery, setSearchQuery = _a.setSearchQuery, inputRef = _a.inputRef;
    var navigation = (0, native_1.useNavigation)();
    var handleNavigate = function (screen) { return navigation.navigate(screen); };
    return (<react_native_magnus_1.Div style={styles.container}>
      <react_native_magnus_1.Div p="lg" style={{ flex: 1 }}>
        <UserHeader onSettingsPress={function () { return handleNavigate('Settings'); }}/>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} inputRef={inputRef}/>
        {MENU_SECTIONS.map(function (section, idx) {
            var filteredItems = section.items.filter(function (item) {
                return item.label.toLowerCase().includes(searchQuery.toLowerCase());
            });
            if (!filteredItems.length)
                return null;
            return (<MenuSectionBlock key={section.section || idx} section={section.section} items={filteredItems} onNavigate={handleNavigate}/>);
        })}
      </react_native_magnus_1.Div>
    </react_native_magnus_1.Div>);
}
exports.default = SideMenu;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 260,
        backgroundColor: '#38410B',
        zIndex: 9999,
        height: '100%',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#000',
    },
});
