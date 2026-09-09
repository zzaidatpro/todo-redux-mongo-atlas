import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice';

export function AddTask() {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() !== '') {
      dispatch(addTask({ title: title.trim() }));
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto my-4">
      <input
        type="text"
        placeholder="Nouvelle tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter
      </button>
    </form>
  );
}

export default AddTask;
