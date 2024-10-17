import ChatRoom from '@/components/ChatRoom';

export default function ChatPage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Chat Global</h1>
      <ChatRoom roomId='global' />
    </div>
  );
}
