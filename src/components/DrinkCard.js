import { StyleSheet, View, Text, Image, Pressable, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // 👈 lägg till
import colors from '../theme/colors';

export default function DrinkCard({ drink, onClose }) {
  if (!drink) return null;

  // Plocka ut ingredienser + mått från TheCocktailDB-formatet
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ing = drink[`strIngredient${i}`];
    const meas = drink[`strMeasure${i}`];
    if (ing) ingredients.push(meas ? `${meas?.trim?.() || ''} ${ing.trim()}`.trim() : ing.trim());
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{drink.strDrink}</Text>

          <Pressable onPress={onClose} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.iconText}>✕</Text>
          </Pressable>
        </View>

        {drink.strDrinkThumb ? (
          <Image source={{ uri: drink.strDrinkThumb }} style={styles.thumb} resizeMode="cover" />
        ) : null}

        <Text style={styles.meta}>
          {drink.strAlcoholic || ''}{drink.strCategory ? ` • ${drink.strCategory}` : ''}
        </Text>

        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 12 }}>
          <Text style={styles.section}>Ingredients</Text>
          {ingredients.length ? (
            ingredients.map((row, idx) => (
              <Text key={idx} style={styles.item}>• {row}</Text>
            ))
          ) : (
            <Text style={styles.item}>No ingredients found.</Text>
          )}

          {drink.strInstructions ? (
            <>
              <Text style={[styles.section, { marginTop: 14 }]}>Instructions</Text>
              <Text style={styles.instructions}>{drink.strInstructions}</Text>
            </>
          ) : null}
        </ScrollView>

        {/* Close-knappen i Mojito-färger */}
        <View style={styles.actionsSingle}>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.btnWrap, pressed && styles.pressed]}>
            <LinearGradient
              colors={['#22c55e', '#14b8a6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>Close</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(2,6,23,0.55)',
    padding: 18,
  },
  card: {
    width: '100%', maxWidth: 520,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(148,163,184,0.25)',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 8 },
    }),
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', flex: 1, paddingRight: 8 },
  iconBtn: {
    backgroundColor: 'rgba(148,163,184,0.15)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(148,163,184,0.25)'
  },
  iconText: { color: colors.text, fontSize: 16, fontWeight: '800' },

  thumb: { width: '100%', height: 220, marginTop: 12 },
  meta: { color: colors.subtext, paddingHorizontal: 16, paddingTop: 10 },

  scroll: { maxHeight: 260, paddingHorizontal: 16, marginTop: 8 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  item: { color: colors.text, opacity: 0.9, marginBottom: 4 },
  instructions: { color: colors.text, opacity: 0.9, lineHeight: 20 },

  actionsSingle: { padding: 16, alignItems: 'center' },
  btnWrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  btnInner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },

  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
});
