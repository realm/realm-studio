# React naming example

Lets say that we some place in the component tree have a simple "status" component that displays a static message.

## Simple representational functional component

Initially this should be a single file, named `Status.tsx` exporting a single functional component like so:

This is `Status.tsx`:
```
import * as React from 'react';

export const Status = () => <p>Status is good!</p>;
```

## Simple representational functional component with a property

Now let's make the message a property of the React component, exporting the interface for the props as well.

This is `Status.tsx`:
```
import * as React from 'react';

export interface IStatusProps {
  message: string;
}

export const Status = ({ message }: IStatusProps) => <p>{message}</p>;
```

## Styled representational functional component

Let's say we wanted to style this component. We need to save a stylesheet next to the component and therefore we'll move the contents of `Status.tsx` into a folder named `Status` and rename it to `index.tsx`:

This is `Status/index.tsx`:
```
import * as React from 'react';

import './Status.scss';

export interface IStatusProps {
  message: string;
}

export const Status = ({ message }: IStatusProps) => (
  <p className="Status">{message}</p>
);
```

This is `Status/Status.scss`:
```
.Status {
  background: green;
}
```

Note: We with our current use of styling we have a limitiation on the components that they need to have a unique name in the component tree to avoid clashes with other components, adopting CSS-modules could fix this.

## Styled representational functional component, wrapped by a container component

Now - if we wanted to add behaviour and a state to the component, we want to separate it into it's representational part (which we already have) and a container part, as mentioned in the React specific [guidelines](../GUIDELINES.md#react).

Now we rename the `index.tsx` to `Status.tsx` and implement the container component (with state & behaviour):

```
import * as React from 'react';

export interface IStatusContainerProps {
  message: string;
}

export interface IStatusContainerState {
  isVisible: boolean;
}

class StatusContainer extends React.Component<
  IStatusContainerProps,
  IStatusContainerState
> {
  constructor() {
    super();
    this.state = { isVisible: true };
  }

  public render() {
    return (
      <Status
        isVisible={isVisible}
        onHide={this.onHide}
        message={this.props.message}
      />
    );
  }

  public onHide = () => {
    this.setState({ isVisible: false });
  };
}

export { StatusContainer as Status };
```

This is `Status/Status.tsx`:
```
import * as React from 'react';

import './Status.scss';

export interface IStatusProps {
  message: string;
}

export const Status = ({ message }: IStatusProps) => (
  <p className="Status">{message}</p>
);
```

This is `Status/Status.scss`:
```
.Status {
  background: green;
}
```

Note how the interface didn't change from "Styled representational functional component" to this more stateful component, you can still import this from a parent component using `import { Status } from './Status';`
