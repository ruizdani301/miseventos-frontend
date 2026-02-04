import React, { useState } from 'react';
import { UserPlus, Edit, Trash2, Shield, Mail, User, Save, X } from 'lucide-react';

interface UserRole {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Moderator' | 'User';
}

const Roles: React.FC = () => {
    const [users, setUsers] = useState<UserRole[]>([
        { id: '1', name: 'Admin Principal', email: 'admin@miseventos.com', role: 'Admin' },
        { id: '2', name: 'Juan Manuel', email: 'juan@demo.com', role: 'User' },
    ]);

    const [formData, setFormData] = useState<Omit<UserRole, 'id'>>({
        name: '',
        email: '',
        role: 'User'
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        if (editingId) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData } : u));
            setEditingId(null);
        } else {
            const newUser: UserRole = {
                ...formData,
                id: Date.now().toString()
            };
            setUsers(prev => [...prev, newUser]);
        }

        setFormData({ name: '', email: '', role: 'User' });
    };

    const handleEdit = (user: UserRole) => {
        setEditingId(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', email: '', role: 'User' });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Shield className="text-[#9ACD32]" />
                            Gestión de Roles y Usuarios
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Administra los accesos y permisos del sistema</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Nombre</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nombre completo"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Rol</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Moderator">Moderator</option>
                                <option value="User">User</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-[#9ACD32] hover:bg-[#8bb92d] text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-md"
                            >
                                {editingId ? <Save size={18} /> : <UserPlus size={18} />}
                                {editingId ? 'Guardar' : 'Agregar'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-md transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-700">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'Admin' ? 'bg-red-100 text-red-600' :
                                                    user.role === 'Moderator' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-green-100 text-green-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1 hover:text-[#9ACD32] text-gray-400 transition-colors"
                                                    title="Editar usuario"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roles;
