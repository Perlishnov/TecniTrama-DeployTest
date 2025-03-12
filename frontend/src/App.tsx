import React, { useState, useEffect } from 'react';

function App() {
  const [projects, setProjects] = useState([]);
  const [applicantEmail, setApplicantEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Load projects when the component mounts
  useEffect(() => {
    fetch('http://localhost:4000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  // Apply for a project
  const applyForProject = (projectId) => {
    if (!applicantEmail) {
      alert("Please enter your email");
      return;
    }
    fetch('http://localhost:4000/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, applicantEmail })
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.error("Error applying for project:", err));
  };

  // Select a project to open its messaging interface
  const selectProject = (project) => {
    setSelectedProject(project);
    // Fetch messages for the selected project
    fetch(`http://localhost:4000/api/messages/${project._id}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error fetching messages:", err));
  };

  // Send a message for the selected project
  const sendMessage = () => {
    if (!newMessage) return;
    fetch('http://localhost:4000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: selectedProject._id,
        from: applicantEmail,
        message: newMessage
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Refresh messages after sending
        return fetch(`http://localhost:4000/api/messages/${selectedProject._id}`);
      })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setNewMessage('');
      })
      .catch(err => console.error("Error sending message:", err));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TecniTrama Projects</h1>
      <div className="mb-4">
        <label className="block mb-2">Your Email (for application & messaging):</label>
        <input
          type="email"
          value={applicantEmail}
          onChange={e => setApplicantEmail(e.target.value)}
          className="border p-2 w-full"
          placeholder="you@example.com"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">Available Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project._id} className="border p-4 mb-2">
            <h3 className="font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <div className="mt-2">
              <button
                onClick={() => applyForProject(project._id)}
                className="bg-blue-500 text-white px-4 py-2 mr-2"
              >
                Apply
              </button>
              <button
                onClick={() => selectProject(project)}
                className="bg-green-500 text-white px-4 py-2"
              >
                Open Messaging
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedProject && (
        <div className="mt-8 border p-4">
          <h2 className="text-xl font-semibold mb-2">
            Messaging for {selectedProject.title}
          </h2>
          <div className="mb-4">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className="border-b py-2">
                  <strong>{msg.from}:</strong> {msg.message}
                </div>
              ))
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="border p-2 flex-grow"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 ml-2">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
