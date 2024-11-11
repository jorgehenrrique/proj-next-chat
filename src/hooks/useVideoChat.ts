import { VideoQuality } from '@/types/video';
import { useState, useCallback } from 'react';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export function useVideoChat(socket: Socket | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);

  // Iniciar vídeo
  const startVideo = useCallback(async () => {
    try {
      // 1. Solicita permissão e acesso à câmera/microfone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // 2. Armazena o stream local
      setLocalStream(stream);
      setVideoEnabled(true);
      // 3. Notifica o servidor que o vídeo está habilitado

      if (peer) {
        try {
          peer.addStream(stream);
        } catch (err) {
          console.error('Erro ao adicionar stream ao peer:', err);
        }
      }

      if (socket) {
        socket.emit('video enabled');
        setTimeout(() => {
          socket.emit('request video connection');
        }, 1000);
      }
    } catch (err) {
      console.error('Erro ao iniciar vídeo:', err);
      setVideoEnabled(false);
    }
  }, [socket, peer]);

  // Parar vídeo
  const stopVideo = useCallback(() => {
    if (localStream) {
      // Para todas as tracks do stream local
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Não destruir o peer ao parar o vídeo
    if (peer && localStream) {
      try {
        peer.removeStream(localStream);
      } catch (err) {
        console.error('Erro ao remover stream:', err);
      }
    }

    setVideoEnabled(false);
    if (socket) socket.emit('video disabled');
  }, [localStream, peer, socket]);

  //  Funções de controle
  // Microfone local
  const toggleLocalAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsLocalAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Audio remoto
  const toggleRemoteAudio = useCallback(() => {
    if (remoteStream) {
      const audioTrack = remoteStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsRemoteAudioEnabled(audioTrack.enabled);
      }
    }
  }, [remoteStream]);

  // Ajustar qualidade do vídeo
  const setVideoQuality = useCallback(
    (quality: VideoQuality) => {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          const constraints = {
            ultra: { width: 1920, height: 1080 },
            high: { width: 1280, height: 720 },
            medium: { width: 640, height: 480 },
            low: { width: 320, height: 240 },
          };
          videoTrack
            .applyConstraints(constraints[quality])
            // .then
            // () =>
            // console.log(`Qualidade do vídeo ajustada para ${quality}`)
            // ()
            .catch((err) =>
              console.error('Erro ao ajustar qualidade do vídeo:', err)
            );
        }
      }
    },
    [localStream]
  );

  // Trocar câmera
  const switchCamera = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      if (videoDevices.length > 1) {
        const currentDeviceId = localStream
          ?.getVideoTracks()[0]
          .getSettings().deviceId;
        const nextDevice = videoDevices.find(
          (device) => device.deviceId !== currentDeviceId
        );
        if (nextDevice) {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: nextDevice.deviceId },
            audio: true,
          });

          // Parar apenas o track de vídeo antigo
          localStream?.getVideoTracks()[0].stop();

          // Atualizar o stream local
          const newLocalStream = new MediaStream([
            newStream.getVideoTracks()[0],
            localStream?.getAudioTracks()[0] as MediaStreamTrack,
          ]);

          // Atualizar o stream no peer
          if (peer) {
            peer.removeStream(localStream as MediaStream);
            peer.addStream(newLocalStream);
          }

          setLocalStream(newLocalStream);
          // console.log('Câmera trocada com sucesso');
        }
      }
    } catch (err) {
      console.error('Erro ao trocar câmera:', err);
    }
  }, [localStream, peer]);

  // Compartilhar tela
  const shareScreen = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      // Guardar referência do vídeo atual para restaurar depois
      const currentVideoTrack = localStream?.getVideoTracks()[0];

      // Criar novo stream com o vídeo da tela e áudio existente
      const newStream = new MediaStream([
        screenStream.getVideoTracks()[0],
        localStream?.getAudioTracks()[0] as MediaStreamTrack,
      ]);

      // Atualizar o stream no peer
      if (peer) {
        peer.removeStream(localStream as MediaStream);
        peer.addStream(newStream);
      }

      // Atualizar stream local
      setLocalStream(newStream);

      // Listener para quando o usuário parar o compartilhamento
      screenStream.getVideoTracks()[0].onended = () => {
        // console.log('Compartilhamento de tela finalizado');

        // Criar novo stream com a câmera e áudio existente
        if (currentVideoTrack) {
          const cameraStream = new MediaStream([
            currentVideoTrack,
            localStream?.getAudioTracks()[0] as MediaStreamTrack,
          ]);

          // Voltar para a câmera
          if (peer) {
            peer.removeStream(newStream);
            peer.addStream(cameraStream);
          }

          setLocalStream(cameraStream);
        }
      };

      // console.log('Compartilhamento de tela iniciado');
    } catch (err) {
      console.error('Erro ao compartilhar tela:', err);
    }
  }, [localStream, peer]);

  return {
    localStream,
    remoteStream,
    peer,
    videoEnabled,
    isVideoMinimized,
    isLocalAudioEnabled,
    isRemoteAudioEnabled,
    setRemoteStream,
    setPeer,
    setIsVideoMinimized,
    startVideo,
    stopVideo,
    toggleLocalAudio,
    toggleRemoteAudio,
    setVideoQuality,
    switchCamera,
    shareScreen,
  };
}
