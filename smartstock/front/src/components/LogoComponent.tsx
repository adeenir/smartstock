import {Div, Image} from "react-native-magnus";
import globalStyles from "../styles/globalStyles";

export default function LogoComponent()
{
    return (
        <Div alignItems="center" mb="xl">
            <Image source={require('../assets/images/logo_st.png')} style={globalStyles.logoSmartStock} />
        </Div>
    );
}
