import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTaskStatus, deleteTask, updateTask } from '../redux/taskSlice';

export function Task({ task }) {
  const dispatch = useDispatch();

  const isCompleted = task.status === 'terminée';

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.title || '');

  const handleToggle = () => {
    dispatch(toggleTaskStatus({ id: task._id, currentStatus: task.status }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  const handleSave = () => {
    if (newText.trim() !== '' && newText.trim() !== task.title) {
      dispatch(updateTask({ id: task._id, title: newText.trim() }));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewText(task.title || '');
    setIsEditing(false);
  };
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
      isCompleted 
        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70' 
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      
      {/* SECTION GAUCHE : Case à cocher + Texte ou Champ de saisie */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-blue-500 cursor-pointer"
        />

        {isEditing ? (
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            autoFocus
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-blue-400 dark:border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className={`text-sm truncate select-none ${
            isCompleted 
              ? 'line-through text-slate-400 dark:text-slate-500' 
              : 'text-slate-800 dark:text-slate-200 font-medium'
          }`}>
            {task.title}
          </span>
        )}
      </div>

      {/* SECTION DROITE : Boutons d'action */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isEditing ? (
          <>
            <button 
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 text-xs font-medium text-white bg-green-600 dark:bg-green-500 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer"
            >
              Enregistrer
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 dark:bg-rose-500 rounded hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Supprimer
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              Modifier
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 rounded hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Task;