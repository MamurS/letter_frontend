import React, { useState } from 'react';
import { Spinner } from '../icons.jsx';

const RegisterModal = ({ onClose, onRegister, isProcessing }) => {
  const [newSubject, setNewSubject] = useState("");
  const [newAddressee, setNewAddressee] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newAddressee.trim()) errors.addressee = "Addressee is required.";
    if (!newSubject.trim()) errors.subject = "Subject is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onRegister(newSubject, newAddressee);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">Register a New Letter</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="addressee" className="block text-sm font-medium text-gray-700 mb-1">Addressee</label>
            <input type="text" name="addressee" value={newAddressee} onChange={(e) => setNewAddressee(e.target.value)} className={`shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 ${formErrors.addressee ? 'border-red-500 ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} placeholder="e.g., NAPP or Globex Inc." autoFocus />
            {formErrors.addressee && <p className="mt-1 text-sm text-red-600">{formErrors.addressee}</p>}
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Brief Subject</label>
            <input type="text" name="subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className={`shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 ${formErrors.subject ? 'border-red-500 ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} placeholder="e.g., Contract Renewal" />
            {formErrors.subject && <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>}
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isProcessing} className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
            {isProcessing ? <Spinner /> : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;