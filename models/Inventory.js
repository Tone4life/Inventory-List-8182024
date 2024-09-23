import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }],
  variations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variation' }],
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }]
});

inventorySchema.pre('save', async function(next) {
    // Check if the owner exists
    const user = await User.findById(this.owner);
    if (!user) {
      throw new Error('Invalid owner');
    }
    next();

    // Check if the name already exists for the owner
    const existingInventory = await Inventory.findOne({ owner: this.owner, name: this.name });
    if (existingInventory && existingInventory._id.toString()!== this._id.toString()) {
      throw new Error('Inventory name already exists');
    }
});

const User = mongoose.model('User');

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;

import mongoose from 'mongoose';