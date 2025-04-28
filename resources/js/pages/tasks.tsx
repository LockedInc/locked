import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Tasks', href: '/tasks' },
];

export default function Tasks() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Tasks</h1>
                {/* Your tasks content here */}
            </div>
        </AppLayout>
    );
}