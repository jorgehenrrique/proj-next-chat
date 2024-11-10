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
        // 1. Cria nova instância do Peer
        const newPeer = new Peer({
          initiator, // define quem inicia a conexão
          stream, // stream local da câmera/microfone
          trickle: false, // não envia sinais pequenos, envia só o necessário, desativa negociação ICE incremental
          config: {
            // Servidores STUN para descoberta de endereço IP público
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
            ],
          },
        });

        let isDestroyed = false;

        // 2. Configura os eventos do Peer
        newPeer.on('signal', (data) => {
          if (partnerId && !isDestroyed) {
            // Envia dados de sinalização para o outro peer via servidor
            socket?.emit('video signal', { signal: data, to: partnerId });
          }
        });

        newPeer.on('stream', (remoteStream) => {
          if (!isDestroyed) {
            // Recebe e configura o stream remoto
            setRemoteStream(remoteStream);
          }
        });

        newPeer.on('error', (err: Error) => {
          console.error('[Peer] Erro:', err);
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
          // console.log('[Peer] Conexão fechada', err);
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
          // Se já existe um peer, processa o sinal
          peer.signal(signal);
        } else {
          // Se não existe, cria um novo peer e processa o sinal
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
