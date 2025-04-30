import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, CheckSquare, BarChart2, Clock } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Locked">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-4 text-2xl font-semibold">Streamline Your Meetings and Tasks</h1>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Locked is your all-in-one solution for efficient meeting management and task tracking. 
                                Connect your meetings directly with actionable tasks and get real-time insights to make every minute count.
                            </p>
                            <ul className="mb-8 flex flex-col gap-6">
                                <li className="flex items-start gap-4">
                                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900">
                                        <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-medium">Smart Meeting Management</h3>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Plan and execute meetings with ease, with built-in agendas and real-time collaboration.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                                        <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-medium">Integrated Task Management</h3>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Seamlessly convert meeting discussions into actionable tasks and track their progress.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                                        <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-medium">Real-time Analytics</h3>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Get instant insights into meeting effectiveness and team productivity.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-medium">Time Optimization</h3>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Make every meeting count with smart scheduling and time tracking features.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="flex gap-3">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="#features"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-blue-950 dark:to-gray-900">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AppLogoIcon className="size-48 text-[#F53003] dark:text-[#F61500]" />
                            </div>
                            <div className="absolute inset-0 opacity-10">
                                <svg
                                    className="h-full w-full"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100" height="100" fill="url(#grid)" />
                                </svg>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
