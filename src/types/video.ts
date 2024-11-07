import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export interface VideoChatProps {
  stream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
  isLocalAudioEnabled: boolean;
  isRemoteAudioEnabled: boolean;
  onToggleLocalAudio: () => void;
  onToggleRemoteAudio: () => void;
  setVideoQuality: (quality: VideoQuality) => void;
  switchCamera: () => void;
  shareScreen: () => void;
}

export type VideoQuality = 'ultra' | 'high' | 'medium' | 'low';

export interface UseVideoConnectionProps {
  socket: Socket | null;
  localStream: MediaStream | null;
  partnerId: string | null;
  peer: Peer.Instance | null;
  setRemoteStream: (stream: MediaStream | null) => void;
  setPeer: (peer: Peer.Instance | null) => void;
}
