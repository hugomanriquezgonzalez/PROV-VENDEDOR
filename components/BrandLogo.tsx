
import React from 'react';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "h-8" }) => (
  <img 
    src="https://www.laperlita.cl/wp-content/uploads/2026/01/prov-300x78.png" 
    alt="PROV" 
    className={`${className} object-contain select-none transition-opacity duration-300`}
    draggable={false}
  />
);

export default BrandLogo;
