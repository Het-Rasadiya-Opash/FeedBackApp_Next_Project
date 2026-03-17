'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { toast } from 'sonner';

export default function SignInForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast('Login Failed', {
                    description: 'Incorrect username or password',
                });
            } else {
                toast('Error', {
                    description: result.error,
                });
            }
        }

        if (result?.url) {
            router.replace('/dashboard');
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
                    <p className="text-slate-400 text-sm mt-2">Sign in to continue your secret conversations</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur">
                    <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300 text-sm">Email or Username</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="you@example.com"
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                                        />
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
                                            placeholder="••••••••"
                                            className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                                        />
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2" type="submit">
                                Sign In
                            </Button>
                        </form>
                    </Form>
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}