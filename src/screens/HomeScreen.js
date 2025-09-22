import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import colors from '../theme/colors';
import GradientButton from '../components/GradientButton';
import DrinkCard from '../components/DrinkCard';
import Background from '../components/Background'; // 👈 importera vår nya bakgrund

export default function HomeScreen({ navigation }) {
  const [randomDrink, setRandomDrink] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandom = useCallback(async () => {
    try {
      setLoading(true);
      setRandomDrink(null);
      const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const drink = json?.drinks?.[0];
      if (!drink) throw new Error('No drink returned');
      setRandomDrink(drink);
    } catch (e) {
      console.error(e);
      Alert.alert('Oops', 'Failed to fetch a random drink. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.logo}>🍹 Drinkify</Text>
        <Text style={styles.subtitle}>Find your next favorite cocktail</Text>

        <GradientButton
          title="Show all drinks"
          subtitle="Browse the full list"
          onPress={() => navigation?.navigate?.('AllDrinks')}
        />

        <GradientButton
          title="Show a random drink"
          subtitle="Surprise me!"
          onPress={fetchRandom}
        />

        {loading ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="large" color="#14b8a6" />
            <Text style={styles.loaderText}>Mixing something tasty…</Text>
          </View>
        ) : null}
      </View>

      {/* Overlay-kortet */}
      {randomDrink ? (
        <DrinkCard
          drink={randomDrink}
          onClose={() => setRandomDrink(null)}
        />
      ) : null}

      <StatusBar style="light" />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: { color: colors.subtext, fontSize: 16, marginBottom: 28, textAlign: 'center' },
  loaderRow: { marginTop: 12, alignItems: 'center' },
  loaderText: { marginTop: 8, color: colors.subtext },
});
