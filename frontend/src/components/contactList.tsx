import React from "react";
import { UserData } from "@/hooks/useUsers";

interface Props {
  users: UserData[];
  currentUserId: number;
  onSelectUser: (targetUser: UserData) => void;
}

const ContactList: React.FC<Props> = ({ users, currentUserId, onSelectUser }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Contactos</h2>
      <ul>
        {users
          .filter(user => user.id !== currentUserId)
          .map(user => (
            <li key={user.id} className="mb-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => onSelectUser(user)}
              >
                {user.name || user.email}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ContactList;