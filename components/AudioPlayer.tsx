import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Play, Pause, X } from 'lucide-react-native';
import { useAudio } from '@/contexts/AudioContext';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function AudioPlayer() {
  const { currentMezmur, isPlaying, position, duration, pause, resume, stop } = useAudio();

  if (!currentMezmur) return null;

  const progress = duration > 0 ? position / duration : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.content}>
        <Image
          source={{
            uri: currentMezmur.image_url || 'https://images.pexels.com/photos/210804/pexels-photo-210804.jpeg',
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentMezmur.title}
          </Text>
          {currentMezmur.artist && (
            <Text style={styles.artist} numberOfLines={1}>
              {currentMezmur.artist}
            </Text>
          )}
          <Text style={styles.time}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={isPlaying ? pause : resume} style={styles.controlButton}>
            {isPlaying ? (
              <Pause size={24} color="#fff" fill="#fff" />
            ) : (
              <Play size={24} color="#fff" fill="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={stop} style={styles.closeButton}>
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#334155',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#64748b',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
});
