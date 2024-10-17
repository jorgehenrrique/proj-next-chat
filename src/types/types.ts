// export interface RoomListData {
//   rooms: string[];
//   limit: number;
// }

export interface RoomListData {
  rooms: Room[];
  limit: number;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
}
