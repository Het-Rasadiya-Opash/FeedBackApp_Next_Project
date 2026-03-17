'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { toast } from 'sonner';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast('Success', {
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Verification Failed', {
                description:
                    axiosError.response?.data.message ??
                    'An error occurred. Please try again.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        True<span className="text-indigo-400">Feedback</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">One last step to get started</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-white text-center mb-1">Check your email</h2>
                    <p className="text-slate-400 text-sm text-center mb-6">
                        We sent a verification code to your email address
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300 text-sm">Verification Code</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter 6-digit code"
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 text-center tracking-[0.3em] text-lg"
                                        />
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                Verify Account
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}