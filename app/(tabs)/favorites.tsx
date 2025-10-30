import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useFavorites } from '@/hooks/useMezmurs';
import { MezmurCard } from '@/components/MezmurCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { Mezmur, Favorite } from '@/types/database';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const { favorites, loading, refresh, toggleFavorite, isFavorite } = useFavorites();
  const { play, isDownloaded, downloadMezmur, deleteDownload } = useAudio();
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  const renderFavorite = ({ item }: { item: Favorite }) => {
    const [downloaded, setDownloaded] = React.useState(false);

    React.useEffect(() => {
      if (item.mezmur) {
        isDownloaded(item.mezmur.id).then(setDownloaded);
      }
    }, [item.mezmur?.id, downloadingId]);

    if (!item.mezmur) return null;

    return (
      <MezmurCard
        mezmur={item.mezmur}
        onPress={() => play(item.mezmur!)}
        onFavorite={() => toggleFavorite(item.mezmur!.id)}
        onDownload={user ? () => handleDownload(item.mezmur!) : undefined}
        isFavorite={isFavorite(item.mezmur.id)}
        isDownloaded={downloaded}
      />
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Heart size={64} color="#e5e7eb" />
          <Text style={styles.emptyTitle}>Sign in to save favorites</Text>
          <Text style={styles.emptyText}>Create an account to start saving your favorite mezmurs</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>{favorites.length} mezmurs saved</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart size={64} color="#e5e7eb" />
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyText}>
                Start adding mezmurs to your favorites by tapping the heart icon
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
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
