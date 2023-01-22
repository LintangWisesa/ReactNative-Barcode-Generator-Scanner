import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';
import styles from './../styles/Style'

function Home({ navigation }) {
    return (
    <View style={styles.container}>
        <Button
        title="Generate"
        onPress={() => navigation.navigate('Barcode Generator')}
        icon={{ ...styles.iconButtonHome, name: 'barcode' }}
        iconContainerStyle={styles.iconButtonHomeContainer}
        titleStyle={styles.titleButtonHome}
        buttonStyle={styles.buttonHome}
        containerStyle={styles.buttonHomeContainer}
        />
        <Button
        title="Scanner"
        onPress={() => navigation.navigate('Barcode Scanner')}
        icon={{ ...styles.iconButtonHome, name: 'barcode-scan' }}
        iconContainerStyle={styles.iconButtonHomeContainer}
        titleStyle={styles.titleButtonHome}
        buttonStyle={styles.buttonHome}
        containerStyle={styles.buttonHomeContainer}
        />
    </View>
    );
}

export default Home