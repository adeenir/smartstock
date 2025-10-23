import React from 'react';
import AppNavigator from './src/navigation/AppNavigator.tsx';
import {ThemeProvider} from 'react-native-magnus';
import {AuthProvider} from './src/context/AuthContext';

function App(): React.JSX.Element {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppNavigator />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
