import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '../theme/colors';

// ProgressBar component
// Displays a horizontal progress bar with an optional percentage label above it.
// Uses React Native's Animated API for smooth transitions.
export default function ProgressBar({ progress = 0, total = 1, height = 12, showLabel = true }) {
  // Calculate percentage (clamped between 0 and 1)
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;

  // Animated value for smooth width updates
  const anim = useRef(new Animated.Value(0)).current;

  // Animate when progress changes
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 250, useNativeDriver: false }).start();
  }, [pct]);

  // Map animation value (0 → 1) to width ("0%" → "100%")
  const widthInterpolate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.wrap, { height }]}>
      {/* Filled portion of the bar, animated width */}
      <Animated.View style={[styles.fill, { width: widthInterpolate }]} />

      {/* Percentage label above bar (optional) */}
      {showLabel ? (
        <Text style={styles.label}>{Math.round(pct * 100)}%</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer bar container
  wrap: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 999, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },

  // Inner filled bar (animated width)
  fill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },

  // Percentage text shown above the bar
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: -22,
    color: colors.subtext,
    fontSize: 12,
  },
});
