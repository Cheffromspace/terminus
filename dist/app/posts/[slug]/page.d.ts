import { Metadata } from 'next';
import React from 'react';
export declare function generateStaticParams(): Promise<Array<{
    slug: string;
}>>;
type PageProps = {
    params: Promise<{
        slug: string;
    }>;
    searchParams?: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
};
export declare function generateMetadata({ params, }: PageProps): Promise<Metadata>;
export default function PostPage({ params, }: PageProps): Promise<React.ReactElement>;
export {};
