import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Save, ArrowLeft, Calendar, Clock, MapPin, X } from 'lucide-react';

interface LabGroup {
  id: string;
  name: string;
  day: string;
  time: string;
  room: string;
  studentCount: number;
  students: string[];
}

interface GroupManagementProps {
  onClose: () => void;
}

export default function GroupManagement({ onClose }: GroupManagementProps) {
  const [groups, setGroups] = useState<LabGroup[]>([
    {
      id: '1',
      name: 'Lab Group A',
      day: 'Monday',
      time: '14:00-16:00',
      room: 'LAB-101',
      studentCount: 15,
      students: ['1', '2', '3']
    },
    {
      id: '2',
      name: 'Lab Group B',
      day: 'Tuesday',
      time: '10:00-12:00',
      room: 'LAB-102',
      studentCount: 12,
      students: ['4', '5']
    },
    {
      id: '3',
      name: 'Lab Group C',
      day: 'Wednesday',
      time: '16:00-18:00',
      room: 'LAB-101',
      studentCount: 18,
      students: ['6', '7', '8']
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LabGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    day: 'Monday',
    time: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleCreate = () => {
    const newGroup: LabGroup = {
      id: Date.now().toString(),
      name: formData.name,
      day: formData.day,
      time: formData.time,
      room: formData.room,
      studentCount: 0,
      students: []
    };
    setGroups([...groups, newGroup]);
    setIsCreating(false);
    setFormData({ name: '', day: 'Monday', time: '', room: '' });
  };

  const handleUpdate = () => {
    if (!editingGroup) return;
    setGroups(groups.map(g => 
      g.id === editingGroup.id 
        ? { ...g, ...formData }
        : g
    ));
    setEditingGroup(null);
    setFormData({ name: '', day: 'Monday', time: '', room: '' });
  };

  const handleDelete = (groupId: string) => {
    if (confirm('Are you sure you want to delete this lab group?')) {
      setGroups(groups.filter(g => g.id !== groupId));
    }
  };

  const startEdit = (group: LabGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      day: group.day,
      time: group.time,
      room: group.room
    });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingGroup(null);
    setFormData({ name: '', day: 'Monday', time: '', room: '' });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Lab Groups 📚</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 truncate">Organize students by exercise sessions</p>
        </div>
      </div>

      {/* Create Group Button */}
      {!isCreating && !editingGroup && (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full p-4 sm:p-6 border-2 border-dashed border-[#E5A712] rounded-xl sm:rounded-2xl hover:border-[#D4951A] hover:bg-[#E5A712]/5 transition-all flex items-center justify-center gap-3 text-[#E5A712] font-bold"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">Create New Lab Group</span>
        </button>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingGroup) && (
        <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {isCreating ? 'Create New Group' : 'Edit Group'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-white/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Lab Group A"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Day
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-sm sm:text-base"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 14:00-16:00"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Room
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., LAB-101"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={cancelForm}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={!formData.name || !formData.time || !formData.room}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              {isCreating ? 'Create Group' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Groups List */}
      <div className="space-y-4 sm:space-y-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{group.day}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{group.time}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>Room {group.room}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(group)}
                  className="p-2 text-[#E5A712] hover:bg-[#E5A712]/10 rounded-lg transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border-2 border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600 font-semibold">Students enrolled</span>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{group.studentCount}</p>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-lg hover:shadow-lg transition-all font-bold text-sm">
                  View Students
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !isCreating && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg text-gray-500">No lab groups yet. Create your first group to get started.</p>
        </div>
      )}

      {/* Done Button */}
      <div className="flex justify-end pt-6 border-t-2 border-gray-200">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
