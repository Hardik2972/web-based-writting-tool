import React, { useState } from 'react';
import { Button } from 'antd';
import Block from './components/block';
import { v4 as uuidv4 } from 'uuid';
import CreateArea from './components/createArea';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [buttonState, setButtonState] = useState(1);

  const addBlock = (data) => {
    const newBlock = {
      id: uuidv4(),
      type: data.type,
      content: data.content,
    };
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const addNote = (newNote) => {
    const data = {
      type: 'text',
      content: newNote,
    };
    addBlock(data);
    setButtonState(1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const data = {
      type: 'image',
      content: URL.createObjectURL(file),
    };
    addBlock(data);
    setButtonState(1);
  };

  const editBlock = (id, editedContent) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id
        ? block.type === 'text'
          ? { ...block, content: editedContent }
          : { ...block, content: URL.createObjectURL(editedContent) }
        : block
    );
    setBlocks(updatedBlocks);
  };

  return (
    <div className="container">
      <div className="p-4 m-4 rounded shadow-md relative flex justify-center">
        {buttonState === 1 ? (
          <div className="w-full">
            <Button type="primary" className="bg-gray-700 w-full" onClick={() => setButtonState(2)}>
              Add Block
            </Button>
          </div>
        ) : buttonState === 2 ? (
          <div className="flex space-x-4 w-full">
            <Button type="primary" className="bg-gray-700 w-1/2" onClick={() => setButtonState(3)}>
              Add Text
            </Button>
            <Button type="primary" className="bg-gray-700 w-1/2">
              <label htmlFor="fileInput" className="cursor-pointer w-full">
                <span>Upload</span>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden w-full"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <CreateArea onAdd={addNote} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {blocks.map((block) => (
          <Block key={block.id} id={block.id} type={block.type} content={block.content} onEdit={editBlock} />
        ))}
      </div>
    </div>
  );
}

export default App;
