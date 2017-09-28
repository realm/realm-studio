import * as React from 'react';
import './ContextMenu.scss';

export interface IAction {
  label: string;
  onClick: () => any;
}

export interface IProps {
  close: () => void;
  x: number;
  y: number;
  object: any;
  actions: IAction[];
}

export default class ContextMenu extends React.Component<any, IProps> {
  public root: HTMLDivElement | null;

  public componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  public handleClick = (event: any) => {
    if (!event.target.contains(this.root)) {
      this.props.close();
    }
  };

  public render() {
    const { x, y, actions, close } = this.props;
    return (
      <div
        style={{ left: x, top: y }}
        ref={ref => (this.root = ref)}
        className="ContextMenu"
      >
        {actions &&
          actions.map((action: IAction) => (
            <div
              key={action.label}
              onClick={() => {
                action.onClick();
                close();
              }}
              className="ContextMenu__Option"
            >
              {action.label}
            </div>
          ))}
      </div>
    );
  }
}
