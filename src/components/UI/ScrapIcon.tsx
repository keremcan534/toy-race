import scrapLogo from '../../assets/logo2.webp';

interface ScrapIconProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const ScrapIcon = ({ className = "w-4 h-4 inline-block align-middle", size, alt = "Parça" }: ScrapIconProps) => {
  return (
    <img 
      src={scrapLogo} 
      alt={alt}
      width={size}
      height={size}
      className={`object-contain select-none shrink-0 inline-block align-middle ${className}`}
    />
  );
};
