import React from "react";

const AnonymousUserIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
}) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#ccc" />
        <circle cx="16" cy="12" r="6" fill="#fff" />
        <rect x="8" y="20" width="16" height="6" rx="3" fill="#fff" />
    </svg>
);

export default AnonymousUserIcon;
