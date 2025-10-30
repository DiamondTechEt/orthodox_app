import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Folder } from 'lucide-react-native';
import { useCategories, useFavorites } from '@/hooks/useMezmurs';
import { MezmurCard } from '@/components/MezmurCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { Category, Mezmur } from '@/types/database';
import { mezmurService } from '@/services/mezmurService';

export default function CategoriesScreen() {
  const { user } = useAuth();
  const { categories, loading } = useCategories();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { play, isDownloaded, downloadMezmur, deleteDownload } = useAudio();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryMezmurs, setCategoryMezmurs] = useState<Mezmur[]>([]);
  const [loadingMezmurs, setLoadingMezmurs] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadCategoryMezmurs = async (categoryId: string) => {
    setLoadingMezmurs(true);
    try {
      const mezmurs = await mezmurService.getMezmursByCategory(categoryId);
      setCategoryMezmurs(mezmurs);
    } catch (error) {
      console.error('Error loading category mezmurs:', error);
    } finally {
      setLoadingMezmurs(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    loadCategoryMezmurs(category.id);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCategoryMezmurs([]);
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

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIcon}>
        <Folder size={28} color="#2563eb" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

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

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedCategory.name}</Text>
          {selectedCategory.description && (
            <Text style={styles.subtitle}>{selectedCategory.description}</Text>
          )}
        </View>

        {loadingMezmurs ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <FlatList
            data={categoryMezmurs}
            renderItem={renderMezmur}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No mezmurs in this category</Text>
              </View>
            }
          />
        )}

        <AudioPlayer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse by category</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.categoryList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories available</Text>
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
  backButton: {
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 8,
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
  categoryList: {
    padding: 16,
    paddingBottom: 120,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
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
