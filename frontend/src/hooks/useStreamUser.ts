import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

type User = {
  user_id: string;
  email: string;
  streamToken: string;
};

export const useStreamUser = (apiKey: string, user: User) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user?.user_id || !user?.streamToken || !apiKey) {
      console.error("Faltan datos para inicializar Stream Chat.");
      return;
    }

    const chatClient = StreamChat.getInstance(apiKey);

    const connect = async () => {
      try {
        await chatClient.connectUser(
          {
            id: user.user_id,
            name: user.email,
          },
          user.streamToken
        );

        setClient(chatClient);
        setReady(true);
      } catch (error) {
        console.error("Error al conectar el usuario a Stream:", error);
      }
    };

    connect();

    return () => {
      chatClient.disconnectUser();
      setClient(null);
      setReady(false);
    };
  }, [apiKey, user]);

  return { client, ready };
};