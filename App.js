import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Sensors from 'expo-sensors';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <>
      <View style={styles.container}>
        <Camera style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
              <Text style={styles.flipButtonText}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View style={styles.containerTab}>
        <Text style={styles.textSm}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
        <Text style={styles.textSm}>x: {x}</Text>
        <Text style={styles.textSm}>y: {y}</Text>
        <Text style={styles.textSm}>z: {z}</Text>
        <TouchableOpacity
          style={subscription ? styles.buttonActive : styles.buttonInactive}
          onPress={subscription ? _unsubscribe : _subscribe}
        >
          <Text style={styles.buttonText}>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={_slow}>
          <Text style={styles.buttonText}>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={_fast}>
          <Text style={styles.buttonText}>Fast</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    flex: 1,
    margin: 20,
  },
  flipButton: {
    width: 100,
    height: 50,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',  // Center the text inside
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    margin: 5,  // Add some margin
  },
  flipButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  textSm: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',  // Use monospace for better data visualization
  },
  containerTab: {
    height: 200,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,  // Add padding at the top
  },
  buttonActive: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonInactive: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 20,  // Increase the font size
    margin: 20,
    color: '#333',  // Make the text darker for better visibility
  },
});

