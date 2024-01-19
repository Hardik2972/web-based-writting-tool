import React, { useState, useRef } from "react";
import { Button } from 'antd';
import HTMLReactParser from 'html-react-parser';
import JoditEditor from 'jodit-react';

const Block = ({ id, type, content, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editor = useRef(null);
  const [editedContent, setEditedContent] = useState(content);

	
  const handleEditClick = () => {
    setIsEditing(true);
    setIsHovered(false);
  };

  const handleSaveClick = () => {
    onEdit(id, editedContent);
    setIsEditing(false);
  };

  return (
    <div
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === 'text' ? (
        isEditing ? (
          <div>
            <JoditEditor
              ref={editor}
              value={editedContent}
              className="text-black"
              onChange={(e) => setEditedContent(e)}
            />
            <Button type="link" className="save-btn" onClick={handleSaveClick}>
              Save
            </Button>
          </div>
        ) : (
          <div>
            <div className='text-black'>{HTMLReactParser(content)}</div>
            {isHovered && (
              <Button type="link" className="edit-btn" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </div>
        )
      ) : (
        <div>
          {isEditing ? (
            <div>
              <input
                type="file"
                onChange={(e) => setEditedContent(e.target.files[0])}
              />
              <Button type="link" className="save-btn" onClick={handleSaveClick}>
                Save
              </Button>
            </div>
          ) : (
            <img src={content} alt="user uploaded" className="w-full h-auto text-black" />
          )}
          {isHovered && !isEditing && (
            <Button type="link" className="edit-btn" onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Block;
