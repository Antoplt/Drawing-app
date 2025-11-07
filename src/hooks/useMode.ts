import { useState, useEffect } from "react";
import type { Mode } from "../core/mode/Mode";
import { PersistentElements } from "../core/PersistentElements";
import { SelectMoveMode } from "../core/mode/SelectMoveMode";
import { RectangleMode } from "../core/mode/RectangleMode";
import { PathMode } from "../core/mode/PathMode";
import { LineMode } from "../core/mode/LineMode";
import { EllipseMode } from "../core/mode/EllipseMode";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import type { ModeName } from "../core/mode/modeTypes";
import { setCurrentModeName } from "../store/slices/toolbarSlice";

interface UseModeResult {
  currentMode: Mode | null;
  setMode: (modeName: ModeName) => void;
}

export function useMode(
  persistentElements: PersistentElements | null,
): UseModeResult {
  const dispatch = useAppDispatch();
  const modeName = useAppSelector((state) => state.toolbar.currentModeName);
  const [currentMode, setCurrentMode] = useState<Mode | null>(null);

  useEffect(() => {
    if (!persistentElements) {
      setCurrentMode(null);
      return;
    }

    let newMode: Mode;
    switch (modeName) {
      case "SelectMove":
        newMode = new SelectMoveMode(persistentElements, dispatch);
        break;
      case "Rectangle":
        newMode = new RectangleMode(persistentElements, dispatch);
        break;
      case "Path":
        newMode = new PathMode(persistentElements, dispatch);
        break;
      case "Line":
        newMode = new LineMode(persistentElements, dispatch);
        break;
      case "Ellipse":
        newMode = new EllipseMode(persistentElements, dispatch);
        break;
      default:
        newMode = new SelectMoveMode(persistentElements, dispatch);
        break;
    }
    setCurrentMode(newMode);
  }, [modeName, persistentElements]);

  return {
    currentMode,
    setMode: (mode: ModeName) => dispatch(setCurrentModeName(mode)),
  };
}
