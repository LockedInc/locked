import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
            <rect x="100" y="170" width="200" height="160" rx="20" ry="20" fill="#6366f1"/>
            <path d="M145,170 L145,120 C145,75 255,75 255,120 L255,170" stroke="#818cf8" stroke-width="30" fill="none" stroke-linecap="round"/>
            <line x1="140" y1="225" x2="260" y2="225" stroke="white" stroke-width="15" stroke-linecap="round"/>
            <line x1="140" y1="265" x2="220" y2="265" stroke="white" stroke-width="15" stroke-linecap="round"/>
            <line x1="140" y1="305" x2="180" y2="305" stroke="white" stroke-width="15" stroke-linecap="round"/>
        </svg>
    );
}
