import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import colors from '../theme/colors';
import GradientButton from '../components/GradientButton';
import DrinkCard from '../components/DrinkCard';
import Background from '../components/Background';

// Home screen
// - Lets the user browse all drinks or fetch a random drink
// - Shows a modal DrinkCard overlay when a random drink is loaded
export default function HomeScreen({ navigation }) {
  const [randomDrink, setRandomDrink] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch a random cocktail from TheCocktailDB
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
        {/* App branding */}
        <Text style={styles.logo}>🍹 Drinkify</Text>
        <Text style={styles.subtitle}>Find your next favorite cocktail</Text>

        {/* Navigation buttons */}
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

        {/* Loading indicator while fetching random drink */}
        {loading ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="large" color="#14b8a6" />
            <Text style={styles.loaderText}>Mixing something tasty…</Text>
          </View>
        ) : null}
      </View>

      {/* Overlay details card for a random drink */}
      {randomDrink ? (
        <DrinkCard
          drink={randomDrink}
          onClose={() => setRandomDrink(null)}
        />
      ) : null}

      {/* Light status bar for dark background */}
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

  // Logo/brand
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },

  // Subtitle tagline
  subtitle: {
    color: colors.subtext,
    fontSize: 16,
    marginBottom: 28,
    textAlign: 'center',
  },

  // Loader row shown when fetching a random drink
  loaderRow: { marginTop: 12, alignItems: 'center' },
  loaderText: { marginTop: 8, color: colors.subtext },
});
