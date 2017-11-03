declare module '*.svg' {
  const svg: {
    id: string;
    viewBox: string;
    url: string;
  };
  export default svg;
}

// Adding module declarations for packages that has no types available

declare module 'mixpanel-browser' {
  export = mixpanel;
}

declare module 'keytar-prebuild' {
  import * as keytar from 'keytar';
  export = keytar;
}
