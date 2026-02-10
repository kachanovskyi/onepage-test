export type TaglineItem = {
  id: string;
  label: string;
  link: string;
};

export type TaglineStyleVariant = 'v1' | 'v2' | 'v3' | 'v4';
export type TaglineSize = 'XL' | 'L' | 'M' | 'S' | 'XS';
export type TaglineRadius = 0 | 4 | 8 | 12 | 100;
export type TaglineAlign = 'left' | 'center' | 'right';

export type TaglineStyles = {
  variant: TaglineStyleVariant;
  size: TaglineSize;
  radius: TaglineRadius;
  align: TaglineAlign;
};

export type TaglineData = {
  items: TaglineItem[];
  styles: TaglineStyles;
};
