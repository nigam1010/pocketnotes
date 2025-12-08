import React, { useState, useEffect, useRef } from 'react';

const CreateGroupModal = ({ groups, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  const colors = [
    '#B38BFA',
    '#FF79F2',
    '#43E6FC',
    '#F19576',
    '#0047FF',
    '#6691FF'
  ];

  useEffect(() => {
    // Set default color
    if (!selectedColor && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const trimmedName = groupName.trim();

    if (!trimmedName) {
      setError('Group name is required');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Group name must be at least 2 characters long');
      return;
    }

    // Check for duplicate group names (case-insensitive)
    const isDuplicate = groups.some(
      group => group.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError('A group with this name already exists');
      return;
    }

    if (!selectedColor) {
      setError('Please select a color');
      return;
    }

    // Create group
    onCreate({
      name: trimmedName,
      color: selectedColor
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2 className="modal-header">Create New group</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="group-name">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              className={`form-input ${error && !groupName.trim() ? 'error' : ''}`}
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError('');
              }}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Choose colour</label>
            <div className="color-selector">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select color ${color}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedColor(color);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
