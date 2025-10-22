'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface RelaxationModeProps {
  onClose?: () => void;
}

export function RelaxationMode({ onClose }: RelaxationModeProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sounds = [
    { id: 'rain', name: 'Rain', emoji: '🌧️', description: 'Gentle rainfall' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', description: 'Calming ocean sounds' },
    { id: 'forest', name: 'Forest', emoji: '🌲', description: 'Birds and nature' },
    { id: 'fire', name: 'Fireplace', emoji: '🔥', description: 'Crackling fire' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathCount((prevCount) => {
          if (prevCount <= 1) {
            setBreathPhase((prevPhase) => {
              if (prevPhase === 'inhale') return 'hold';
              if (prevPhase === 'hold') return 'exhale';
              return 'inhale';
            });
            return breathPhase === 'hold' ? 7 : 4; // 4-7-8 breathing
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase]);

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  const getBreathingScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 0.8;
    }
  };

  const toggleSound = (soundId: string) => {
    if (selectedSound === soundId && isPlaying) {
      setIsPlaying(false);
    } else {
      setSelectedSound(soundId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Relaxation Mode</h1>
          <p className="text-lg opacity-80">Take a moment to breathe and relax</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Breathing Exercise */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wind className="h-5 w-5" />
                4-7-8 Breathing Exercise
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="relative flex items-center justify-center h-64">
                <motion.div
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl`}
                  animate={{
                    scale: isBreathing ? getBreathingScale() : 1,
                  }}
                  transition={{
                    duration: breathPhase === 'hold' ? 7 : 4,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{breathCount}</div>
                    <div className="text-lg text-white/90">{getPhaseText()}</div>
                  </div>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm opacity-80">
                  Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                </p>
                <Button
                  onClick={() => setIsBreathing(!isBreathing)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  size="lg"
                >
                  {isBreathing ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Breathing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ambient Sounds */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Music className="h-5 w-5" />
                Ambient Sounds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {sounds.map((sound) => (
                  <Button
                    key={sound.id}
                    variant="outline"
                    onClick={() => toggleSound(sound.id)}
                    className={`h-20 flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedSound === sound.id && isPlaying
                        ? 'bg-white/30 border-white/50 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-2xl">{sound.emoji}</span>
                    <div className="text-center">
                      <div className="text-xs font-medium">{sound.name}</div>
                      <div className="text-xs opacity-70">{sound.description}</div>
                    </div>
                    {selectedSound === sound.id && isPlaying && (
                      <Volume2 className="h-3 w-3 absolute top-2 right-2" />
                    )}
                  </Button>
                ))}
              </div>
              
              {selectedSound && isPlaying && (
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">Now playing: {sounds.find(s => s.id === selectedSound)?.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <VolumeX className="mr-2 h-3 w-3" />
                    Stop Sound
                  </Button>
                </div>
              )}
              
              <div className="text-center text-sm opacity-70">
                <p>Choose a calming sound to accompany your breathing exercise</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Exit Relaxation Mode
          </Button>
        </div>
      </div>
    </div>
  );
}