'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner'
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast(
                response.data.message,
            );
            onMessageDelete(message._id?.toString() ?? '');

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error',{
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                
            });
        }
    };

    return (
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-base font-medium text-slate-800 dark:text-white leading-snug">
                        {message.content}
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                                <X className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </p>
            </CardHeader>
        </Card>
    );
}