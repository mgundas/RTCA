import React from "react";

export default function JoinForm({roomIdRef, setNickname, roomPassRef, setRoomId, handleSubmit, setRoomPassForm}) {
  return (
    <div className="grid gap-2">
      <input
        className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
        placeholder="Nickname"
        onKeyDown={(event) => {
          event.key === "Enter" && roomIdRef.current.focus();
        }}
        onChange={(e) => setNickname(e.target.value)}
      />

      <input
        ref={roomIdRef}
        className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
        placeholder="Room ID"
        onKeyDown={(event) => {
          event.key === "Enter" && roomPassRef.current.focus();
        }}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <input
        type="password"
        ref={roomPassRef}
        className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
        placeholder="Room Password (Optional)"
        onKeyDown={(event) => {
          event.key === "Enter" && handleSubmit();
        }}
        onChange={(e) => setRoomPassForm(e.target.value)}
      />

      <button
        className="p-2 focus-visible:outline-none focus:ring-4 focus:ring-blue-800 transition bg-blue-700 rounded-md hover:bg-blue-800"
        onClick={handleSubmit}
      >
        Join
      </button>
    </div>
  );
}
