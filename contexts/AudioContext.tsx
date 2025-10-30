import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system';
import { Mezmur } from '@/types/database';
import { mezmurService } from '@/services/mezmurService';
import { useAuth } from './AuthContext';

interface AudioContextType {
  currentMezmur: Mezmur | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isLoading: boolean;
  play: (mezmur: Mezmur) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  downloadMezmur: (mezmur: Mezmur) => Promise<void>;
  isDownloaded: (mezmurId: string) => Promise<boolean>;
  deleteDownload: (mezmurId: string) => Promise<void>;
  downloadProgress: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentMezmur, setCurrentMezmur] = useState<Mezmur | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!sound) return;

    const interval = setInterval(async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          setIsPlaying(false);
          await sound.setPositionAsync(0);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sound]);

  const play = async (mezmur: Mezmur) => {
    try {
      setIsLoading(true);

      if (sound) {
        await sound.unloadAsync();
      }

      let audioUri = mezmur.audio_url;

      if (user) {
        const localPath = await mezmurService.isDownloaded(user.id, mezmur.id);
        if (localPath) {
          const file = new File(localPath);
          if (file.exists) {
            audioUri = localPath;
          }
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentMezmur(mezmur);
      setIsPlaying(true);

      if (user) {
        await mezmurService.incrementPlayCount(mezmur.id);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resume = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setCurrentMezmur(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  };

  const seek = async (newPosition: number) => {
    if (sound) {
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const downloadMezmur = async (mezmur: Mezmur) => {
    if (!user) throw new Error('Must be logged in to download');

    try {
      setDownloadProgress(0);
      const fileName = `${mezmur.id}.mp3`;
      const file = new File(Paths.document, fileName);

      const response = await fetch(mezmur.audio_url);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await file.create();
      await file.write(uint8Array);

      await mezmurService.addDownload(user.id, mezmur.id, file.uri);
      setDownloadProgress(1);
      setTimeout(() => setDownloadProgress(0), 1000);
    } catch (error) {
      setDownloadProgress(0);
      throw error;
    }
  };

  const isDownloaded = async (mezmurId: string): Promise<boolean> => {
    if (!user) return false;
    const localPath = await mezmurService.isDownloaded(user.id, mezmurId);
    if (!localPath) return false;

    const file = new File(localPath);
    return file.exists;
  };

  const deleteDownload = async (mezmurId: string) => {
    if (!user) return;

    const localPath = await mezmurService.isDownloaded(user.id, mezmurId);
    if (localPath) {
      const file = new File(localPath);
      if (file.exists) {
        await file.delete();
      }
      await mezmurService.removeDownload(user.id, mezmurId);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentMezmur,
        isPlaying,
        position,
        duration,
        isLoading,
        play,
        pause,
        resume,
        stop,
        seek,
        downloadMezmur,
        isDownloaded,
        deleteDownload,
        downloadProgress,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
