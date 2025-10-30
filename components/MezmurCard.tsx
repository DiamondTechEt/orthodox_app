import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Play, Heart, Download } from 'lucide-react-native';
import { Mezmur } from '@/types/database';

interface MezmurCardProps {
  mezmur: Mezmur;
  onPress: () => void;
  onFavorite?: () => void;
  onDownload?: () => void;
  isFavorite?: boolean;
  isDownloaded?: boolean;
}

export function MezmurCard({
  mezmur,
  onPress,
  onFavorite,
  onDownload,
  isFavorite = false,
  isDownloaded = false,
}: MezmurCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{
          uri: mezmur.image_url || 'https://images.pexels.com/photos/210804/pexels-photo-210804.jpeg',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {mezmur.title}
        </Text>
        {mezmur.artist && (
          <Text style={styles.artist} numberOfLines={1}>
            {mezmur.artist}
          </Text>
        )}
        {mezmur.category && (
          <Text style={styles.category} numberOfLines={1}>
            {mezmur.category.name}
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Play size={20} color="#2563eb" fill="#2563eb" />
        </TouchableOpacity>
        {onFavorite && (
          <TouchableOpacity style={styles.actionButton} onPress={onFavorite}>
            <Heart
              size={20}
              color={isFavorite ? '#ef4444' : '#94a3b8'}
              fill={isFavorite ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>
        )}
        {onDownload && (
          <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
            <Download
              size={20}
              color={isDownloaded ? '#10b981' : '#94a3b8'}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
