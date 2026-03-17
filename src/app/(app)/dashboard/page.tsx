'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { toast } from 'sonner';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id?.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = (watch('acceptMessages') ?? false) as boolean;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error', { description: axiosError.response?.data.message ?? 'Failed to fetch message settings' });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast('Refreshed Messages', { description: 'Showing latest messages' });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast('Error', { description: axiosError.response?.data.message ?? 'Failed to fetch messages' });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error', { description: axiosError.response?.data.message ?? 'Failed to update message settings' });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!', { description: 'Profile URL has been copied to clipboard.' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your anonymous feedback</p>
        </div>

        {/* Profile Link Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Your Unique Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 truncate"
            />
            <Button onClick={copyToClipboard} className="shrink-0">Copy</Button>
          </div>
        </div>

        {/* Accept Messages Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">Accept Messages</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {acceptMessages ? 'You are currently accepting messages' : 'You are not accepting messages'}
            </p>
          </div>
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>

        <Separator className="dark:border-slate-700" />

        {/* Messages Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Messages</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.preventDefault(); fetchMessages(true); }}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id?.toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-sm">No messages yet. Share your link to start receiving feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
