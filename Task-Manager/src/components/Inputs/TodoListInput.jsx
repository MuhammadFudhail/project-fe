import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2"

const TodoListInput = ({ todoList = [], setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      // tambahkan objek jika backend pakai objek
      setTodoList([...todoList, { text: option.trim(), completed: false }]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="space-y-2">
      {todoList.length > 0 ? (
        todoList.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 ml-2"
          >
            <p className="text-xs text-black flex">
              <span className="text-xs text-gray-400 font-semibold mr-2">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              {typeof item === "string" ? item : item.text}
            </p>
            <button
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-xs ml-2">No tasks yet</p>
      )}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};



export default TodoListInput
