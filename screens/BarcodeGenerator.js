import React, { useState, useRef, useCallback } from 'react';
import { View, Platform, PermissionsAndroid, Text, Dimensions } from 'react-native';
import { Button, Icon, Input, Dialog } from '@rneui/themed';
import styles from './../styles/Style'
import Barcode from '@kichiyaki/react-native-barcode-generator';
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob'
import ViewShot, {captureRef} from "react-native-view-shot";

function BarcodeGenerator() {

    const [BarValue, setBarValue] = useState('lintangwisesa');
    const [BarImage, setBarImage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setloading] = useState(false);
    const ref = useRef();

    const shareQR = useCallback(() => {
        captureRef(ref, {
            format: "jpg",
            quality: 0.8,
            result: "base64",
        }).then(
            (b64) => {
                const shareImageBase64 = {
                    title: "Barcode",
                    message: "Here is my barcode!",
                    url: `data:image/jpeg;base64,${b64}`
                };
                setBarImage(String(shareImageBase64.url));
                Share.open(shareImageBase64);
            },
            (error) => console.error("Oops, snapshot failed", error)
        );          
    }, []);

    const downloadQR = useCallback(() => {
        setShowDialog(true)
        setloading(true)
        captureRef(ref, {
            format: "jpg",
            quality: 0.8,
            result: "base64",
        }).then(
            async(b64) => {
                const shareImageBase64 = {
                    title: "Barcode",
                    message: "Here is my barcode!",
                    url: `data:image/jpeg;base64,${b64}`
                };
                setBarImage(String(shareImageBase64.url));
                
                if (Platform.OS === 'ios') {
                    saveImage(String(shareImageBase64.url));
                } else {
                    try {
                        const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Permission Required',
                            message: 'App needs access to your storage to download the QR code image',
                        }
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            console.log('Storage Permission Granted');
                            saveImage(String(shareImageBase64.url));
                        } else {
                            console.log('Storage Permission Not Granted');
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            },
            (error) => console.error("Oops, snapshot failed", error)
        );          
    }, [])

    const saveImage = (barcode) => {
        setloading(false)
        barcode = barcode.split('data:image/jpeg;base64,')[1]
        
        let date = new Date();
        const { fs } = RNFetchBlob;
        let filename = '/barcode_' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.jpeg';
        let PictureDir = fs.dirs.DownloadDir + filename;

        fs.writeFile(PictureDir, barcode, 'base64')
        .then(() => {
            RNFetchBlob.android.addCompleteDownload({
                title: '🎁 Here is your barcode!',
                useDownloadManager: true,
                showNotification: true,
                notification: true,
                path: PictureDir,
                mime: 'image/jpeg',
                description: 'Image',
            });
        })
        .catch((err) => {console.log('ERR: ', err)})
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Type your text here...'
                onChangeText={ val => {setBarValue(val)}}
                leftIcon={
                <Icon
                    name='barcode'
                    type='ionicon'
                    size={24}
                    color='#0C8E4E'
                />
                }
            />
            <ViewShot ref={ref}>
                <Barcode
                    format="CODE128"
                    value={BarValue ? BarValue : 'lintangwisesa'}
                    text={BarValue ? BarValue : 'lintangwisesa'}
                    style={{ marginBottom: 20 }}
                    textStyle={{ color:'#000' }}
                    maxWidth={Dimensions.get('window').width / 1.5}
                />
            </ViewShot>
            <Button
                title="Share QR"
                icon={{ ...styles.iconButtonHome, size: 20, name: 'share' }}
                iconContainerStyle={styles.iconButtonHomeContainer}
                titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
                buttonStyle={{...styles.buttonHome, height: 50}}
                containerStyle={{...styles.buttonHomeContainer, marginTop:20, marginBottom:10}}
                onPress={shareQR}
            />
            <Button
                title="Download"
                icon={{ ...styles.iconButtonHome, size: 20, name: 'file-download' }}
                iconContainerStyle={styles.iconButtonHomeContainer}
                titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
                buttonStyle={{...styles.buttonHome, height: 50}}
                containerStyle={{...styles.buttonHomeContainer, marginTop:10, marginBottom:10}}
                onPress={downloadQR}
            />
            <Dialog
            isVisible={showDialog}
            onBackdropPress={() => setShowDialog(!showDialog)}
            >
                {
                    loading
                    ?
                    <Dialog.Loading />
                    :
                    <>
                    <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Download QR"/>
                    <Text style={{color:'#000', fontSize: 18}}>
                        Your barcode has been downloaded successfully. Check it on your <Text style={{fontWeight:'bold'}}>Downloads</Text> folder.
                    </Text>
                    </>
                }
            </Dialog>
        </View>
    );
}

export default BarcodeGenerator