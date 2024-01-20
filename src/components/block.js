import React, { useState, useRef } from "react";
import { Button } from 'antd';
import HTMLReactParser from 'html-react-parser';
import JoditEditor from 'jodit-react';
import { useDrag, useDrop } from 'react-dnd';

const Block = ({ id, type, content, index, onEdit, onMoveBlock }) => {
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

  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'BLOCK',
    hover: (item, monitor) => {
      if (!editor.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = editor.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Perform the swap
      onMoveBlock(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(editor));

  return (
    <div
      ref={editor}
      className={`block ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === 'text' ? (
        isEditing ? (
          <div>
            <JoditEditor
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
