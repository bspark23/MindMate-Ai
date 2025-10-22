import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic, Send, BookText, AlertTriangle, Phone } from 'lucide-react'
import { JournalEntry } from '@/lib/types'
import { sendChatMessage } from '@/api/chat'

interface VoiceInputProps {
    onSave: (entry: JournalEntry) => void
}

export function VoiceInput({ onSave }: VoiceInputProps) {
    const [text, setText] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [aiResponse, setAiResponse] = useState('')
    const [showCrisisAlert, setShowCrisisAlert] = useState(false)

    const checkForCrisisKeywords = (message: string): boolean => {
        const crisisKeywords = [
            'hopeless', 'suicide', 'kill myself', 'end it all', 'can\'t go on', 
            'want to die', 'self-harm', 'hurt myself', 'no point', 'give up'
        ]
        const lowerMessage = message.toLowerCase()
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword))
    }

    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('🎤 Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice input.')
            return
        }

        try {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            const recognition = new SpeechRecognition()
            
            recognition.continuous = false  // Changed to false for better control
            recognition.interimResults = true
            recognition.lang = 'en-US'
            recognition.maxAlternatives = 1

            recognition.onstart = () => {
                console.log('🎤 Voice recognition started')
                setIsListening(true)
            }

            recognition.onresult = (event: any) => {
                console.log('🎤 Voice recognition result:', event)
                let finalTranscript = ''
                let interimTranscript = ''
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript
                    } else {
                        interimTranscript += transcript
                    }
                }
                
                if (finalTranscript) {
                    setText(prev => {
                        const newText = prev ? prev + ' ' + finalTranscript : finalTranscript
                        console.log('📝 Updated text:', newText)
                        return newText
                    })
                }
            }

            recognition.onerror = (event: any) => {
                console.error('🎤 Voice recognition error:', event.error)
                setIsListening(false)
                
                let errorMessage = 'Voice recognition error. '
                switch (event.error) {
                    case 'no-speech':
                        errorMessage += 'No speech detected. Please try again.'
                        break
                    case 'audio-capture':
                        errorMessage += 'Microphone not accessible. Please check permissions.'
                        break
                    case 'not-allowed':
                        errorMessage += 'Microphone permission denied. Please allow microphone access.'
                        break
                    default:
                        errorMessage += 'Please try typing instead.'
                }
                alert(errorMessage)
            }

            recognition.onend = () => {
                console.log('🎤 Voice recognition ended')
                setIsListening(false)
            }

            // Request microphone permission first
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    recognition.start()
                })
                .catch((error) => {
                    console.error('Microphone permission error:', error)
                    alert('🎤 Please allow microphone access to use voice input.')
                })

        } catch (error) {
            console.error('Voice recognition setup error:', error)
            setIsListening(false)
            alert('Voice recognition setup failed. Please try typing instead.')
        }
    }

    const handleSave = async () => {
        if (!text.trim()) return

        setIsProcessing(true)
        
        // Check for crisis keywords
        if (checkForCrisisKeywords(text)) {
            setShowCrisisAlert(true)
        }

        try {
            console.log('📝 Journal: Sending message to AI:', text.trim())
            
            // Get AI response
            const response = await sendChatMessage(text.trim())
            console.log('📝 Journal: Received AI response:', response)
            
            setAiResponse(response)

            const entry: JournalEntry = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                userText: text.trim(),
                aiResponse: response,
            }

            // Save to localStorage
            const existingEntries = JSON.parse(localStorage.getItem('mindmate_journal_entries') || '[]')
            localStorage.setItem('mindmate_journal_entries', JSON.stringify([entry, ...existingEntries]))

            console.log('📝 Journal: Entry saved successfully')
            onSave(entry)
            setText('')
            
        } catch (error) {
            console.error('📝 Journal: Error getting AI response:', error)
            const fallbackResponse = `Thank you for sharing "${text.trim()}" with me. I'm here to listen and support you on your journey. While I'm having a technical moment, I want you to know that your thoughts and feelings are important. 💙`
            setAiResponse(fallbackResponse)
            
            // Still save the entry with fallback response
            const entry: JournalEntry = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                userText: text.trim(),
                aiResponse: fallbackResponse,
            }
            
            const existingEntries = JSON.parse(localStorage.getItem('mindmate_journal_entries') || '[]')
            localStorage.setItem('mindmate_journal_entries', JSON.stringify([entry, ...existingEntries]))
            
            onSave(entry)
            setText('')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Crisis Alert */}
            {showCrisisAlert && (
                <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-3">
                                <h3 className="font-semibold text-red-800 dark:text-red-300">
                                    You're Not Alone - Help is Available
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    If you're having thoughts of self-harm or suicide, please reach out for support immediately:
                                </p>
                                <div className="space-y-2">
                                    <Button 
                                        size="sm" 
                                        className="bg-red-600 hover:bg-red-700 text-white mr-2"
                                        onClick={() => window.open('tel:988')}
                                    >
                                        <Phone className="h-4 w-4 mr-1" />
                                        Call 988 (Suicide Prevention)
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => window.open('sms:741741?body=HOME')}
                                    >
                                        Text HOME to 741741
                                    </Button>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => setShowCrisisAlert(false)}
                                    className="text-red-600"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Journal Input */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookText className="h-5 w-5 text-purple-600" />
                        Journal Entry
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[200px] resize-y border-purple-200 focus:border-purple-400"
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={startVoiceRecognition}
                            disabled={isListening || isProcessing}
                        >
                            <Mic className={`h-4 w-4 mr-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                            {isListening ? 'Listening...' : 'Voice Input'}
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={!text.trim() || isProcessing}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Getting AI Response...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Save & Get AI Insights
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* AI Response */}
            {aiResponse && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookText className="h-5 w-5 text-green-600" />
                            AI Companion Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{aiResponse}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}