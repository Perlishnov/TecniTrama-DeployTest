import React from "react";
import {
  useMessageContext,
  MessageContextValue,
  DefaultStreamChatGenerics,
} from "stream-chat-react";

type CustomMessageProps = Partial<MessageContextValue<DefaultStreamChatGenerics>>;

const CustomMessage: React.FC<CustomMessageProps> = () => {
  const { message, isMyMessage } = useMessageContext();
  const mine = isMyMessage();

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`
          px-4 py-2 max-w-xs md:max-w-md rounded-2xl shadow
          ${mine ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}
        `}
      >
        {message.text}
        <div className="text-xs mt-1 text-gray-300 text-right">
          {new Date(message.created_at || "").toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomMessage;