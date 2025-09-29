import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Component that provides a styled background for the app.
// Child components are rendered on top of everything.
export default function Background({ children }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0f172a', '#083344']} // start and end colors of the gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} 
        style={StyleSheet.absoluteFill}
      />

      {/* Blobs for decoration */}
      <View style={[styles.blob, styles.blobTopLeft]} />    
      <View style={[styles.blob, styles.blobBottomRight]} /> 
      <View style={[styles.blob, styles.blobSmall]} />     

      {/* Light semi-transparent squares for "ice cube" effect */}
      <View style={[styles.ice, styles.ice1]} /> 
      <View style={[styles.ice, styles.ice2]} />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Base style for blobs
  blob: { position: 'absolute', opacity: 0.22 },

  // Green blob
  blobTopLeft: {
    backgroundColor: '#22c55e',
    width: 300, height: 300, borderRadius: 150, // circular shape
    top: -80, left: -80, // partially off-screen
  },

  // Teal blob
  blobBottomRight: {
    backgroundColor: '#14b8a6',
    width: 340, height: 340, borderRadius: 170,
    bottom: -100, right: -90,
  },

  // Smaller yellow blob
  blobSmall: {
    backgroundColor: '#facc15',
    width: 160, height: 160, borderRadius: 80,
    top: 120, left: -40,
    opacity: 0.15, // extra transparent
  },

  // Base style for "ice cubes"
  ice: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)', // semi-transparent white
    borderColor: 'rgba(148,163,184,0.25)',     // light border
    borderWidth: 1,
    transform: [{ rotate: '12deg' }], // slight tilt for visual interest
    opacity: 0.6,
  },

  // First ice cube
  ice1: { 
    width: 90, height: 90, borderRadius: 14,
    top: 80, right: 30,
  },

  // Second ice cube
  ice2: { 
    width: 70, height: 70, borderRadius: 12,
    bottom: 140, left: 30,
    transform: [{ rotate: '-10deg' }],
  },
});
