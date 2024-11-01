import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from './use-toast';

interface UseAuthSocketProps {
  token: string;
  onAuthError?: () => void;
}

export const useAuthSocket = ({ token, onAuthError }: UseAuthSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) {
      console.error('Token não fornecido');
      return;
    }

    // Inicializa o socket com opções de auth
    const socketIo = io({
      path: '/api/socket',
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });

    // Handlers de conexão
    socketIo.on('connect', () => {
      setIsConnected(true);
      console.log('Socket conectado');
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
      setIsAuthenticated(false);
      console.log('Socket desconectado');
    });

    // Handlers de autenticação
    socketIo.on('authenticated', () => {
      setIsAuthenticated(true);
      toast({
        title: 'Conectado com sucesso',
        description: 'Sua conexão está autenticada.',
      });
    });

    socketIo.on('auth_error', (error) => {
      console.error('Erro de autenticação:', error);
      setIsAuthenticated(false);
      toast({
        title: 'Erro de autenticação',
        description: 'Não foi possível autenticar sua conexão.',
        variant: 'destructive',
      });
      onAuthError?.();
    });

    // Handlers de erro
    socketIo.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      });
    });

    socketIo.on('error', (error) => {
      console.error('Erro no socket:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro na conexão.',
        variant: 'destructive',
      });
    });

    setSocket(socketIo);

    // Cleanup
    return () => {
      socketIo.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsAuthenticated(false);
    };
  }, [token, onAuthError]);

  // Função para reconectar manualmente
  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  // Função para desconectar manualmente
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  return {
    socket,
    isConnected,
    isAuthenticated,
    reconnect,
    disconnect,
  };
};

// Exemplo de uso:
/*
const MyComponent = () => {
  const token = 'meu-token-jwt';
  
  const { 
    socket, 
    isConnected, 
    isAuthenticated, 
    reconnect 
  } = useAuthSocket({
    token,
    onAuthError: () => {
      // Redirecionar para login ou renovar token
      router.push('/login');
    }
  });

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on('my_event', handleMyEvent);
      
      return () => {
        socket.off('my_event');
      };
    }
  }, [socket, isAuthenticated]);

  return (
    <div>
      Status: {isConnected ? 'Conectado' : 'Desconectado'}
      {isAuthenticated && <p>Autenticado!</p>}
      <button onClick={reconnect}>Reconectar</button>
    </div>
  );
};
*/
