import { Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const TaskColumn = ({ column, tasks, onTaskClick, onEditTask, onAddTask }) => {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2"
        style={{ borderColor: column.color }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }}></div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100">{column.title}</h3>
        <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-medium">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onClick={() => onTaskClick(task)}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
        <button 
          onClick={() => onAddTask(column.id)}
          className="w-full p-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;
