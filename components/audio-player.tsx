'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const sounds = [
  { name: 'Rain', src: '/audio/calm-rain.mp3' },
  { name: 'Forest', src: '/audio/forest-ambience.mp3' },
  { name: 'Ocean', src: '/audio/ocean-waves.mp3' },
];

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(sounds[0]);
  const [volume, setVolume] = useState(0.5); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState(false);

  // Effect for volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      console.log(`AudioPlayer: Volume set to ${volume}, Muted: ${isMuted}`);
    }
  }, [volume, isMuted]);

  // Effect for changing audio source and handling play after load
  useEffect(() => {
    if (!audioRef.current) {
      console.log("AudioPlayer: audioRef.current is null on source change effect.");
      return;
    }

    const audio = audioRef.current;
    const wasPlayingBeforeSourceChange = isPlaying; // Capture state before potential re-render

    console.log(`AudioPlayer: Changing sound to ${currentSound.name}. Was playing: ${wasPlayingBeforeSourceChange}`);
    audio.src = currentSound.src;
    audio.load(); // Explicitly load the new source

    const handleCanPlayThrough = () => {
      console.log(`AudioPlayer: Can play through event for ${currentSound.name}.`);
      if (wasPlayingBeforeSourceChange) {
        audio.play().then(() => {
          console.log(`AudioPlayer: Successfully played audio after source change for ${currentSound.name}.`);
        }).catch(e => console.error("AudioPlayer: Error playing audio after source change:", e));
      }
      audio.removeEventListener('canplaythrough', handleCanPlayThrough); // Remove listener after use
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Cleanup function for this effect
    return () => {
      console.log(`AudioPlayer: Cleaning up source change effect for ${currentSound.name}.`);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [currentSound]); // Only re-run when currentSound changes

  // Effect for handling play/pause state changes (e.g., from button clicks)
  useEffect(() => {
    if (!audioRef.current) {
      console.log("AudioPlayer: audioRef.current is null on play/pause effect.");
      return;
    }

    const audio = audioRef.current;
    console.log(`AudioPlayer: isPlaying state changed to ${isPlaying}.`);

    if (isPlaying) {
      // Only play if audio is already ready, otherwise the currentSound effect will handle it
      // if a source change just occurred. This prevents interrupting a loading process.
      if (audio.readyState >= 3) { // HTMLMediaElement.HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
        audio.play().then(() => {
          console.log("AudioPlayer: Successfully played audio (from isPlaying change).");
        }).catch(e => console.error("AudioPlayer: Error playing audio (from isPlaying change):", e));
      } else {
        console.log("AudioPlayer: Audio not ready to play yet, waiting for canplaythrough.");
      }
    } else {
      audio.pause();
      console.log("AudioPlayer: Audio paused.");
    }
  }, [isPlaying]); // Only re-run when isPlaying changes

  const togglePlayPause = () => {
    console.log(`AudioPlayer: Toggling play/pause. Current isPlaying: ${isPlaying}`);
    setIsPlaying(!isPlaying); // Let the useEffect handle the actual play/pause
  };

  const handleVolumeChange = (val: number[]) => {
    console.log(`AudioPlayer: Volume slider changed to ${val[0]}.`);
    setVolume(val[0]);
    if (audioRef.current) {
      audioRef.current.volume = val[0];
      if (val[0] > 0 && isMuted) {
        setIsMuted(false); // Unmute if volume is increased from 0 while muted
        console.log("AudioPlayer: Unmuting due to volume increase.");
      }
    }
  };

  const toggleMute = () => {
    console.log(`AudioPlayer: Toggling mute. Current isMuted: ${isMuted}`);
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg bg-bg-light dark:bg-gray-800 text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-all duration-300 hover:scale-105"
            aria-label="Open audio player"
          >
            <Music className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-text-light dark:text-text-dark">Calming Sounds</h3>
            <span className="text-sm text-text-light/70 dark:text-text-dark/70">{currentSound.name}</span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {sounds.map((sound) => (
              <Button
                key={sound.name}
                variant={currentSound.name === sound.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentSound(sound)}
                className={cn(
                  "text-xs px-3 py-1 rounded-full",
                  currentSound.name === sound.name
                    ? "bg-primary-light text-white dark:bg-primary-dark"
                    : "bg-bg-light text-text-light dark:bg-gray-700 dark:text-text-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
                )}
              >
                {sound.name}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
              aria-label="Volume control"
            />
          </div>
          <audio ref={audioRef} loop crossOrigin="anonymous" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
