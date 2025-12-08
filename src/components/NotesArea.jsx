import React, { useState, useRef, useEffect } from 'react';

const NotesArea = ({ group, onAddNote, onBack }) => {
  const [noteText, setNoteText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [noteText]);

  // Clear input when group changes
  useEffect(() => {
    setNoteText('');
  }, [group]);

  const handleInputChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleSendNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendNote();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get initials from group name
  const getInitials = (name) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  if (!group) {
    return (
      <div className="notes-area">
        <div className="notes-empty-state">
          <div className="empty-state-content">
            <img src="/image.svg" alt="Notes illustration" />
            <h2>Pocket Notes</h2>
            <p>
              Send and receive messages without keeping your phone online.<br />
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone
            </p>
          </div>
          <div className="lock-icon">
            🔒 end-to-end encrypted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-area">
      <div className="notes-header">
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Back to groups">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13L5 8L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div
          className="notes-header-avatar"
          style={{ backgroundColor: group.color }}
        >
          {getInitials(group.name)}
        </div>
        <h2 className="notes-header-title">{group.name}</h2>
      </div>

      <div className="notes-content">
        {group.notes.length === 0 ? (
          <div className="empty-state">
            No notes yet. Start typing below to add your first note!
          </div>
        ) : (
          group.notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-text">{note.text}</div>
              <div className="note-time">
                <span className="note-date">{formatDate(note.createdAt)}</span>
                <span>•</span>
                <span>{formatTime(note.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notes-input-area">
        <div className="notes-input-container">
          <textarea
            ref={textareaRef}
            className="notes-input"
            placeholder="Enter your text here..........."
            value={noteText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button
            className={`send-btn ${noteText.trim() ? 'enabled' : 'disabled'}`}
            onClick={handleSendNote}
            disabled={!noteText.trim()}
            aria-label="Send note"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 12L21 3L12 21L10 14L3 12Z" 
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesArea;
