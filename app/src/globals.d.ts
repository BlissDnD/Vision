// Ambient declarations for browser features the app feature-detects at run time.
interface ClaudeRuntime { use(name: string): Promise<any> }
interface Window {
  claude?: ClaudeRuntime;
  Mp4Muxer?: any;
  webkitAudioContext?: typeof AudioContext;
  __L?: Record<string, any>;
}
declare var VideoEncoder: any; declare var VideoFrame: any; declare var AudioEncoder: any; declare var AudioData: any;
declare module '*.css';
