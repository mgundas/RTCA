import React from "react";

export default function CreateRoomModal({ modalRef, setModalVisible, setRoomName, modalRoomPassRef, roomPass, setRoomPass, roomName, handleCreateRoom}) {
  return (
    <div
      ref={modalRef}
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
    >
      <div className="relative w-full h-full max-w-2xl md:h-auto">
        <div className="relative rounded-lg shadow bg-gray-700">
          <div className="flex items-start justify-between p-3 border-b rounded-t border-gray-600">
            <h3 className="text-xl font-semibold text-white">Create a Room</h3>
            <button
              onClick={() => setModalVisible(false)}
              type="button"
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 grid gap-2">
            <label>Room Name: *required*</label>
            <input
              value={roomName}
              className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
              placeholder="Room Name"
              onKeyDown={(event) => {
                event.key === "Enter" && modalRoomPassRef.current.focus();
              }}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength="15"
              required
            />
            <label>Room Password: *optional*</label>
            <input
              value={roomPass}
              ref={modalRoomPassRef}
              className="p-2 focus-visible:outline-none focus:ring-4 transition text-black text-md rounded-md"
              placeholder="Password (Optional)"
              onKeyDown={(event) => {
                event.key === "Enter" && handleCreateRoom();
              }}
              onChange={(e) => setRoomPass(e.target.value)}
              maxLength="15"
            />
          </div>
          <div className="flex items-center p-3 space-x-2 border-t rounded-b border-gray-600">
            <button
              onClick={handleCreateRoom}
              type="button"
              className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              Create Room
            </button>
            <button
              onClick={() => setModalVisible(false)}
              type="button"
              className="focus:ring-4 focus:outline-none  rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
