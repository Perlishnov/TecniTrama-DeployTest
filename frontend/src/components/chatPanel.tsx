import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { UserData } from "@/hooks/useUsers";
import CustomMessage from "@/components/customMessage";

interface Props {
  user: {
    user_id: number;
    email: string;
    streamToken: string;
  };
  selectedUser: UserData | null;
}

const apiKey = import.meta.env.VITE_STREAM_API_KEY!;

const ChatPanel: React.FC<Props> = ({ user, selectedUser }) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!selectedUser) return;

    const initChat = async () => {
      const client = StreamChat.getInstance(apiKey);

      if (!client.userID) {
        await client.connectUser(
          { id: user.user_id.toString(), name: user.email },
          user.streamToken
        );
      }

      const newChannel = client.channel("messaging", {
        members: [user.user_id.toString(), selectedUser.id.toString()],
      });

      await newChannel.watch();
      setChannel(newChannel);
      setChatClient(client);
    };

    initChat();

    return () => {
      chatClient?.disconnectUser();
    };
  }, [selectedUser]);

  if (!chatClient || !channel) {
    return <div className="p-8">Selecciona un contacto para iniciar chat…</div>;
  }

  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          {/* Cabecera personalizada */}
          <div className="bg-blue-100 px-6 py-3 border-b text-lg font-semibold text-blue-800">
            {selectedUser?.name || selectedUser?.email}
          </div>

          {/* Lista de mensajes */}
          <MessageList  Message={CustomMessage}/>

          {/* Entrada de mensajes */}
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatPanel;