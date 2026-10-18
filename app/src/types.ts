/** Shared data model of Látomás Stúdió. Everything is plain JSON so projects, undo history and recipes serialize as-is. */

/** A keyframe on a numeric parameter. `e` is the curve of the segment that starts here (index into KEY_EASES). */
export interface Key { t: number; v: number; e?: number; z?: number; w?: number; bz?: number[] }

/** An animatable numeric (or select/colour) parameter value. */
export interface NParam {
  v: any;          // base value (number, or '#rrggbb' for colours)
  a?: number;      // LFO depth
  f?: number;      // LFO rate
  w?: number;      // LFO wave index
  s?: string;      // signal key (audio / beat)
  sa?: number;     // signal amount
  k?: Key[];       // keyframes
}

/** Static description of one slider / select / colour control. */
export interface ParamDef { k: string; l: string; min?: number; max?: number; def: any; step?: number; type?: 'sel' | 'color'; opts?: string[] }

export type EffectKind = 'gen' | 'fx' | '3d' | 'shape' | 'text' | 'image';

/** One layer type in the effect library. `code` is GLSL defining `vec4 fx()` (premultiplied RGBA). */
export interface EffectDef {
  kind: EffectKind;
  name: string;
  desc: string;
  params: ParamDef[];
  main?: string[];
  code: string;
  lib?: string;
  passes?: number;
  feedback?: boolean;
  points?: boolean;
  blob?: boolean;
  usesPal?: boolean;
  noPal?: boolean;
  groups?: { t: string; keys: string[]; open?: boolean; text?: boolean }[];
  setU?: (prog: WebGLProgram & { u: Record<string, WebGLUniformLocation | null> }, L: Layer, t: number) => void;
  [extra: string]: any;
}

export interface Timing { in: number; inAt: number; inDur: number; out: number; outAt: number; outDur: number; ease: number; fps?: number }
export interface LineSpec { size?: number; dx?: number; gap?: number; weight?: string; font?: string; italic?: boolean }
export interface TextSpec { str: string; font: string; weight: string; track: number; align?: 'left' | 'center' | 'right'; lh?: number; wrap?: number; lines?: LineSpec[] }
export interface Prim { t: number; op: number; x: number; y: number; z: number; sx: number; sy: number; sz: number; rx: number; ry: number; k: number; c: number }
export interface Macro { l: string; v: number; t: [string, string, number, number][] }

/** A layer or a group (type === 'group'). Groups hold `children` and `macros`; leaf layers hold `p`. */
export interface Layer {
  id: string;
  type: string;
  name: string;
  vis: boolean;
  blend: string;
  pal?: number;
  clip: boolean;
  maskOnly?: boolean;
  n: Record<string, NParam>;
  p?: Record<string, NParam>;
  fx: Layer[];
  tm?: Timing;
  text?: TextSpec;
  prims?: Prim[];
  psel?: number;
  asset?: string | null;
  code?: string;
  btext?: string;
  children?: Layer[];
  macros?: Macro[];
  open?: boolean;
  recipe?: string;
  [extra: string]: any;
}

export interface Look { preset: string; tone: number; fps: number; p: Record<string, NParam> }
export interface Camera { id: '__cam'; name: string; type: 'cam'; vis: boolean; on: boolean; n: Record<string, NParam>; p: Record<string, NParam>; mode?: number; shots?: { t: number; id: string }[]; path?: string; ploop?: number; focusT?: boolean }

/** The whole project state (what is saved, undone and exported). */
export interface Project {
  layers: Layer[];
  bg: string;
  size: string;
  q: number;
  qMode: 'auto' | 'fixed' | string;
  look: Look;
  light?: any;
  cam?: Camera;
  dur: number;
  loop: boolean;
  bpm: number;
  bpmOff: number;
  /** Közös alapok (shared bases) by id; variants reference them. */
  bases?: Record<string, { id: string; name: string; children: Layer[] }>;
  /** S1 Jelenetek: saved compositions in order, each with its incoming transition. */
  scenes?: any[];
  /** Kapcsolatok: parameter links between elements. */
  links?: any[];
  /** Jelzések: manual cue taps {id, t, label}. */
  cues?: { id: string; t: number; label: string }[];
}

/** A recipe: layer list + macro sliders (+ optional camera / duration). */
export interface Recipe {
  n: string;
  desc: string;
  cat?: 'world' | 'motion';
  dur?: number;
  cam?: any;
  layers: [string, any][];
  macros?: { l: string; t: [number, string, number, number][] }[];
}
