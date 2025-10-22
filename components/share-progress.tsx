'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getUserProfile, getMoodEntries } from '@/lib/user-storage';

export function ShareProgress() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareableContent = () => {
    const profile = getUserProfile();
    const moodEntries = getMoodEntries();
    
    if (!profile || moodEntries.length === 0) {
      toast({
        title: "No data to share",
        description: "Start tracking your mood to generate a progress summary!",
        variant: "destructive",
      });
      return null;
    }

    const recentEntries = moodEntries.slice(0, 7); // Last 7 entries
    const moodCounts = recentEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'balanced';

    const avgIntensity = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length 
      : 0;

    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      excited: '🤩',
      calm: '😌',
      stressed: '😤',
      grateful: '🙏',
      neutral: '😐',
      balanced: '⚖️'
    };

    return {
      text: `🌟 My MindMate Progress Update 🌟

📊 ${recentEntries.length} mood check-ins this week
${moodEmojis[mostCommonMood as keyof typeof moodEmojis]} Most common mood: ${mostCommonMood}
📈 Current streak: ${profile.currentStreak} days
💪 Wellness intensity: ${avgIntensity.toFixed(1)}/10

Taking care of my mental health one day at a time! 💙

#MentalHealthMatters #MindMate #WellnessJourney`,
      
      summary: {
        totalEntries: recentEntries.length,
        mostCommonMood,
        currentStreak: profile.currentStreak,
        avgIntensity: avgIntensity.toFixed(1)
      }
    };
  };

  const handleShare = async () => {
    setIsGenerating(true);
    
    try {
      const content = generateShareableContent();
      if (!content) return;

      if (navigator.share) {
        await navigator.share({
          title: 'My MindMate Progress',
          text: content.text,
        });
        toast({
          title: "Shared successfully! 🎉",
          description: "Your progress has been shared.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(content.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied to clipboard! 📋",
          description: "You can now paste your progress anywhere.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "Please try again or copy the text manually.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProgressImage = async () => {
    setIsGenerating(true);
    
    try {
      const content = generateShareableContent();
      if (!content) return;

      // Create a canvas for the progress image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My MindMate Progress', 400, 100);

      // Stats
      ctx.font = '32px Inter, sans-serif';
      ctx.fillText(`${content.summary.totalEntries} mood check-ins this week`, 400, 200);
      ctx.fillText(`Current streak: ${content.summary.currentStreak} days`, 400, 260);
      ctx.fillText(`Most common mood: ${content.summary.mostCommonMood}`, 400, 320);
      ctx.fillText(`Wellness intensity: ${content.summary.avgIntensity}/10`, 400, 380);

      // Footer
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText('Taking care of my mental health! 💙', 400, 480);
      ctx.fillText('#MentalHealthMatters #MindMate', 400, 520);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'mindmate-progress.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Image downloaded! 📸",
            description: "Your progress image has been saved.",
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Image generation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-emerald-600" />
          Share Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Celebrate your mental wellness journey by sharing your progress with others!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {isGenerating ? 'Generating...' : copied ? 'Copied!' : 'Share Text'}
          </Button>
          
          <Button
            onClick={generateProgressImage}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Creating...' : 'Download Image'}
          </Button>
        </div>
        
        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 Sharing your mental health journey can inspire others and help reduce stigma around mental wellness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}