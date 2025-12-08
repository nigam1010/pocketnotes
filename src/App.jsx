import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NotesArea from './components/NotesArea';
import CreateGroupModal from './components/CreateGroupModal';
import './styles/main.css';
import './styles/sidebar.css';
import './styles/notes.css';
import './styles/modal.css';
import './styles/responsive.css';

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showNotesOnMobile, setShowNotesOnMobile] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowNotesOnMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load groups from localStorage on mount
  useEffect(() => {
    const storedGroups = localStorage.getItem('pocketNotesGroups');
    if (storedGroups) {
      try {
        const parsedGroups = JSON.parse(storedGroups);
        setGroups(parsedGroups);
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    }
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('pocketNotesGroups', JSON.stringify(groups));
    }
  }, [groups]);

  // Handle group creation
  const handleCreateGroup = (groupData) => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupData.name,
      color: groupData.color,
      notes: [],
      createdAt: new Date().toISOString()
    };
    
    setGroups([...groups, newGroup]);
    setIsModalOpen(false);
  };

  // Handle group selection
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    if (isMobileView) {
      setShowNotesOnMobile(true);
    }
  };

  const handleBackToGroups = () => {
    setShowNotesOnMobile(false);
  };

  // Handle adding note to selected group
  const handleAddNote = (noteText) => {
    if (!selectedGroup || !noteText.trim()) return;

    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroup) {
        const newNote = {
          id: Date.now().toString(),
          text: noteText.trim(),
          createdAt: new Date().toISOString()
        };
        
        return {
          ...group,
          notes: [...group.notes, newNote]
        };
      }
      return group;
    });

    setGroups(updatedGroups);
  };

  // Get selected group data
  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  return (
    <div className="app-container">
      {(!isMobileView || !showNotesOnMobile) && (
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={handleSelectGroup}
          onOpenModal={() => setIsModalOpen(true)}
        />
      )}
      
      {(!isMobileView || showNotesOnMobile) && (
        <NotesArea
          group={selectedGroupData}
          onAddNote={handleAddNote}
          onBack={isMobileView ? handleBackToGroups : null}
        />
      )}

      {isModalOpen && (
        <CreateGroupModal
          groups={groups}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}

export default App;
