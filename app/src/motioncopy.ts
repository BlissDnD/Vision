/* English motion copy keyed by persisted motion type and parameter key. Definitions remain serialization-safe. */
import { MO } from './motion';

type MotionCopy = { name: string; desc: string; params: Record<string, [string, string[]?]> };
export const MOTION_EN: Record<string, MotionCopy> = {
  float: { name: 'Float', desc: 'Slow, gentle sway in any direction.', params: { amp: ['Distance'], period: ['Cycle (s)'], ang: ['Direction °'], phase: ['Phase'] } },
  spin: { name: 'Spin', desc: 'Continuous rotation around the layer centre.', params: { speed: ['Speed °/s'] } },
  pulse: { name: 'Pulse', desc: 'Rhythmic expansion and contraction.', params: { amp: ['Strength'], period: ['Cycle (s)'], phase: ['Phase'] } },
  orbit: { name: 'Orbit', desc: 'Move in a circular path around the original position.', params: { radius: ['Radius'], period: ['Orbit time (s)'], dir: ['Direction', ['Clockwise', 'Counterclockwise']], phase: ['Phase'] } },
  shake: { name: 'Shake', desc: 'Repeatable, irregular jitter.', params: { amp: ['Strength'], rate: ['Rate (Hz)'], rot: ['Tilt °'], seed: ['Seed'] } },
  spring: { name: 'Spring entrance', desc: 'Arrive elastically from a chosen direction. Drag the arrow on the canvas to set it.', params: { at: ['Start (s)'], dur: ['Duration (s)'], char: ['Character', ['Soft', 'Impact', 'Spring']], dist: ['Distance'], ang: ['Arrival direction °'], fade: ['Entrance opacity'], from: ['Initial scale'], bend: ['Curve'] } },
  path: { name: 'Follow path', desc: 'Follow a Path layer. Redrawing the path updates the motion.', params: { period: ['Travel time (s)'], loop: ['Repeat', ['Loop', 'Ping-pong', 'Once']], orient: ['Face direction', ['No', 'Yes']], phase: ['Starting point'] } },
  phys: { name: 'Physics body', desc: 'Turn the layer into a rigid body that can collide, bounce and roll. Seeking and export give the same result.', params: { shape: ['Shape', ['Auto', 'Circle', 'Box']], grav: ['Gravity'], gang: ['Gravity direction °'], mass: ['Mass'], bounce: ['Bounce'], fric: ['Friction'], push: ['Initial push'], pang: ['Push direction °'], spinv: ['Spin °/s'], coll: ['Collision', ['Everything', 'Same group', 'Nothing']], group: ['Group'], fixed: ['Body', ['Free', 'Fixed']], walls: ['Canvas edge', ['Wall', 'Pass through']], at: ['Start (s)'] } },
};
export const motionName = (type: string): string => MOTION_EN[type]?.name || MO[type]?.name || type;
export const motionDescription = (type: string): string => MOTION_EN[type]?.desc || MO[type]?.desc || '';
export function motionParam(type: string, param: any): any {
  const copy = param.k === 'amt' ? ['Strength'] : MOTION_EN[type]?.params[param.k];
  return copy ? { ...param, l: copy[0], ...(copy[1] ? { opts: [...copy[1]] } : {}) } : { ...param };
}
