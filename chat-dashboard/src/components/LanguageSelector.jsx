import React, { useState, useRef, useEffect } from 'react';
import { FiGlobe } from 'react-icons/fi';
import './LanguageSelector.css';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'cs', name: 'Czech' },
  { code: 'sv', name: 'Swedish' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLanguageName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';

  return (
    <div className="language-selector-container" ref={dropdownRef}>
      <button
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language"
      >
        <FiGlobe size={18} />
        <span>{selectedLanguageName}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="language-search">
            <input
              type="text"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="language-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <span>{lang.name}</span>
                  {selectedLanguage === lang.code && <span className="checkmark">✓</span>}
                </button>
              ))
            ) : (
              <div className="no-results">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

