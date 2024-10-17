// Types para as mensagens do chat
export interface MessageProps {
  message: Message;
  isOwnMessage: boolean;
}

// Types para as mensagens do chat
export interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  roomId: string;
}

// Types para as salas de chat
export interface RoomListData {
  publicRooms: Room[];
  privateRooms: Room[];
  publicLimit: number;
  privateLimit: number;
}

// Types para as salas de chat
export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
}
