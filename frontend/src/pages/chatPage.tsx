import React, { useState } from "react";
import CreatorLayout from "@/layouts/default";
import { useUsers, UserData } from "@/hooks/useUsers";
import ContactList from "@/components/contactList";
import ChatPanel from "@/components/chatPanel";

interface Props {
  user: {
    user_id: number;
    email: string;
    streamToken: string;
  };
}

const ChatPage: React.FC<Props> = ({ user }) => {
  const { users, loading } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  return (
    <CreatorLayout>
      {/* 1) Contenedor flex-column que ocupa todo el alto */}
      <div className="flex flex-col h-full">
        
        {/* 2) Header fijo */}
        <div className="py-4 px-6">
          <h1 className="text-6xl font-medium font-barlow">Chat</h1>
        </div>

        {/* 3) Body: flex de altura restante, sin overflow en global */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* 4) Left panel: scroll sólo aquí */}
          <div className="w-1/3 border-r overflow-y-auto h-full">
            {loading ? (
              <p className="p-4">Cargando contactos…</p>
            ) : (
              <ContactList
                users={users}
                currentUserId={user.user_id}
                onSelectUser={setSelectedUser}
              />
            )}
          </div>

          {/* 5) Right panel: ocupa resto, sin scroll global */}
          <div className="flex-1 h-full">
            <ChatPanel user={user} selectedUser={selectedUser} />
          </div>

        </div>
      </div>
    </CreatorLayout>
  );
};

export default ChatPage;