import { useState } from 'react';
import { Folder, FileText, Sparkles, Search, Upload, Plus, Trash2, BookOpen } from 'lucide-react';
import { ClassNote, NoteFolder } from '../utils/mockData';
import { callOpenAISummarizer } from '../utils/openai';

interface NotesSummarizerProps {
  folders: NoteFolder[];
  notes: ClassNote[];
  onAddNote: (note: ClassNote) => void;
  onDeleteNote: (noteId: string) => void;
  onAddFolder: (folder: NoteFolder) => void;
}

export default function NotesSummarizer({
  folders,
  notes,
  onAddNote,
  onDeleteNote,
  onAddFolder
}: NotesSummarizerProps) {
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<ClassNote | null>(notes[0] || null);
  const [searchText, setSearchText] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  // Note creator state
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteFolderId, setNewNoteFolderId] = useState(folders[0]?.id || 'f1');
  const [newNoteTags, setNewNoteTags] = useState('Biology, Science');

  // AI summarizing state
  const [summarizing, setSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'summary' | 'points' | 'flashcards' | 'mcq'>('content');

  // Highlights state
  const [highlights, setHighlights] = useState<string[]>([]);

  // Simulation upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newFolder: NoteFolder = {
      id: 'f_' + Date.now(),
      name: newFolderName,
      notesCount: 0
    };
    onAddFolder(newFolder);
    setNewFolderName('');
    setShowAddFolder(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const createdNote: ClassNote = {
      id: 'n_' + Date.now(),
      title: newNoteTitle,
      folderId: newNoteFolderId,
      content: newNoteContent,
      tags: newNoteTags.split(',').map(t => t.trim()),
      createdAt: new Date().toISOString().split('T')[0],
      wordCount: newNoteContent.split(/\s+/).length
    };

    onAddNote(createdNote);
    setSelectedNote(createdNote);
    setIsCreatingNote(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setActiveTab('content');
  };

  // Run AI Summarization on selected note
  const handleAISummarize = async () => {
    if (!selectedNote) return;
    setSummarizing(true);
    try {
      const results = await callOpenAISummarizer(selectedNote.title, selectedNote.content);
      
      const updatedNote: ClassNote = {
        ...selectedNote,
        summary: results.summary,
        keyPoints: results.keyPoints,
        flashcards: results.flashcards
      };

      // Update active selected note
      setSelectedNote(updatedNote);
      setActiveTab('summary');
    } catch (e) {
      alert("Error summarizing notes. Using smart educational fallback summaries.");
    } finally {
      setSummarizing(false);
    }
  };

  // Highlight word or sentence
  const handleTextHighlight = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 3) {
      if (!highlights.includes(selectedText)) {
        setHighlights([...highlights, selectedText.trim()]);
      }
    }
  };

  // Preloaded simulation notes for instant file upload testing
  const simLectures = [
    { title: "Calculus_Derivatives_Masterclass.pdf", size: "2.4 MB", words: 850, text: "Calculus concerns limits, functions, derivatives, integrals, and infinite series. The fundamental derivative rate-of-change formula is f'(x) = lim(h->0) [f(x+h) - f(x)] / h. This determines instantaneous tangents of curves." },
    { title: "World_War_II_Global_Treaties.docx", size: "1.1 MB", words: 1200, text: "World War II was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries forming two opposing military alliances: the Allies and the Axis. Dynamic treaty bounds re-mapped empires." },
    { title: "Neuroscience_Synaptic_Plasticty.txt", size: "540 KB", words: 640, text: "Synaptic plasticity is the ability of synapses to strengthen or weaken over time, in response to increases or decreases in their activity. It is the molecular foundation of both learning and active memory recall structures." }
  ];

  const handleSimulateUpload = (lecture: typeof simLectures[0]) => {
    setUploadedFileName(lecture.title);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev !== null && prev >= 100) {
          clearInterval(interval);
          
          // Complete upload, inject as a new note automatically!
          const newUploadedNote: ClassNote = {
            id: 'n_' + Date.now(),
            title: `Parsed - ${lecture.title.replace(/\.[^/.]+$/, "")}`,
            folderId: 'f1', // general bio/other
            content: lecture.text,
            tags: ['Uploaded', 'PDF', 'Document'],
            createdAt: new Date().toISOString().split('T')[0],
            wordCount: lecture.words
          };

          onAddNote(newUploadedNote);
          setSelectedNote(newUploadedNote);
          setUploadProgress(null);
          setUploadedFileName('');
          setActiveTab('content');
          return 100;
        }
        return (prev || 0) + 20;
      });
    }, 200);
  };

  // Filters notes based on folder and search text
  const filteredNotes = notes.filter((n) => {
    const matchesFolder = activeFolderId === 'all' || n.folderId === activeFolderId;
    const matchesSearch = n.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchText.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] overflow-hidden">
      
      {/* 1. Leftmost column: Folders and Note catalog lists */}
      <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 overflow-y-auto flex flex-col gap-5 h-full">
        
        {/* Folders block */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            <span>Folders</span>
            <button 
              onClick={() => setShowAddFolder(!showAddFolder)} 
              className="text-violet-400 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {showAddFolder && (
            <form onSubmit={handleCreateFolder} className="mb-2 flex gap-1">
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-800 bg-slate-950 px-2 py-1 text-slate-100 focus:outline-none"
              />
              <button type="submit" className="bg-violet-600 rounded px-2.5 text-xs text-white hover:bg-violet-500">
                Add
              </button>
            </form>
          )}

          <div className="space-y-1">
            <button
              onClick={() => setActiveFolderId('all')}
              className={`w-full flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
                activeFolderId === 'all' ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="h-3.5 w-3.5" /> All Notes
              </span>
              <span className="text-[10px] bg-slate-950 text-slate-500 px-1.5 rounded">{notes.length}</span>
            </button>

            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`w-full flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
                  activeFolderId === f.id ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Folder className="h-3.5 w-3.5" /> {f.name}
                </span>
                <span className="text-[10px] bg-slate-950 text-slate-500 px-1.5 rounded">
                  {notes.filter(n => n.folderId === f.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Search bar */}
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Instant note search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-7 pr-2 text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Notes catalog directory */}
        <div className="flex-1 space-y-1.5 min-h-[150px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span>Documents Directory</span>
            <button 
              onClick={() => setIsCreatingNote(true)} 
              className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> New Note
            </button>
          </div>

          {filteredNotes.length === 0 ? (
            <p className="text-[11px] text-slate-500 text-center italic py-4">No notes found matching search scope.</p>
          ) : (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setSelectedNote(n);
                  setIsCreatingNote(false);
                  setActiveTab('content');
                }}
                className={`group rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                  selectedNote?.id === n.id 
                    ? 'bg-violet-600/10 border-violet-500/40' 
                    : 'bg-slate-950/20 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate max-w-[85%]">
                    {n.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(n.id);
                      if (selectedNote?.id === n.id) setSelectedNote(null);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-rose-500 hover:bg-rose-500/15 transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[9px] text-slate-500">{n.wordCount} words</span>
                  {n.summary && (
                    <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-400 border border-emerald-500/20">
                      Summary
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drag & Drop Simulation area */}
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-3 text-center">
          <Upload className="h-5 w-5 text-slate-500 mx-auto mb-1.5" />
          <p className="text-[10px] font-bold text-slate-300">Class PDF / Notes Upload</p>
          <p className="text-[8px] text-slate-500 mt-0.5">Simulate parsing high-quality materials:</p>
          
          <div className="mt-2.5 space-y-1">
            {simLectures.map((lec, i) => (
              <button
                key={i}
                disabled={uploadProgress !== null}
                onClick={() => handleSimulateUpload(lec)}
                className="w-full text-left text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-850 p-1.5 rounded truncate flex items-center justify-between text-slate-400 cursor-pointer hover:text-white"
              >
                <span className="truncate">📄 {lec.title}</span>
                <span className="text-[8px] text-slate-500 text-right shrink-0">{lec.size}</span>
              </button>
            ))}
          </div>

          {uploadProgress !== null && (
            <div className="mt-2.5 bg-slate-900 p-2 rounded border border-slate-800">
              <p className="text-[8px] text-violet-400 font-bold mb-1">Parsing {uploadedFileName} ({uploadProgress}%)</p>
              <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Right columns (3/4 width): Large Note editor and AI results */}
      <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col overflow-hidden h-full">
        
        {isCreatingNote ? (
          /* Creating Note UI Form */
          <form onSubmit={handleCreateNote} className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Custom Class Note</h3>
              <button
                type="button"
                onClick={() => setIsCreatingNote(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cellular respiration processes..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Folder</label>
                <select
                  value={newNoteFolderId}
                  onChange={(e) => setNewNoteFolderId(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-300 focus:outline-none"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g., Biology, Photosynthesis, Chapter 2"
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Class Lecture / Notes Content</label>
              <textarea
                required
                rows={10}
                placeholder="Paste your lecture PowerPoint text, study guide, web content, or transcript details here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-violet-900/25"
            >
              Create Class Note & Save to Folder
            </button>
          </form>
        ) : selectedNote ? (
          /* Main Note Viewer with AI Summarizer Tabs */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top Toolbar: Tabs and AI Summarize button */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'content' 
                      ? 'bg-slate-950 border-slate-850 text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Original Content
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'summary' 
                      ? 'bg-slate-950 border-slate-850 text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📖 Executive Summary
                </button>
                <button
                  onClick={() => setActiveTab('points')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'points' 
                      ? 'bg-slate-950 border-slate-850 text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔑 Key Takeaways
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'flashcards' 
                      ? 'bg-slate-950 border-slate-850 text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎴 Flashcards
                </button>
              </div>

              {/* Core Feature: AI Summarize Button */}
              <button
                onClick={handleAISummarize}
                disabled={summarizing}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 px-3.5 py-1.5 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {summarizing ? 'AI Summarizing...' : 'Summarize Notes'}
              </button>
            </div>

            {/* Note Detail Panel (Scrollable content) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-black text-white">{selectedNote.title}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-medium">Created: {selectedNote.createdAt}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500 font-medium">{selectedNote.wordCount} words</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {selectedNote.tags.map((tag, idx) => (
                    <span key={idx} className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[9px] font-bold text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Content Render Box based on Active Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Highlighting Instruction Box */}
                  <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80 text-[10px] text-slate-400">
                    💡 <span className="font-semibold text-violet-400">Study Trick:</span> Drag your mouse pointer to select text inside this note to highlight important statements instantly.
                  </div>

                  {/* Original Text body */}
                  <div 
                    onMouseUp={handleTextHighlight}
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text selection:bg-amber-500/30 selection:text-white"
                  >
                    {selectedNote.content}
                  </div>

                  {/* Highlights container */}
                  {highlights.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your Study Highlights</span>
                      <div className="mt-2 space-y-1.5">
                        {highlights.map((hl, i) => (
                          <div key={i} className="rounded-lg bg-amber-500/10 border-l-2 border-amber-500 p-2 text-xs text-amber-200">
                            "{hl}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> AI Generated Summary Chapter
                    </h3>
                    
                    {selectedNote.summary ? (
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedNote.summary}
                      </p>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-slate-500 italic mb-3">No summary has been generated for this note yet.</p>
                        <button
                          onClick={handleAISummarize}
                          className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 text-xs text-slate-300 font-bold"
                        >
                          Generate AI Executive Summary
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'points' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Takeaways Extracted</h3>
                  
                  {selectedNote.keyPoints && selectedNote.keyPoints.length > 0 ? (
                    <div className="space-y-2">
                      {selectedNote.keyPoints.map((pt, i) => (
                        <div key={i} className="flex gap-2.5 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-violet-400 text-[10px] font-bold border border-violet-500/20">
                            {i + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200">{pt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-500 italic mb-3">No key takeaways extracted yet.</p>
                      <button
                        onClick={handleAISummarize}
                        className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 text-xs text-slate-300 font-bold"
                      >
                        Extract Key Points
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'flashcards' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interactive Flashcards</h3>

                  {selectedNote.flashcards && selectedNote.flashcards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedNote.flashcards.map((fc, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5 flex flex-col justify-between group">
                          <div>
                            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wide">Question {i + 1}</span>
                            <p className="text-xs font-semibold text-white mt-1 leading-relaxed">{fc.question}</p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Answer Reveal</span>
                            <p className="text-xs text-emerald-400 mt-1 leading-relaxed">{fc.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-500 italic mb-3">No flashcards have been built for this note yet.</p>
                      <button
                        onClick={handleAISummarize}
                        className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 text-xs text-slate-300 font-bold"
                      >
                        Generate Active Recall Flashcards
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Empty note list */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
            <FileText className="h-10 w-10 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-400">No notes in workspace.</p>
            <p className="text-xs text-slate-600 max-w-xs mt-1">
              Select or create a class note, or drag simulated files on the left to start analyzing concepts.
            </p>
            <button
              onClick={() => setIsCreatingNote(true)}
              className="mt-4 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              Write First Note
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
