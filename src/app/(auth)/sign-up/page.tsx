'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {toast} from 'sonner'
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username, 300);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage(''); // Reset message
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username-unique?username=${debouncedUsername}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'Error checking username'
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            toast('Success',{
               
                description: response.data.message,
            });

            router.replace(`/verify/${username}`);

            setIsSubmitting(false);
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;
            ('There was a problem with your sign-up. Please try again.');

            toast('Sign Up Failed',{
               
                description: errorMessage,
             
            });

            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        True<span className="text-indigo-400">Feedback</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">Sign up to start your anonymous adventure</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur">
                    <h2 className="text-xl font-semibold text-white mb-6">Create an account</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300 text-sm">Username</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="cooluser123"
                                            onChange={(e) => { field.onChange(e); setUsername(e.target.value); }}
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                                        />
                                        <div className="min-h-4.5">
                                            {isCheckingUsername && (
                                                <Loader2 className="animate-spin h-3.5 w-3.5 text-slate-400" />
                                            )}
                                            {!isCheckingUsername && usernameMessage && (
                                                <p className={`text-xs ${usernameMessage === 'Username is unique' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {usernameMessage}
                                                </p>
                                            )}
                                        </div>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300 text-sm">Email</FormLabel>
                                        <Input
                                            {...field}
                                            name="email"
                                            placeholder="you@example.com"
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                                        />
                                        <p className="text-xs text-slate-500">We&apos;ll send you a verification code</p>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300 text-sm">Password</FormLabel>
                                        <Input
                                            type="password"
                                            {...field}
                                            name="password"
                                            placeholder="••••••••"
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                                        />
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</>
                                ) : 'Sign Up'}
                            </Button>
                        </form>
                    </Form>
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
