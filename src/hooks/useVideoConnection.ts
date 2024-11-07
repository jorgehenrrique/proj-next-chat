import { UseVideoConnectionProps } from '@/types/video';
import { useCallback } from 'react';
import Peer, { SignalData } from 'simple-peer';

interface VideoSignal {
  signal: SignalData;
}

export function useVideoConnection({
  socket,
  localStream,
  partnerId,
  peer,
  setRemoteStream,
  setPeer,
}: UseVideoConnectionProps) {
  const initializePeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      try {
        const newPeer = new Peer({
          initiator,
          stream,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
            ],
          },
        });

        let isDestroyed = false;

        newPeer.on('signal', (data) => {
          if (partnerId && !isDestroyed) {
            socket?.emit('video signal', { signal: data, to: partnerId });
          }
        });

        newPeer.on('stream', (remoteStream) => {
          if (!isDestroyed) {
            setRemoteStream(remoteStream);
          }
        });

        newPeer.on('error', () => {
          // console.error('[Peer] Erro:', error);
          if (!isDestroyed) {
            console.error('Reconectando...');
            setTimeout(() => {
              if (localStream && partnerId) {
                initializePeer(localStream, true);
              }
            }, 1500);
          }
        });

        newPeer.on('close', () => {
          // console.log('[Peer] Conexão fechada');
          isDestroyed = true;
          setRemoteStream(null);
        });

        setPeer(newPeer);
        return newPeer;
      } catch (err) {
        console.error('[Peer] Erro ao criar peer:', err);
        return null;
      }
    },
    [socket, partnerId, localStream, setRemoteStream, setPeer]
  );

  const handleVideoSignal = useCallback(
    ({ signal }: VideoSignal) => {
      if (!localStream) return;

      try {
        if (peer) {
          peer.signal(signal);
        } else {
          const newPeer = initializePeer(localStream, false);
          if (newPeer) newPeer.signal(signal);
        }
      } catch (err) {
        console.error('[Video] Erro ao processar sinal:', err);
        if (partnerId) {
          setTimeout(() => {
            initializePeer(localStream, true);
          }, 1000);
        }
      }
    },
    [localStream, partnerId, peer, initializePeer]
  );

  return {
    initializePeer,
    handleVideoSignal,
  };
}
