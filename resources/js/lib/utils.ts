import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type User } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFullName(user: User): string {
    return [user.fname, user.mname, user.lname].filter(Boolean).join(' ');
}

export function getInitials(user: User): string {
    const firstInitial = user.fname.charAt(0).toUpperCase();
    const lastInitial = user.lname.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
}
