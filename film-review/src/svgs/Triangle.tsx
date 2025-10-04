import React from "react";

const Triangle: React.FC<{ size?: number; color?: string }> = ({
  size = 35,
  color = "#FD0000",
}) => (
    <svg 
        width={size}
        height={size}
        viewBox='0 0 100 86.6' 
        xmlns='http://www.w3.org/2000/svg'
        className="triangle">
        <polygon 
            fill={color}
            points='50,0 0,86.6 100,86.6'
        />
    </svg>
);

export default Triangle;