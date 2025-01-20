import { useEffect, useState } from 'react';
import { ListPlus, CheckCircle2, Circle, Trash2, Search, Plus } from 'lucide-react';
import { FreeschemaQuery, NORMAL } from './types/freeschema';
import { SchemaQueryListener } from './services/freeschema.service';

interface Todo {
  id: number;
  title: string;
  status: 'pending' | 'completed';
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const query: FreeschemaQuery = {
      type: 'todo',
      name: 'todoList',
      selectors: ['id', 'title', 'status'],
      outputFormat: NORMAL,
      inpage: 10
    };

    const subscription = SchemaQueryListener(query, '').subscribe((data: any) => {
      setTodos(data.items);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now(),
      title: newTodo,
      status: 'pending'
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' }
        : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ListPlus className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          </div>

          {/* Add Todo */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Todo List */}
          <div className="space-y-3">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0"
                >
                  {todo.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <span className={`flex-1 ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                </button>
              </div>
            ))}
            {filteredTodos.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;