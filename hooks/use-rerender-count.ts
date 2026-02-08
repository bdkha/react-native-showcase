import React from "react";

export function useRenderCount(label: string) {
    const count = React.useRef(0);
    count.current++;
  
    return count.current;
  }
  