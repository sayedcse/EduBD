import React from 'react';
import LiquidGlass from 'liquid-glass-react';

const Glass = ({ children, className = '', padding = "24px", radius = 16 }) => {
    return (
        <LiquidGlass
            cornerRadius={radius}
            elasticity={0.2}
            blurAmount={0.05}
            padding={padding}
            className={`shadow-lg border border-white/20 ${className}`}
        >
            {children}
        </LiquidGlass>
    );
};

export default Glass;
