import React, { useState, useRef } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import styles from './../styles/Style'
import { RNCamera } from 'react-native-camera';

function BarcodeScan({ navigation }) {

    const [barValue, setBarValue] = useState('')
    const [barType, setBarType] = useState('')
    const [flash, setFlash] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    return (
    <View style={styles.container}>
        <RNCamera
            ref={ref => {this.camera = ref;}}
            captureAudio={false}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            defaultTouchToFocus
            flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            mirrorImage={false}
            // onBarCodeRead={readBarcode}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
                console.log(barcodes, barcodes.length)
                if (barcodes.length > 0){
                    setBarValue(barcodes[0].data)
                    setBarType(barcodes[0].format)
                    setShowDialog(true)
                }
            }}
            style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
            }}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
        <Button
            title={`Flash ${flash ? 'OFF' : 'ON'}`}
            onPress={() => setFlash(!flash)}
            icon={{ ...styles.iconButtonHome, size:25, name: 'flash' }}
            iconContainerStyle={styles.iconButtonHomeContainer}
            titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
            buttonStyle={{...styles.buttonHome, height: 50}}
            containerStyle={{...styles.buttonHomeContainer, marginTop:20, marginBottom:10}}
        />
        <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Scanned Barcode:"/>
            <Text style={{color:'#000', fontSize: 20}}>
                {`Data: ${barValue}\nFormat: ${barType}`}
            </Text>
            <Dialog.Actions>
                <Dialog.Button title="Scan Again" onPress={() => {
                    setShowDialog(false)
                }}/>
            </Dialog.Actions>
        </Dialog>
    </View>
    );
}

export default BarcodeScan