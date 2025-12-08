import React from 'react';

const Sidebar = ({ groups, selectedGroup, onSelectGroup, onOpenModal }) => {
  // Get initials from group name
  const getInitials = (name) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Pocket Notes</h1>
      </div>

      <div className="groups-list-container">
        {groups.length === 0 ? (
          <div className="empty-state">
            No groups yet. Click the + button to create one!
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
              onClick={() => onSelectGroup(group.id)}
            >
              <div 
                className="group-avatar" 
                style={{ backgroundColor: group.color }}
              >
                {getInitials(group.name)}
              </div>
              <div className="group-name">{group.name}</div>
            </div>
          ))
        )}
      </div>

      <button className="add-group-btn" onClick={onOpenModal} aria-label="Add new group">
        +
      </button>
    </div>
  );
};

export default Sidebar;
