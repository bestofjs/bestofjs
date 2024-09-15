"use client";

import { Component } from "react";

// From https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors
type Props = { fallback: React.ReactNode; children: React.ReactNode };
type State = { error: Error | null };
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!!this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
