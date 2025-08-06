'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Save, Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry } from '@/lib/types';
import { saveJournalEntry } from '@/lib/local-storage';
import { v4 as uuidv4 } from 'uuid';
import { TypingIndicator } from './typing-indicator';

interface VoiceInputProps {
onSave: (entry: JournalEntry) => void;
}

declare global {
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
}

export function VoiceInput({ onSave }: VoiceInputProps) {
const [isListening, setIsListening] = useState(false);
const [transcript, setTranscript] = useState('');
const [aiResponse, setAiResponse] = useState('');
const [isLoadingAI, setIsLoadingAI] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [showConfetti, setShowConfetti] = useState(false);

const recognitionRef = useRef<any>(null);
const finalTranscriptRef = useRef('');

useEffect(() => {
  if (typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        setTranscript(finalTranscriptRef.current + interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (finalTranscriptRef.current.trim() !== '') {
          sendToAI(finalTranscriptRef.current.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      console.warn('Web Speech API not supported in this browser.');
    }
  }
}, []);

const startListening = () => {
  if (recognitionRef.current) {
    finalTranscriptRef.current = '';
    setTranscript('');
    setAiResponse('');
    setIsListening(true);
    recognitionRef.current.start();
  }
};

const stopListening = () => {
  if (recognitionRef.current) {
    setIsListening(false);
    recognitionRef.current.stop();
  }
};

const sendToAI = async (text: string) => {
  if (!text) return;
  setIsLoadingAI(true);
  try {
    const response = await fetch('/journal/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setAiResponse(data.response);
  } catch (error) {
    console.error('Error sending text to AI:', error);
    setAiResponse('I apologize, but I could not process your request at this moment. Please try again later.');
  } finally {
    setIsLoadingAI(false);
  }
};

const handleSaveJournal = () => {
  if (transcript.trim() === '' || aiResponse.trim() === '') {
    alert('Please speak and get an AI response before saving.');
    return;
  }
  setIsSaving(true);
  const newEntry: JournalEntry = {
    id: uuidv4(),
    timestamp: Date.now(),
    userText: transcript.trim(),
    aiResponse: aiResponse.trim(),
  };
  saveJournalEntry(newEntry);
  onSave(newEntry); // Notify parent component
  setTranscript('');
  setAiResponse('');
  finalTranscriptRef.current = '';
  setIsSaving(false);
  setShowConfetti(true);
  setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
};

return (
  <div className="space-y-6">
    {showConfetti && (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
            }}
          ></div>
        ))}
      </div>
    )}
    <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
          <Mic className="h-6 w-6" /> Your Voice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Speak into the microphone or type your thoughts here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[120px] resize-y border-primary-light/50 dark:border-primary-dark/50 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark text-text-light dark:text-text-dark bg-bg-light dark:bg-gray-700"
        />
        <div className="flex justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`px-6 py-3 rounded-full shadow-md transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary-light hover:bg-accent-light dark:bg-primary-dark dark:hover:bg-accent-dark'
            } text-white`}
            disabled={isLoadingAI || isSaving}
          >
            {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          <Button
            onClick={() => sendToAI(transcript)}
            className="px-6 py-3 rounded-full shadow-md transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white"
            disabled={isLoadingAI || isSaving || transcript.trim() === ''}
          >
            {isLoadingAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
            Get AI Reflection
          </Button>
        </div>
      </CardContent>
    </Card>

    {aiResponse && (
      <Card className="shadow-lg rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-primary-light dark:text-primary-dark flex items-center gap-2">
            <Sparkles className="h-6 w-6" /> AI Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 text-text-light dark:text-text-dark min-h-[100px] flex items-center justify-center relative">
            {isLoadingAI ? (
              <TypingIndicator />
            ) : (
              <p className="whitespace-pre-wrap">{aiResponse}</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSaveJournal}
              className="px-6 py-3 rounded-full shadow-md transition-all duration-300 bg-green-500 hover:bg-green-600 text-white"
              disabled={isSaving || isLoadingAI || transcript.trim() === '' || aiResponse.trim() === ''}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
              Save Journal
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
    <style jsx global>{`
      @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
      }
      .confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 9999;
      }
      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #f00; /* Default color, overridden by inline style */
        animation: confetti 3s ease-out forwards;
        opacity: 0;
        transform-origin: center;
        border-radius: 50%;
      }
    `}</style>
  </div>
);
}
