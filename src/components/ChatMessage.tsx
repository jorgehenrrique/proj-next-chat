interface MessageProps {
  message: {
    text: string;
    user: string;
  };
  isOwnMessage: boolean;
}

export default function ChatMessage({ message, isOwnMessage }: MessageProps) {
  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <span
        className={`inline-block p-2 rounded ${
          isOwnMessage ? 'bg-blue-500 text-black' : 'bg-gray-200'
        }`}
      >
        <strong>{message.user}: </strong>
        {message.text}
      </span>
    </div>
  );
}
