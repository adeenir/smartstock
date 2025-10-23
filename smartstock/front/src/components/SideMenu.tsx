import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Div, Text, Button } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';

type SideMenuProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  inputRef: React.RefObject<TextInput | null>;
};

type FontAwesome6IconName =
  | 'bell'
  | 'user'
  | 'key'
  | 'boxes-stacked'
  | 'camera'
  | 'triangle-exclamation'
  | 'book-open'
  | 'arrow-right-from-bracket';

type MenuItem = {
  label: string;
  icon: FontAwesome6IconName;
  screen: string;
};

type MenuSection = {
  section: string;
  items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
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

const UserHeader = ({ onSettingsPress }: { onSettingsPress?: () => void }) => {
  const {user} = useAuth();
  const name = user?.name || user?.nome || 'Usuário';
  const address = user?.address || user?.endereco || 'Endereço não informado';

  return (
    <Div row alignItems="center" justifyContent="space-between" mb="md" mt="25">
      <Div>
        <Text color="white" fontWeight="bold" fontSize="xl">
          {name}
        </Text>
        <Text color="white" opacity={0.7} fontSize="sm" mb="10">
          {address}
        </Text>
      </Div>
      <Button bg="transparent" p={0} onPress={onSettingsPress}>
        <Icon name="gear" size={20} color="white" iconStyle="solid" />
      </Button>
    </Div>
  );
};

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  inputRef,
}: Pick<SideMenuProps, 'searchQuery' | 'setSearchQuery' | 'inputRef'>) => (
  <Div
    row
    alignItems="center"
    bg="transparent"
    rounded="md"
    px="md"
    py="sm"
    mb="md"
  >
    <Icon name="magnifying-glass" size={14} color="white" iconStyle="solid" />
    <TextInput
      ref={inputRef}
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Buscar..."
      placeholderTextColor="#888"
      style={styles.searchInput}
    />
  </Div>
);

const MenuSectionBlock = ({
  section,
  items,
  onNavigate,
}: {
  section: string;
  items: MenuItem[];
  onNavigate: (screen: string) => void;
}) => (
  <Div bg="#2C3408" rounded={10} p="md" mb="md">
    {section ? (
      <Text color="white" fontWeight="bold" fontSize="xs" mb="sm">
        {section}
      </Text>
    ) : null}
    {items.map((item, i) => (
      <Button
        key={item.label}
        bg="transparent"
        row
        alignItems="center"
        mb={i < items.length - 1 ? 'sm' : 0}
        onPress={() => onNavigate(item.screen)}
      >
        <Icon
          name={item.icon}
          size={18}
          color="white"
          iconStyle="solid"
          style={{ marginRight: 12 }}
        />
        <Text color="white" fontSize="md">
          {item.label}
        </Text>
      </Button>
    ))}
  </Div>
);

export default function SideMenu({
  searchQuery,
  setSearchQuery,
  inputRef,
}: SideMenuProps) {
  const navigation = useNavigation<any>();

  const handleNavigate = (screen: string) => navigation.navigate(screen);

  return (
    <Div style={styles.container}>
      <Div p="lg" style={{ flex: 1 }}>
        <UserHeader onSettingsPress={() => handleNavigate('Settings')} />
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />
        {MENU_SECTIONS.map((section, idx) => {
          const filteredItems = section.items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (!filteredItems.length) return null;
          return (
            <MenuSectionBlock
              key={section.section || idx}
              section={section.section}
              items={filteredItems}
              onNavigate={handleNavigate}
            />
          );
        })}
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
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
