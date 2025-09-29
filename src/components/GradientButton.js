import { StyleSheet, Text, Pressable, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// A reusable button component with a gradient background.
// Supports a title (required), optional subtitle, and custom gradient colors.
// Defaults to mojito-inspired green/teal if no colors are passed.
export default function GradientButton({
  title,
  subtitle,
  colors = ['#22c55e', '#14b8a6'], // default gradient
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      {/* The gradient background */}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        {/* and the button text container */}
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Outer button wrapper with rounded corners + platform shadows
  wrapper: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    marginVertical: 12,
    overflow: 'hidden', // ensures gradient respects rounded corners
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },

  // Inner gradient container
  inner: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pressed state: slight scale down + lower opacity
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  // Text container (keeps title/subtitle centered)
  textBox: { alignItems: 'center' },

  // Main title text
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // Optional subtitle text
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },
});
