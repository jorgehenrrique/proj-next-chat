import ChatRoom from '@/components/ChatRoom';

export default function ChatPage() {
  return (
    <div className='container mx-auto p-2'>
      <h1 className='text-2xl font-bold mb-2'>Chat Global</h1>
      <ChatRoom roomId='global' creatorId='global' />
    </div>
  );
}
