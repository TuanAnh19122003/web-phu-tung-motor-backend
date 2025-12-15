// seed.js
require('dotenv').config();
const db = require('./src/models/index');
const { sequelize, Role, User, Category, Product, Discount, Cart, CartItem, Order, OrderItem, Contact } = db;
const { normalizeName } = require('./src/utils/normalizeName')

const seedDatabase = async () => {
    try {
        // Drop và tạo lại tất cả bảng
        await sequelize.sync({ force: true });
        console.log('Database has been dropped and recreated.');

        // ===== Seed Roles =====
        const roles = await Role.bulkCreate([
            { code: 'ADMIN', name: 'Admin' },
            { code: 'CUSTOMER', name: 'Customer' }
        ]);

        // ===== Seed Users =====
        const users = await User.bulkCreate([
            { firstname: 'Nguyen', lastname: 'Van A', email: 'admin@example.com', password: 'admin123', roleId: roles[0].id },
            { firstname: 'Tran', lastname: 'Thi B', email: 'customer@example.com', password: 'customer123', roleId: roles[1].id }
        ]);

        // ===== Seed Categories =====
        const categories = await Category.bulkCreate([
            { code: 'CON_TAY', name: 'Xe Côn Tay' },
            { code: 'XE_SO', name: 'Xe Số' },
            { code: 'XE_TAY_GA', name: 'Xe Tay Ga' }
        ]);

        // ===== Seed Discounts =====
        const discounts = await Discount.bulkCreate([
            { name: 'Black Friday', percentage: 10, start_date: '2025-11-20', end_date: '2025-11-30' },
            { name: 'New Year', percentage: 15, start_date: '2025-12-30', end_date: '2026-01-05' }
        ]);

        // Hàm random giá cho phụ kiện
        const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Hàm random true/false cho is_featured
        const randomFeatured = () => Math.random() < 0.3; // khoảng 30% sản phẩm sẽ nổi bật

        // ===== Seed Products =====
        const products = await Product.bulkCreate([
            // Xe Côn Tay
            { name: 'Áo WINNER V3 - Đen Bóng (14 Món)', price: 2800000, categoryId: categories[0].id, discountId: discounts[0].id, is_featured: randomFeatured() },
            { name: 'Áo WINNER V3 - Trắng (14 Món)', price: 2806000, categoryId: categories[0].id, is_featured: randomFeatured() },
            { name: 'Áo WINNER V3 - Xám Bóng (14 Món)', price: 2720000, categoryId: categories[0].id, is_featured: randomFeatured() },
            { name: 'Áo WINNER V3 - Đen Nhám (14 Món)', price: 2840000, categoryId: categories[0].id, is_featured: randomFeatured() },
            { name: 'Bánh răng bơm nước', price: 426000, categoryId: categories[0].id, is_featured: randomFeatured() },
            { name: 'Bình chứa nước làm mát WINNER', price: 64000, categoryId: categories[0].id, is_featured: randomFeatured() },

            // Xe Số
            { name: 'Giảm xóc trước phải WAVE 2023 - Đen', price: 495000, categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Áo FU NEO Đỏ 2009 (KYL-920) / 24 Món', price: 4095000, categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Áo ZX Trắng / 16 Món (Full Bóng + Nhám)', price: 3300000, categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Áo ZX Đỏ / 16 Món (Full Bóng + Nhám)', price: 3300000, categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Áo ZX Tím / 16 Món (Full Bóng + Nhám)', price: 3300000, categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Ốc bắt giỏ xe FUTURE 2', price: randomPrice(50, 100), categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Ốc đĩa FUTURE NEO/RS', price: randomPrice(60, 120), categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Ốc tay dắt FUTURE 2', price: randomPrice(40, 80), categoryId: categories[1].id, is_featured: randomFeatured() },

            // Xe Tay Ga
            { name: 'Bộ ốp sườn trái NHC60P - SH 160', price: 717000, categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Bộ ốp sườn phải NHC60P - SH 160', price: 717000, categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Bộ ốp sườn phải PB421', price: 400000, categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Dây phanh sau AB 2020', price: 143000, categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Tem ốp sườn VARIO 160 - XI', price: 127000, categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Tem ốp sườn VARIO 160 - VÀNG', price: 154000, categoryId: categories[2].id, is_featured: randomFeatured() },

            // Phụ kiện ngẫu nhiên
            { name: 'Gương chiếu hậu LED', price: randomPrice(100000, 300000), categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Baga sau xe tay ga', price: randomPrice(150000, 400000), categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Lốp trước WAVE', price: randomPrice(200000, 500000), categoryId: categories[1].id, is_featured: randomFeatured() },
            { name: 'Đèn pha LED SH', price: randomPrice(250000, 600000), categoryId: categories[2].id, is_featured: randomFeatured() },
            { name: 'Ống xả thể thao', price: randomPrice(300000, 800000), categoryId: categories[0].id, is_featured: randomFeatured() }
        ], { individualHooks: true });

        // ===== Seed Carts =====
        const carts = await Cart.bulkCreate([
            { userId: users[1].id }
        ]);

        // ===== Seed CartItems =====
        await CartItem.bulkCreate([
            { cartId: carts[0].id, productId: products[0].id, price: products[0].price, quantity: 1 }
        ]);

        // ===== Seed Orders =====
        const orders = await Order.bulkCreate([
            { userId: users[1].id, total_price: products[0].price, shipping_address: '123 Main St', status: 'pending', paymentMethod: 'cod' }
        ]);

        // ===== Seed OrderItems =====
        await OrderItem.bulkCreate([
            { orderId: orders[0].id, productId: products[0].id, price: products[0].price, quantity: 1 }
        ]);

        // ===== Seed Contacts =====
        await Contact.bulkCreate([
            { name: 'Customer A', email: 'customerA@example.com', phone: '0909009009', subject: 'Inquiry', message: 'Hello!' }
        ]);

        console.log('Seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
