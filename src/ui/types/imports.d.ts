// file type imports

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const Component: React.ComponentType<{
    className?: string;
    height?: React.ReactText;
    width?: React.ReactText;
  }>;
  export default Component;
}
