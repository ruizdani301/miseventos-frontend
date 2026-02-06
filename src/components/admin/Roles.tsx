import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, Shield, Mail, User, Save, X } from 'lucide-react';
import { sendUser, getUsers, updateUser, deleteUser } from '../../services/userService';
import type { UserListResponse, RoleType, User as UserResponse } from '../../types';
import { Role } from '../../types';

// interface UserRole {
//     id: string;
//     password: string;
//     email: string;
//     role: 'admin' | 'assistant';
// }
type UserRequest = {
    email: string;
    password: string;
    role: RoleType;
}

type UserUpdateRequest = {
    id: string;
    email: string;
    password: string;
    role: RoleType;
}


const Roles: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);

    const [formData, setFormData] = useState<UserResponse>({
        id: '',
        email: '',
        password: '',
        role: Role.ASSISTANT
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response: UserListResponse = await getUsers();
            if (response.success) {

                setUsers(response.users);

            }
            else {
                console.log('Error al obtener los usuarios');
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) return;

        if (editingId) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData } : u));
            setEditingId(null);
            // para enviar a la funcion de edicion
            alert(JSON.stringify(formData));
            const updated = await updateUser(formData);
            if (updated.success) {
                console.log('Usuario actualizado exitosamente');
            }
            else {
                console.log('Error al actualizar el usuario');
            }
        } else {
            const newUser: UserRequest = {
                ...formData,

            };
            //setUsers(prev => [...prev, newUser]);
            const createUser = await sendUser(newUser);
            if (createUser.success) {
                console.log('Usuario creado exitosamente');
                //setUsers(prev => [...prev, createUser]);
            }
            else {
                console.log('Error al crear el usuario');
            }
        }

        setFormData({ id: '', email: '', password: '', role: 'assistant' });
    };

    const handleEdit = (user: UserUpdateRequest) => {
        setEditingId(user.id);
        setFormData({
            id: user.id,
            password: user.password,
            email: user.email,
            role: user.role
        });
    };

    const handleDelete = async (id: string) => {
        console.log(JSON.stringify(id));
        const response = await deleteUser(id);

        if (response.success) {
            setUsers(prev => prev.filter(u => u.id !== id));
            console.log('Usuario eliminado exitosamente');
        }
        else {
            console.log('Error al eliminar el usuario');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ id: '', email: '', password: '', role: 'assistant' });
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
                        {/* <div className="space-y-1">
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
                        </div> */}

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
                            <label className="text-xs font-semibold text-gray-600 uppercase">password</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="password"
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
                                <option value="assistant">User</option>
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
                                    {/* <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th> */}
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {user.email.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-700">{user.email}</span>
                                            </div>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-600' :
                                                user.role === 'assistant' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2 group-hover:opacity-100 transition-opacity">
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
