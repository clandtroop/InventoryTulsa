import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShoppingCart, Package, AlertCircle, Check, X } from 'lucide-react';

export default function MedicalInventory() {
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Surgical Gloves (Box)', currentStock: 45, reorderLevel: 50, unit: 'boxes', category: 'PPE', price: 12.99 },
    { id: 2, name: 'Syringes 10ml', currentStock: 150, reorderLevel: 100, unit: 'units', category: 'Consumables', price: 0.25 },
    { id: 3, name: 'Blood Pressure Monitor', currentStock: 3, reorderLevel: 5, unit: 'units', category: 'Equipment', price: 89.99 },
    { id: 4, name: 'Stethoscope', currentStock: 8, reorderLevel: 10, unit: 'units', category: 'Equipment', price: 45.00 },
  ]);
  
  const [orders, setOrders] = useState([]);
  const [users] = useState(['Dr. Smith', 'Nurse Johnson', 'Admin Davis', 'Dr. Williams']);
  const [currentUser, setCurrentUser] = useState('Admin Davis');
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', currentStock: 0, reorderLevel: 0, unit: 'units', category: 'Consumables', price: 0
  });
  
  const [orderForm, setOrderForm] = useState({ itemId: null, quantity: 1 });

  const categories = ['PPE', 'Consumables', 'Equipment', 'Medication', 'Instruments'];
  const units = ['units', 'boxes', 'bottles', 'packs', 'pieces'];

  const needsReorder = (item) => item.currentStock <= item.reorderLevel;

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    setEquipment(equipment.map(item => 
      item.id === editingId ? editForm : item
    ));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      alert('Please enter an item name');
      return;
    }
    const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
    setEquipment([...equipment, { ...newItem, id: newId }]);
    setNewItem({ name: '', currentStock: 0, reorderLevel: 0, unit: 'units', category: 'Consumables', price: 0 });
    setShowAddForm(false);
  };

  const handlePlaceOrder = (itemId) => {
    setOrderForm({ itemId, quantity: 1 });
  };

  const handleConfirmOrder = () => {
    const item = equipment.find(e => e.id === orderForm.itemId);
    if (!item) return;

    const newOrder = {
      id: Date.now(),
      itemName: item.name,
      quantity: orderForm.quantity,
      user: currentUser,
      date: new Date().toLocaleString(),
      total: (item.price * orderForm.quantity).toFixed(2)
    };

    setOrders([newOrder, ...orders]);
    setOrderForm({ itemId: null, quantity: 1 });
  };

  const lowStockCount = equipment.filter(needsReorder).length;
  const orderItem = equipment.find(e => e.id === orderForm.itemId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="text-indigo-600" size={32} />
                Medical Equipment Inventory
              </h1>
              <p className="text-gray-600 mt-1">Manage stock levels and equipment orders</p>
            </div>
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current User</label>
              <select 
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>

          {lowStockCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <p className="text-red-800 font-semibold">Low Stock Alert</p>
                <p className="text-red-600 text-sm">{lowStockCount} item(s) need reordering</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Inventory Items</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add New Item
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Equipment</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Current Stock"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Reorder Level"
                  value={newItem.reorderLevel}
                  onChange={(e) => setNewItem({...newItem, reorderLevel: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price per unit"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Check size={18} />
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Item Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Current Stock</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Reorder Level</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {editingId === item.id ? (
                      <React.Fragment>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={editForm.currentStock}
                            onChange={(e) => setEditForm({...editForm, currentStock: parseInt(e.target.value) || 0})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={editForm.reorderLevel}
                            onChange={(e) => setEditForm({...editForm, reorderLevel: parseInt(e.target.value) || 0})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.price}
                            onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center" colSpan="2">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                            >
                              <Check size={16} />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center gap-1"
                            >
                              <X size={16} />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={needsReorder(item) ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                            {item.currentStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{item.reorderLevel} {item.unit}</td>
                        <td className="py-3 px-4 text-center text-gray-700">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          {needsReorder(item) ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handlePlaceOrder(item.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                              title="Order"
                            >
                              <ShoppingCart size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </React.Fragment>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {orderForm.itemId && orderItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Place Order</h3>
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>Item:</strong> {orderItem.name}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Ordered by:</strong> {currentUser}
                </p>
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-gray-600 mt-2">
                  <strong>Total:</strong> ${(orderItem.price * orderForm.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmOrder}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setOrderForm({ itemId: null, quantity: 1 })}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" size={24} />
            Order History
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders placed yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ordered By</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{order.date}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{order.itemName}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{order.quantity}</td>
                      <td className="py-3 px-4 text-gray-700">{order.user}</td>
                      <td className="py-3 px-4 text-center text-gray-800 font-semibold">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
