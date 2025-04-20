import React, { useState, useEffect } from "react";
import { Chat, Channel, ChannelList, Window, MessageList, MessageInput } from "stream-chat-react";
import { StreamChat } from "stream-chat";
//import "stream-chat-react/dist/css/index.css"; // Import Stream Chat CSS
import CreatorLayout from "@/layouts/default";

// Replace these with your actual API key and dynamic token from your backend.
const apiKey: string = "";

interface ChatPageProps {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    streamToken: string;
  };
}

const ChatPanel: React.FC<ChatPageProps> = ({ user }) => {
  const [chatClient, setChatClient] = useState<StreamChat>();

  useEffect(() => {
    // Initialize StreamChat instance
    const client = StreamChat.getInstance(apiKey);

    // Connect the user; the token should come from your backend.
    client.connectUser(
      {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      user.streamToken // Use the token received from your backend here
    ).then(() => {
      setChatClient(client);
    });

    // Cleanup on unmount
    return () => {
      client.disconnectUser();
    };
  }, [user]);

  if (!chatClient) return <div className="p-8">Cargando chat...</div>;

  // Define filters and sort criteria for the ChannelList
  const filters = { type: "messaging", members: { $in: [user.user_id] } };
  const sort = { last_message_at: -1 as const };

  return (
    <Chat client={chatClient} theme="messaging light">
      <div className="flex h-full">
        <ChannelList filters={filters} sort={sort} />
        <Channel>
          <Window>
            <MessageList />
            <MessageInput focus />
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
