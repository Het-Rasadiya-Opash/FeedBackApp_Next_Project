'use client'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-backdrop-filter:bg-slate-900/80">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <a href="#" className="text-lg font-bold text-white tracking-tight">
                    True<span className="text-indigo-400">Feedback</span>
                </a>
                {session ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(user.username || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-slate-300 hidden sm:block max-w-30 truncate">
                                {user.username || user.email}
                            </span>
                        </div>
                        <Button
                            onClick={() => signOut()}
                            variant="outline"
                            size="sm"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;