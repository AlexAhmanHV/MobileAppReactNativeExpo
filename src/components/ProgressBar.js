import { View, Text, StyleSheet, Animated, useRef, useEffect } from 'react-native';
import colors from '../theme/colors';

export default function ProgressBar({ progress = 0, total = 1, height = 12, showLabel = true }) {
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 250, useNativeDriver: false }).start();
  }, [pct]);

  const widthInterpolate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.wrap, { height }]}>
      <Animated.View style={[styles.fill, { width: widthInterpolate }]} />
      {showLabel ? (
        <Text style={styles.label}>{Math.round(pct * 100)}%</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },
  fill: {
    height: '100%',
    backgroundColor: '#3b82f6', // blue-500
  },
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: -22,
    color: colors.subtext,
    fontSize: 12,
  },
});
