import React, { useState, useEffect, useMemo, useRef } from 'react';
import { apiService } from '../services/apiService.js';
import { PlusIcon, SearchIcon, DownloadIcon, UploadIcon, LogoutIcon } from './icons.jsx';
import RegisterModal from './modals/RegisterModal.jsx';
import DetailsModal from './modals/DetailsModal.jsx';

const LetterApp = ({ onLogout, username }) => {
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetJsLoaded, setIsSheetJsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    script.onload = () => setIsSheetJsLoaded(true);
    document.head.appendChild(script);
  }, []);

  const fetchLetters = async () => {
    setIsLoading(true);
    try {
      let data = await apiService.getLetters();
      const sortedData = [...data].sort((a, b) => {
          if (a.number !== b.number) return b.number - a.number;
          if (a.isCancelled !== b.isCancelled) return a.isCancelled ? 1 : -1;
          return new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime();
      });
      setLetters(sortedData);
    } catch (error) {
      console.error("Failed to fetch letters:", error);
      alert("Could not load letters. Your session might have expired. Please log in again.");
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const formatDateForDisplay = (ds) => new Date(ds).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (ds) => new Date(ds).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const filteredLetters = useMemo(() => {
    if (!searchTerm) return letters;
    const lowercasedFilter = searchTerm.toLowerCase();
    return letters.filter(letter => {
      const formattedDate = formatDateForDisplay(letter.registered_at);
      return letter.number.toString().includes(lowercasedFilter) ||
             letter.subject.toLowerCase().includes(lowercasedFilter) ||
             letter.addressee.toLowerCase().includes(lowercasedFilter) ||
             formattedDate.includes(lowercasedFilter);
    });
  }, [searchTerm, letters]);

  const handleRegister = async (subject, addressee) => {
    setIsProcessing(true);
    try {
      await apiService.registerNewLetter(subject, addressee);
      await fetchLetters();
    } catch (error) { console.error("Failed to register letter:", error); alert(`Error: ${error.message}`); } 
    finally {
      setIsProcessing(false);
      setShowRegisterModal(false);
    }
  };

  const handleCancelLetter = async (letterId) => {
    setIsProcessing(true);
    try {
      await apiService.cancelLetter(letterId);
      await fetchLetters();
    } catch(error) { console.error("Failed to cancel letter:", error); alert(`Error: ${error.message}`); } 
    finally {
      setIsProcessing(false);
      setSelectedLetter(null);
    }
  };

  const handleRestoreLetter = async (letterId) => {
    setIsProcessing(true);
    try {
      await apiService.restoreLetter(letterId);
      await fetchLetters();
    } catch (error) {
      console.error("Failed to restore letter:", error);
      alert(`Could not restore letter. ${error.message}`);
    } finally {
      setIsProcessing(false);
      setSelectedLetter(null);
    }
  };

  const handleExport = () => { /* ... */ };
  const handleFileUpload = (event) => { /* ... */ };

  return (
    <div className="bg-slate-100 font-sans text-slate-800 h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-full">
        <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-300">
          <div><h1 className="text-3xl font-bold text-slate-900">Letter Registration</h1><p className="text-slate-600 mt-1">Welcome, {username}!</p></div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={!isSheetJsLoaded} className="flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400"><UploadIcon /><span className="ml-2 hidden sm:inline">Import</span></button>
            <button onClick={handleExport} disabled={!isSheetJsLoaded} className="flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400"><DownloadIcon /><span className="ml-2 hidden sm:inline">Export</span></button>
            <button onClick={() => setShowRegisterModal(true)} className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"><PlusIcon /><span className="ml-2 hidden sm:inline">Register New</span></button>
            <button onClick={onLogout} className="flex items-center justify-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700"><LogoutIcon /><span className="ml-2 hidden sm:inline">Logout</span></button>
          </div>
        </header>
        <div className="mb-6 flex-shrink-0"><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div><input type="text" placeholder="Search by number, date, addressee, or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div></div>
        <main className="flex-grow overflow-y-auto"><h2 className="text-xl font-semibold text-slate-700 mb-4">Registration History</h2>{isLoading ? <p className="text-center text-slate-500 py-10">Loading history...</p> : (<div className="bg-white rounded-xl shadow-sm overflow-hidden"><ul className="divide-y divide-slate-200">{filteredLetters.length > 0 ? filteredLetters.map(letter => (<li key={letter.id} onClick={() => setSelectedLetter(letter)} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center transition-colors duration-150 cursor-pointer ${letter.isCancelled ? 'bg-red-50 text-gray-500 hover:bg-red-100' : 'hover:bg-slate-50'}`}><div className={`flex-grow mb-3 sm:mb-0 ${letter.isCancelled ? 'line-through' : ''}`}><div className="flex items-baseline flex-wrap"><p className="font-bold text-slate-900 mr-2">No. {letter.number}</p><p className="mr-2">dated {formatDateForDisplay(letter.registered_at)}</p><p className="font-semibold mr-2">- {letter.addressee}</p></div><p className="mt-1">- {letter.subject}</p></div><div className="text-sm text-left sm:text-right flex-shrink-0"><p>by: <strong>{letter.registered_by_username}</strong></p><p>at: {formatTime(letter.registered_at)}</p></div></li>)) : <p className="text-center text-slate-500 p-10">No letters found.</p>}</ul></div>)}</main>
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} onRegister={handleRegister} isProcessing={isProcessing} />}
        {selectedLetter && <DetailsModal letter={selectedLetter} letters={letters} onClose={() => setSelectedLetter(null)} onCancel={handleCancelLetter} onRestore={handleRestoreLetter} isProcessing={isProcessing} formatDateForDisplay={formatDateForDisplay} formatTime={formatTime} />}
      </div>
    </div>
  );
};

export default LetterApp;