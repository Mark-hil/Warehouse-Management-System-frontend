import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select } from '../../components/forms';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog } from '../../components/overlays';
import { userService } from '../../services/user.service';
import { User, Permission, UserRole } from '../../types/auth.types';



interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface NewRole extends Omit<RoleData, 'id'> {}

const UsersAndRoles: React.FC = () => {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, 'id'> & { password: string }>({
    username: '',
    email: '',
    role: 'team_lead',
    is_active: true,
    is_staff: false,
    assigned_branch: '',
    created_at: new Date().toISOString(),
    password: ''
  });

  const [newRole, setNewRole] = useState<NewRole>({
    name: '',
    description: '',
    permissions: []
  });

  const permissions: Permission[] = [
    'read',
    'write',
    'manage_users',
    'manage_roles',
    'manage_settings',
    'all'
  ];

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  const [roles, setRoles] = useState<RoleData[]>([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const fetchedRoles = await userService.getRoles();
        const mappedRoles: RoleData[] = fetchedRoles.map(role => ({
          id: role,
          name: role,
          description: `${role} role`,
          permissions: ['read']
        }));
        setRoles(mappedRoles);
      } catch (error) {
        console.error('Failed to load roles:', error);
      }
    };
    loadRoles();
  }, []);

  const roleOptions: UserRole[] = ['admin', 'warehouse_manager', 'team_lead', 'approver'];

  const capitalizeFirstLetter = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id) return;

    try {
      await userService.updateUser(editingUser.id, newUser);
      const updatedUsers = await userService.getUsers();
      setUsers(updatedUsers);
      setShowUserDialog(false);
      setEditingUser(null);
      setNewUser({
        username: '',
        email: '',
        role: 'team_lead',
        is_active: true,
        is_staff: false,
        assigned_branch: '',
        created_at: new Date().toISOString(),
        password: ''
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole?.id) return;

    try {
      // TODO: Implement role update when API is ready
      console.log('Updating role:', editingRole.id, newRole);
      setShowRoleDialog(false);
      setEditingRole(null);
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      const updatedUsers = await userService.getUsers();
      setUsers(updatedUsers);
      setShowUserDialog(false);
      setNewUser({
        username: '',
        email: '',
        role: 'team_lead',
        is_active: true,
        is_staff: false,
        assigned_branch: '',
        created_at: new Date().toISOString(),
        password: ''
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement role creation when API is ready
      console.log('Creating role:', newRole);
      setShowRoleDialog(false);
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Users Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowUserDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
          <Button 
            variant="primary" 
            className="flex items-center"
            onClick={() => setShowRoleDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                        >
                          {capitalizeFirstLetter(permission.replace('_', ' '))}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add User Dialog */}
      <Dialog
        open={showUserDialog}
        onClose={() => setShowUserDialog(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <Form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
          <Input
            label="Name"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Select
            label="Role"
            value={newUser.role}
            onChange={value => setNewUser({ ...newUser, role: value as UserRole })}
            options={roleOptions.map(role => ({
              value: role,
              label: capitalizeFirstLetter(role.replace('_', ' '))
            }))}
          />
          <div className="mt-4 flex gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={newUser.is_active}
                onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_staff"
                checked={newUser.is_staff}
                onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Staff</label>
            </div>
          </div>
          <label className="block text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            name="assigned_branch"
            value={newUser.assigned_branch}
            onChange={e => setNewUser({ ...newUser, assigned_branch: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </Form>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog
        open={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
      >
        <Form onSubmit={editingRole ? handleUpdateRole : handleAddRole} className="space-y-4">
          <Input
            label="Role Name"
            value={newRole.name}
            onChange={e => setNewRole({ ...newRole, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={newRole.description}
            onChange={e => setNewRole({ ...newRole, description: e.target.value })}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {permissions.map(permission => (
                <div key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={newRole.permissions.includes(permission)}
                    onChange={e => {
                      const updatedPermissions = e.target.checked
                        ? [...newRole.permissions, permission]
                        : newRole.permissions.filter(p => p !== permission);
                      setNewRole({ ...newRole, permissions: updatedPermissions as Permission[] });
                    }}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRole ? 'Update Role' : 'Add Role'}
            </Button>
          </div>
        </Form>
      </Dialog>
    </div>
  );
};

export default UsersAndRoles;
