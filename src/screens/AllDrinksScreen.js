import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../theme/colors';
import Background from '../components/Background';
import GradientButton from '../components/GradientButton';
import SearchBar from '../components/SearchBar';
import DrinkCard from '../components/DrinkCard';
import ProgressBar from '../components/ProgressBar';

// Token set used to query TheCocktailDB by first character (a–z, 0–9)
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DIGITS = '0123456789'.split('');
const TOKENS = [...LETTERS, ...DIGITS];

export default function AllDrinksScreen({ navigation }) {
  // Full dataset & UI state
  const [allDrinks, setAllDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);          // counts finished token fetches (0..36)
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedDrink, setSelectedDrink] = useState(null); // currently opened DrinkCard

  // Fetch all drinks by querying TheCocktailDB for each starting token (a..z, 0..9)
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setAllDrinks([]);
        setProgress(0);

        const results = [];
        let completed = 0;

        // Kick off all requests in parallel; update progress as each completes
        const promises = TOKENS.map(token =>
          fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${token}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP ${res.status} on ${token}`);
              return res.json();
            })
            .then(json => {
              if (json?.drinks?.length) results.push(...json.drinks);
            })
            .catch(() => {}) // ignore individual token failures
            .finally(() => {
              completed += 1;
              if (!cancelled) setProgress(completed); // drive the progress bar
            })
        );

        // Wait for all tokens
        await Promise.all(promises);

        // De-duplicate by idDrink and sort alphabetically
        const unique = Object.values(
          results.reduce((acc, item) => {
            acc[item.idDrink] = item;
            return acc;
          }, {})
        ).sort((a, b) => a.strDrink.localeCompare(b.strDrink));

        if (!cancelled) setAllDrinks(unique);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Could not fetch drinks 😔');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    // Cleanup: stop state updates if component unmounts
    return () => { cancelled = true; };
  }, []);

  // Derived list filtered by search query (name/category/alcoholic)
  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return allDrinks;
    return allDrinks.filter(d =>
      d.strDrink?.toLowerCase().includes(q) ||
      d.strCategory?.toLowerCase().includes(q) ||
      d.strAlcoholic?.toLowerCase().includes(q)
    );
  }, [query, allDrinks]);

  // Renders each drink row; opens DrinkCard on press
  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => setSelectedDrink(item)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      accessibilityLabel={`Open ${item.strDrink}`}
    >
      <Text style={styles.cardText}>🍸 {item.strDrink}</Text>
      {item.strCategory ? <Text style={styles.cardSub}>{item.strCategory}</Text> : null}
    </Pressable>
  );

  return (
    <Background>
      <View style={styles.container}>
        {/* Screen title + search */}
        <Text style={styles.title}>All Drinks</Text>
        <SearchBar value={query} onChangeText={setQuery} />

        {/* Progress while loading, otherwise show counts */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {loading ? (
            <ProgressBar progress={progress} total={TOKENS.length} />
          ) : (
            <Text style={styles.countText}>{`${filtered.length} of ${allDrinks.length}`}</Text>
          )}
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#14b8a6" />
            <Text style={styles.info}>Mixing the list…</Text>
          </View>
        )}

        {/* Error state */}
        {error && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {/* Main list or empty state (only when not loading and no error) */}
        {!loading && !error && (
          filtered.length > 0 ? (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.idDrink}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              initialNumToRender={20}
              windowSize={10}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No results. Try another search.</Text>
            </View>
          )
        )}

        {/* Footer action */}
        <View style={styles.footer}>
          <GradientButton
            title="Back to home"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>

      {/* Modal-like details card when a drink is selected */}
      {selectedDrink ? (
        <DrinkCard
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      ) : null}

      {/* Light status bar to match dark background */}
      <StatusBar style="light" />
    </Background>
  );
}

const styles = StyleSheet.create({
  // Container for content rendered on top of Background
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 28 },

  // Header and counts
  title: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  countText: { color: colors.subtext, textAlign: 'center' },
  listContent: { paddingBottom: 100 },

  // List item card
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },
  cardText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  cardSub: { color: colors.subtext, fontSize: 14, marginTop: 4 },

  // Generic centered blocks (loading / error / empty)
  center: { alignItems: 'center', marginTop: 18 },
  info: { color: colors.subtext, marginTop: 8 },
  error: { color: '#f87171', marginTop: 8, fontWeight: '600' },
  emptyText: { color: colors.subtext, marginTop: 8 },

  // Footer button container
  footer: { alignItems: 'center', marginVertical: 16 },
});
