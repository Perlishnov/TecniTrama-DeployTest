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
      <div className="flex h-screen">
        {/* Panel izquierdo: lista de contactos */}
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          {loading ? (
            <p>Cargando contactos…</p>
          ) : (
            <ContactList
              users={users}
              currentUserId={user.user_id}
              onSelectUser={setSelectedUser}
            />
          )}
        </div>

        {/* Panel derecho: siempre montado */}
        <div className="flex-1 p-8">
          <ChatPanel user={user} selectedUser={selectedUser} />
        </div>
      </div>
    </CreatorLayout>
  );
};

export default ChatPage;