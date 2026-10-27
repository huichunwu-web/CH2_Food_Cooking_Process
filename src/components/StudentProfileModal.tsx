import React, { useState } from 'react';
import { User, Hash, X, Check, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSave: (id: string, name: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  onSave,
}) => {
  const [localId, setLocalId] = useState(studentId);
  const [localName, setLocalName] = useState(studentName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localId.trim()) {
      setError('請輸入學生學號');
      return;
    }
    if (!localName.trim()) {
      setError('請輸入學生姓名');
      return;
    }
    soundManager.playCorrect();
    onSave(localId.trim(), localName.trim());
    onClose();
  };

  const handleUsePreset = (id: string, name: string) => {
    setLocalId(id);
    setLocalName(name);
    setError('');
    soundManager.playFlip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">設定學生學籍資料</h3>
              <p className="text-xs text-slate-500">成效紀錄、測驗證明與 PDF 輸出專用</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              學生學號 (Student ID) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localId}
                onChange={(e) => {
                  setLocalId(e.target.value);
                  setError('');
                }}
                placeholder="例如：113402018 或 S10932001"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              學生姓名 (Student Name) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localName}
                onChange={(e) => {
                  setLocalName(e.target.value);
                  setError('');
                }}
                placeholder="例如：陳大明"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-1.5">快速代入示範資料：</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleUsePreset('CUL-11301', '林書豪')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded border border-slate-200 transition-colors"
              >
                林書豪 (CUL-11301)
              </button>
              <button
                type="button"
                onClick={() => handleUsePreset('CUL-11302', '張雅婷')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded border border-slate-200 transition-colors"
              >
                張雅婷 (CUL-11302)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              儲存學籍資料
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
