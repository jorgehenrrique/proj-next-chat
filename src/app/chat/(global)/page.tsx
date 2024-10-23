import ChatRoom from '@/components/ChatRoom';

export default function ChatPage() {
  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col'>
      <ChatRoom roomId='global' />
    </div>
  );
}
