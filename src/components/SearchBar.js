import { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

// SearchBar component
// - Provides a text input for searching
// - Debounces calls to onChangeText (250ms delay)
// - Includes a "clear" button when text is present
export default function SearchBar({ value, onChangeText, placeholder = 'Search drinks…' }) {
  // Local input state (kept in sync with prop value)
  const [local, setLocal] = useState(value ?? '');

  // Debounced call to parent onChangeText
  useEffect(() => {
    const t = setTimeout(() => onChangeText?.(local), 250);
    return () => clearTimeout(t);
  }, [local]);

  // Update local state if parent value changes externally
  useEffect(() => setLocal(value ?? ''), [value]);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={local}
        onChangeText={setLocal}
        placeholder={placeholder}
        placeholderTextColor="rgba(36, 61, 92, 0.8)"
        style={styles.input}
      />

      {/* Clear button (only visible if text is entered) */}
      {local?.length ? (
        <Pressable onPress={() => setLocal('')} style={styles.clearBtn} hitSlop={8}>
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer wrapper styling
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // Input field style
  input: { flex: 1, color: colors.text, fontSize: 16 },

  // Clear button container
  clearBtn: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(148,163,184,0.35)',
    marginLeft: 8,
  },

  // Clear button "×" symbol
  clearText: { color: '#0f172a', fontSize: 16, fontWeight: '800', lineHeight: 16 },
});
