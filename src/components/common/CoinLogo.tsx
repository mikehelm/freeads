import coinLogo from '../../assets/coins-Flipit-ADS.png';

interface CoinLogoProps {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const CoinLogo: React.FC<CoinLogoProps> = ({
  className = '',
  alt = 'Flipit ADS Coins',
  width = 32,
  height = 32,
}) => {
  return (
    <img
      src={coinLogo}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};
