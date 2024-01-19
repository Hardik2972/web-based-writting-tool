import React, { useState, useRef } from "react";
import { Button } from "antd";
import JoditEditor from 'jodit-react';

function CreateArea(props) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const maxWordCount = 250;

  const handleSubmit = () => {
    props.onAdd(content);
  };

  const handleContentChange = (newContent) => {
    const words = newContent.replace(/<[^>]*>/g, '').match(/\S+/g) || [];
    const currentWordCount = words.length;
    if (currentWordCount > maxWordCount) {
      const trimmedContent = words.slice(0, maxWordCount).join(' ');
      setContent(trimmedContent);
    } else {
      setContent(newContent);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 rounded shadow-lg mt-8 bg-white">
      <div className="mb-4">
        <JoditEditor
          ref={editor}
          value={content}
          className="text-black border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
          onChange={handleContentChange}
        />
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Add
      </Button>
    </div>
  );
}

export default CreateArea;
