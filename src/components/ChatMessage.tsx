import { MessageProps } from '@/types/types';

export default function ChatMessage({ message, isOwnMessage }: MessageProps) {
  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <span
        className={`inline-block p-2 rounded ${
          isOwnMessage ? 'bg-blue-500 text-black' : 'bg-gray-200'
        }`}
      >
        <strong>{message.username}: </strong>
        {message.text}
      </span>
    </div>
  );
}
