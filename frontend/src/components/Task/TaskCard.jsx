import React from 'react';
import { 
  GripVertical,
  Clock,
  MessageSquare,
  FileText,
  CheckCircle,
  Bot
} from "lucide-react";
import { isPast, isToday, isFuture } from "date-fns";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onClick, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getDueDateStatus = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Overdue' };
    if (isToday(date)) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Today' };
    if (isFuture(date)) return { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Upcoming' };
    return { color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' };
  };

  const dueStatus = getDueDateStatus(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-2 mb-2">
        <button 
          {...attributes} 
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{task.priority}</span>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
            {task.title}
          </h4>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 ml-6 mb-3">{task.description}</p>
      
        <div className="flex items-center justify-between ml-6">
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee, idx) => (
            <img 
              key={idx} 
              src={assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name || 'U')}&background=6366f1&color=fff&size=64`}
              alt={assignee.name || 'Assignee'} 
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 object-cover" 
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-xs text-gray-500">+{task.assignees.length - 3}</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${dueStatus.bg} ${dueStatus.color}`}>
          <Clock className="w-3 h-3" />
          {dueStatus.label}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 ml-6">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MessageSquare className="w-3 h-3" />
          {task.comments || 0}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <FileText className="w-3 h-3" />
          {task.attachments || 0}
        </div>
        <div className="flex flex-wrap gap-1 ml-auto items-center">
          {/* AI submission status badges */}
          {task.validationStatus === 'approved' && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-semibold">
              <CheckCircle className="w-3 h-3" /> AI Passed
            </span>
          )}
          {task.validationStatus === 'pending' && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs rounded-full font-semibold">
              <Bot className="w-3 h-3" /> Review
            </span>
          )}
          {task.tags?.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx} 
              className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
