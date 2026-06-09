import React, { useState, useRef, useEffect } from 'react';
import { Search, LayoutGrid, List, Plus, ChevronDown, X } from "lucide-react";

const Dropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...",
  renderOption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 min-w-[140px] rounded-lg text-sm border transition-all ${
          value 
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500'
        }`}
      >
        <span className="truncate">
          {selectedOption ? renderOption(selectedOption) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {value && (
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                value === option.value 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {renderOption(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TaskHeader = ({
  taskStats,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  selectedProject,
  setSelectedProject,
  projects,
  viewMode,
  setViewMode,
  onNewTask,
  isAdmin
}) => {
  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const projectOptions = projects.map(project => ({
    value: project._id.toString(),
    label: project.title,
  }));

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and track all your tasks in one place
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg">
              <span className="text-white font-bold">{taskStats.total}</span>
              <span className="text-white text-sm ml-1 font-bold">Total</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold">{taskStats.inProgress}</span>
              <span className="text-white text-sm ml-1 font-bold">Active</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold">{taskStats.done}</span>
              <span className="text-white text-sm ml-1 font-bold">Done</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            {/* Priority Dropdown */}
            <Dropdown
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
              placeholder="All Priorities"
              renderOption={(option) => (
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    option.value === 'high' ? 'bg-red-500' :
                    option.value === 'medium' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}></span>
                  {option.label}
                </span>
              )}
            />

            {/* Project Dropdown */}
            <Dropdown
              value={selectedProject}
              onChange={setSelectedProject}
              options={projectOptions}
              placeholder="All Projects"
              renderOption={(option) => (
                <span className="truncate">{option.label}</span>
              )}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'board'
                    ? "bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? "bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {isAdmin && (
              <button
                onClick={() => onNewTask('todo')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
