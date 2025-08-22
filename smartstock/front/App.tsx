import React from 'react';
import AppNavigator from './src/navigation/AppNavigator.tsx';
import {ThemeProvider} from 'react-native-magnus';

function App(): React.JSX.Element {
    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
}

export default App;
