import { Component, type ErrorInfo, type ReactNode } from "react";

type RoomGlbErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type RoomGlbErrorBoundaryState = {
  hasError: boolean;
};

/** Falls back to procedural room if GLB load/parse fails. */
class RoomGlbErrorBoundary extends Component<
  RoomGlbErrorBoundaryProps,
  RoomGlbErrorBoundaryState
> {
  state: RoomGlbErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[room] studio.glb failed to load; using box room.", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default RoomGlbErrorBoundary;
