declare module '*.svg' {
  const svg: {
    id: string;
    viewBox: string;
    url: string;
  };
  export default svg;
}

// Adding module declarations that ROS does not include
// tslint:disable:max-classes-per-file

declare class CircularBuffer {}
declare module 'circular-buffer';

declare module 'express' {
  type Application = any;
  export { Application };
  export class Request {}
}

declare module 'uws' {
  export class Server {}
}
