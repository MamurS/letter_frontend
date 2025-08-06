import React from 'react';
import { Spinner, TrashIcon, RestoreIcon } from '../icons.jsx';

const DetailsModal = ({ letter, letters, onClose, onCancel, onRestore, isProcessing, formatDateForDisplay, formatTime }) => {
  const isNumberReused = letters.some(l => l.number === letter.number && !l.isCancelled);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-2">Letter Details</h3>
        <p className="text-sm text-slate-500 mb-6">No. {letter.number}</p>
        <div className="space-y-3 text-sm">
          <p><strong>Addressee:</strong> {letter.addressee}</p>
          <p><strong>Subject:</strong> {letter.subject}</p>
          <p><strong>Registered by:</strong> {letter.registered_by_username}</p>
          <p><strong>Registered on:</strong> {formatDateForDisplay(letter.registered_at)} at {formatTime(letter.registered_at)}</p>
          {letter.isCancelled && <p className="font-bold text-red-600">This letter is CANCELLED.</p>}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {letter.isCancelled ? (
            <button type="button" onClick={() => onRestore(letter.id)} disabled={isProcessing || isNumberReused} className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
              {isProcessing ? <Spinner /> : <RestoreIcon />}
              <span>{isNumberReused ? 'Number Re-assigned' : 'Restore Letter'}</span>
            </button>
          ) : (
            <button type="button" onClick={() => onCancel(letter.id)} disabled={isProcessing} className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-400">
              {isProcessing ? <Spinner /> : <TrashIcon />}
              <span>Cancel Letter</span>
            </button>
          )}
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;