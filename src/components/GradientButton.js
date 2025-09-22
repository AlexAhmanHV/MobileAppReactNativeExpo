import { StyleSheet, Text, Pressable, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton({
  title,
  subtitle,
  colors = ['#22c55e', '#14b8a6'], // 🍃 Mojito som default
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    marginVertical: 12,
    overflow: 'hidden',
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
  inner: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  textBox: { alignItems: 'center' },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },
});
