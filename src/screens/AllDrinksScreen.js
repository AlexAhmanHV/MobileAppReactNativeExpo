import { useEffect, useMemo, useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Pressable, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import Background from '../components/Background';       // 👈 NYTT
import GradientButton from '../components/GradientButton';
import SearchBar from '../components/SearchBar';
import DrinkCard from '../components/DrinkCard';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DIGITS = '0123456789'.split('');
const TOKENS = [...LETTERS, ...DIGITS]; // 36

function ProgressBar({ progress = 0, total = 1, height = 12, showLabel = true }) {
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 220, useNativeDriver: false }).start();
  }, [pct]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.pbWrap, { height }]}>
      <Animated.View style={[styles.pbFillWrap, { width }]}>
        <LinearGradient
          colors={['#22c55e', '#14b8a6']} // Mojito
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pbFill}
        />
      </Animated.View>
      {showLabel ? <Text style={styles.pbLabel}>{`${Math.round(pct * 100)}%`}</Text> : null}
    </View>
  );
}

export default function AllDrinksScreen({ navigation }) {
  const [allDrinks, setAllDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedDrink, setSelectedDrink] = useState(null);

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

        const promises = TOKENS.map(token =>
          fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${token}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP ${res.status} on ${token}`);
              return res.json();
            })
            .then(json => {
              if (json?.drinks?.length) results.push(...json.drinks);
            })
            .catch(() => {})
            .finally(() => {
              completed += 1;
              if (!cancelled) setProgress(completed);
            })
        );

        await Promise.all(promises);

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
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return allDrinks;
    return allDrinks.filter(d =>
      d.strDrink?.toLowerCase().includes(q) ||
      d.strCategory?.toLowerCase().includes(q) ||
      d.strAlcoholic?.toLowerCase().includes(q)
    );
  }, [query, allDrinks]);

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
        <Text style={styles.title}>All Drinks</Text>
        <SearchBar value={query} onChangeText={setQuery} />

        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {loading ? (
            <ProgressBar progress={progress} total={TOKENS.length} />
          ) : (
            <Text style={styles.countText}>{`${filtered.length} of ${allDrinks.length}`}</Text>
          )}
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#14b8a6" />
            <Text style={styles.info}>Mixing the list…</Text>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

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

        <View style={styles.footer}>
          <GradientButton
            title="Back to home"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>

      {selectedDrink ? (
        <DrinkCard
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      ) : null}

      <StatusBar style="light" />
    </Background>
  );
}

const styles = StyleSheet.create({
  // container för innehållet ovanpå Background
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 28 },

  title: { color: colors.text, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  countText: { color: colors.subtext, textAlign: 'center' },
  listContent: { paddingBottom: 100 },

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

  center: { alignItems: 'center', marginTop: 18 },
  info: { color: colors.subtext, marginTop: 8 },
  error: { color: '#f87171', marginTop: 8, fontWeight: '600' },
  emptyText: { color: colors.subtext, marginTop: 8 },

  footer: { alignItems: 'center', marginVertical: 16 },

  // ProgressBar
  pbWrap: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },
  pbFillWrap: { height: '100%' },
  pbFill: { height: '100%' },
  pbLabel: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: -22,
    color: colors.subtext,
    fontSize: 12,
  },
});
