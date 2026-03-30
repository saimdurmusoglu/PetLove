interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

const Icon = ({ name, width = 24, height = 24, className }: IconProps) => {
  return (
    <img
      src={new URL(`../../assets/icons/${name}.svg`, import.meta.url).href}
      width={width}
      height={height}
      className={className}
      alt={name}
    />
  );
};

export default Icon;