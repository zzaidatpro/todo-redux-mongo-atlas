import { AddTask } from './component/AddTask';
import { ListTask } from './component/ListTask';
import { ThemeToggle } from './component/ThemeToggle';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Ma Liste de Tâches <span className="text-blue-600 dark:text-blue-400 font-extrabold">(Redux)</span>
          </h1>
          <ThemeToggle />
        </div>

        <AddTask />
        <ListTask />
      </div>
    </div>
  );
}
