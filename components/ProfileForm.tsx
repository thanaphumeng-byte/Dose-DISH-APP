import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User } from 'lucide-react';

interface ProfileFormProps {
  currentProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  texts: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ currentProfile, onSave, texts }) => {
  const [formData, setFormData] = useState<UserProfile>(
    currentProfile || {
      name: '',
      age: 0,
      conditions: '',
      medications: '',
      allergies: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-teal-50 rounded-full">
          <User className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{texts.title}</h2>
          <p className="text-slate-500 text-sm">{texts.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{texts.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder={texts.placeholderName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{texts.age}</label>
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="45"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{texts.conditions}</label>
          <textarea
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            rows={2}
            placeholder={texts.placeholderConditions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{texts.meds}</label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            rows={3}
            placeholder={texts.placeholderMeds}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{texts.allergies}</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            placeholder={texts.placeholderAllergies}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6"
        >
          <Save className="w-5 h-5" />
          {texts.save}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;