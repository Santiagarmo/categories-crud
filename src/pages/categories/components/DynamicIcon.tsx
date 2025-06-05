import React, {Suspense} from 'react';
import type { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { HelpCircle, Image as PlaceHolderIcon } from 'lucide-react';

interface IconProps extends LucideProps {
    name: string;
}

const DynamicIcon = ({ name, ...props}: IconProps) => {
    const iconName = name as keyof typeof dynamicIconImports;

    if(!name || !dynamicIconImports[iconName]) {
        return <PlaceHolderIcon {...props} aria-label="Placeholder icon"  />;
    }

    const LucideIcon = dynamic(dynamicIconImports[iconName]);

    return (
        <Suspense fallback={<HelpCircle {...props} aria-label="Loading icon" />}>
            <LucideIcon {...props} />
        </Suspense>
    );
};

export default DynamicIcon;