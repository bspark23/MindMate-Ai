'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Clock, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getUserProfile } from '@/lib/user-storage';

export function NotificationSystem() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const enabled = localStorage.getItem('mindmate_notifications_enabled') === 'true';
      setNotificationsEnabled(enabled && Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('mindmate_notifications_enabled', 'true');
        scheduleNotifications();
        
        toast({
          title: "Notifications enabled! 🔔",
          description: "We'll send you gentle reminders for your daily check-ins.",
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You can enable them later in your browser settings.",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.setItem('mindmate_notifications_enabled', 'false');
    clearScheduledNotifications();
    
    toast({
      title: "Notifications disabled",
      description: "You won't receive reminder notifications anymore.",
    });
  };

  const scheduleNotifications = () => {
    // Clear existing notifications
    clearScheduledNotifications();
    
    // Schedule daily reminder (example: 7 PM)
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(19, 0, 0, 0); // 7 PM
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      sendNotification();
      // Schedule for next day
      setInterval(sendNotification, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilReminder);
    
    localStorage.setItem('mindmate_notification_timeout', timeoutId.toString());
  };

  const clearScheduledNotifications = () => {
    const timeoutId = localStorage.getItem('mindmate_notification_timeout');
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId));
      localStorage.removeItem('mindmate_notification_timeout');
    }
  };

  const sendNotification = () => {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;
    
    const profile = getUserProfile();
    const userName = profile?.preferredName || 'there';
    
    const messages = [
      `Hey ${userName}, time for your mood check-in 💬`,
      `${userName}, how are you feeling today? 🌸`,
      `Take a moment to reflect, ${userName} ✨`,
      `Your mental wellness matters, ${userName} 💙`,
      `Ready for your daily check-in, ${userName}? 🌟`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    new Notification('MindMate Reminder', {
      body: randomMessage,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'mindmate-reminder',
      requireInteraction: false,
    });
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      sendNotification();
      toast({
        title: "Test notification sent!",
        description: "Check if you received the notification.",
      });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600" />
          Gentle Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get gentle daily reminders to check in with your mental wellness.
        </p>
        
        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-sm">
                Daily Check-in Reminders
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                7:00 PM daily
              </p>
            </div>
          </div>
          
          {notificationsEnabled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={disableNotifications}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Disable
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={requestNotificationPermission}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Enable
            </Button>
          )}
        </div>
        
        {notificationsEnabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={testNotification}
            className="w-full"
          >
            Test Notification
          </Button>
        )}
        
        {permission === 'denied' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Notifications are blocked. Please enable them in your browser settings to receive reminders.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}