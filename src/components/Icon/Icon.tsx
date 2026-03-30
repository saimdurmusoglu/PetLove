interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

const Icon = ({ name, width = 24, height = 24, className }: IconProps) => {
  return (
    <svg width={width} height={height} className={className}>
      <use href={`/src/assets/sprite/sprite.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;