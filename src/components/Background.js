// src/components/Background.js
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Background({ children }) {
  return (
    <View style={styles.root}>
      {/* Gradient */}
      <LinearGradient
        colors={['#0f172a', '#083344']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Mojito blobs + citron */}
      <View style={[styles.blob, styles.blobTopLeft]} />
      <View style={[styles.blob, styles.blobBottomRight]} />
      <View style={[styles.blob, styles.blobSmall]} />

      {/* Isbitskänsla */}
      <View style={[styles.ice, styles.ice1]} />
      <View style={[styles.ice, styles.ice2]} />

      {/* Innehåll */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  blob: { position: 'absolute', opacity: 0.22 },
  blobTopLeft: {
    backgroundColor: '#22c55e',
    width: 300, height: 300, borderRadius: 150,
    top: -80, left: -80,
  },
  blobBottomRight: {
    backgroundColor: '#14b8a6',
    width: 340, height: 340, borderRadius: 170,
    bottom: -100, right: -90,
  },
  blobSmall: {
    backgroundColor: '#facc15',
    width: 160, height: 160, borderRadius: 80,
    top: 120, left: -40, opacity: 0.15,
  },

  ice: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(148,163,184,0.25)',
    borderWidth: 1,
    transform: [{ rotate: '12deg' }],
    opacity: 0.6,
  },
  ice1: { width: 90, height: 90, borderRadius: 14, top: 80, right: 30 },
  ice2: { width: 70, height: 70, borderRadius: 12, bottom: 140, left: 30, transform: [{ rotate: '-10deg' }] },
});
