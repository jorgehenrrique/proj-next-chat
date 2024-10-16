import RoomList from '@/components/RoomList';
import CreateRoomModal from '@/components/CreateRoomModal';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h1 className='text-4xl font-bold mb-8'>Chat App</h1>
      <CreateRoomModal />

      <div className='mt-8'>
        <RoomList />
      </div>
    </div>
  );
}
