import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import CreatorLayout from "@/layouts/default";
import { useStreamToken } from "@/hooks/useStreamToken";

interface ChatPageProps {
  user: {
    user_id: number;
    email: string;
    streamToken: string;
  };
}

const apiKey: string = import.meta.env.VITE_STREAM_API_KEY!;

const ChatPanel: React.FC<ChatPageProps> = ({ user }) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    if (!user || !user.streamToken) {
      console.error("Faltan datos del usuario o streamToken");
      return;
    }

    const initChat = async () => {
      const client = StreamChat.getInstance(apiKey);
    
      if (client.userID) {
        console.log("Usuario ya conectado a Stream:", client.userID);
        setChatClient(client);
        setClientReady(true);
        return;
      }
    
      try {
        console.log("Conectando a Stream con:", user);
    
        await client.connectUser(
          {
            id: user.user_id.toString(),
            email: user.email,
          },
          user.streamToken
        );

        const existingChannels = await client.queryChannels({
          type: "messaging",
          members: { $in: [user.user_id.toString()] },
        });
        
        if (existingChannels.length === 0) {
          const newChannel = client.channel("messaging", {
            members: [user.user_id.toString()],
          });
        
          await newChannel.create();
          console.log("Canal creado automáticamente:", newChannel.id);
        }        
    
        setChatClient(client);
        setClientReady(true);
      } catch (error) {
        console.error("Error conectando con Stream Chat:", error);
      }
    };
    

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [user]);

  if (!chatClient || !clientReady) {
    return <div className="p-8">Conectando al chat...</div>;
  }

  const filters = { type: "messaging", members: { $in: [user.user_id.toString()] } };
  const sort = { last_message_at: -1 as const };

  return (
    <Chat client={chatClient} theme="messaging light">
      <div className="flex h-full">
        <ChannelList filters={filters} sort={sort} />
        <Channel>
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </div>
    </Chat>
  );
};

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  return (
    <CreatorLayout>
      <div className="w-full h-full p-8 bg-white">
        <h1 className="text-4xl font-barlow font-medium mb-6 text-center text-black">
          Chat
        </h1>
        <ChatPanel user={user} />
      </div>
    </CreatorLayout>
  );
};

export default ChatPage;