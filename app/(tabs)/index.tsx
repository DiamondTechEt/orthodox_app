import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useMezmurs, useFavorites, useSearch } from '@/hooks/useMezmurs';
import { MezmurCard } from '@/components/MezmurCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { Mezmur } from '@/types/database';

export default function HomeScreen() {
  const { user } = useAuth();
  const { mezmurs, loading, refresh } = useMezmurs();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { play, isDownloaded, downloadMezmur, deleteDownload, downloadProgress } = useAudio();
  const { query, results, loading: searching, search } = useSearch();
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const displayMezmurs = query ? results : mezmurs;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDownload = async (mezmur: Mezmur) => {
    if (!user) return;

    try {
      setDownloadingId(mezmur.id);
      const downloaded = await isDownloaded(mezmur.id);

      if (downloaded) {
        await deleteDownload(mezmur.id);
      } else {
        await downloadMezmur(mezmur);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderMezmur = ({ item }: { item: Mezmur }) => {
    const [downloaded, setDownloaded] = React.useState(false);

    React.useEffect(() => {
      isDownloaded(item.id).then(setDownloaded);
    }, [item.id, downloadingId]);

    return (
      <MezmurCard
        mezmur={item}
        onPress={() => play(item)}
        onFavorite={user ? () => toggleFavorite(item.id) : undefined}
        onDownload={user ? () => handleDownload(item) : undefined}
        isFavorite={user ? isFavorite(item.id) : false}
        isDownloaded={downloaded}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mezmur</Text>
        <Text style={styles.subtitle}>Ethiopian Orthodox Songs</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mezmurs..."
          value={query}
          onChangeText={search}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={displayMezmurs}
          renderItem={renderMezmur}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {query ? 'No mezmurs found' : 'No mezmurs available'}
              </Text>
            </View>
          }
        />
      )}

      <AudioPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
