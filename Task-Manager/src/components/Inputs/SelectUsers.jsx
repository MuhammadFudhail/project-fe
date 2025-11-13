import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';
import toast from 'react-hot-toast';

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(response.data)) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedUsers(selectedUsers);
    setIsModalOpen(false);
  };

  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [isModalOpen, selectedUsers]);

  return (
    <div className="space-y-4 mt-3">
      {/* Tombol Add Members */}
      {selectedUsersAvatars.length === 0 && (
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-400  hover:from-red-700 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-sm" />
          Add Members
        </button>
      )}

      {selectedUsersAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUsersAvatars} maxVisible={3} />
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancel} title="Select Users">
        <div className="space-y-4 h-[60vh] overflow-y-auto p-4 bg-white">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading users...</p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b border-gray-200 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImageUrl || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 accent-red-500 text-red-500 rounded  border-gray-300 focus:ring-red-400"
                />
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 flex justify-end gap-2 border-t border-gray-100">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500 transition-all shadow-sm"
            onClick={handleAssign}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
