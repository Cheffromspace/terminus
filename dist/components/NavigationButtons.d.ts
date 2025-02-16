import React from 'react';
import type { Post } from '@/types/blog';
interface NavigationButtonsProps {
    previous: Post | null;
    next: Post | null;
}
export declare const NavigationButtons: React.FC<NavigationButtonsProps>;
export default NavigationButtons;
