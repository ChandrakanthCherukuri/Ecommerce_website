
# 🛍️ Zenbu E-Commerce Store  
**Your ultimate online destination for incredible finds and unbeatable prices!**

> *(Insert a captivating screenshot or GIF here showing the app in action)*

---

## 🚀 About the Project  
**Zenbu E-Commerce Store** is a modern, responsive, and feature-rich online shopping platform.  
Built using **React.js** and styled with **Tailwind CSS**, it delivers a seamless, intuitive experience—from browsing products and managing a shopping cart to secure user authentication.

🎨 All wrapped in a striking **Modern Dark & Lime** custom theme.

---

## ✅ Features

### 🛒 Dynamic Product Catalog  
- Browse across categories: **Electronics**, **Fashion**, **Home & Living**  
- Filtered to exclude incomplete or invalid products

### 🧺 Intuitive Shopping Cart  
- Add, update, or remove items effortlessly  
- Real-time **subtotal & total** price updates  
- Handles loading states, errors & empty cart UX

### 🔐 Robust User Authentication  
- Secure **Sign Up**, **Login**, and **Logout**  
- Personalized welcome messages  
- Admins see exclusive **“Add Product”** button

### 📱 Responsive & Adaptive Design  
- Flawless UI across mobile, tablet, and desktop  
- Fully responsive with Tailwind CSS

### 🎨 Modern & Aesthetic UI  
- Custom **“Modern Dark & Lime”** theme  
- Tailwind `tailwind.config.js` customizations

### 🔁 Smooth Client-Side Routing  
- Powered by **React Router DOM**

### 🧠 Centralized State Management  
- Authentication & cart data managed via **React Context API**

---

## 🛠️ Tech Stack

| Category     | Technology         |
|--------------|--------------------|
| **Frontend** | React.js, React Router DOM, Tailwind CSS, Context API |
| **Dev Tools**| Node.js, npm / Yarn |
| **API**      | Connects with a RESTful backend (not included in repo) |

---

## 🎨 Theme – *Modern Dark & Lime*

Tailored color palette in `tailwind.config.js`:

| Usage            | Color               |
|------------------|---------------------|
| Backgrounds      | `#1a1a1a`, `#2a2a2a` |
| Borders/Text     | `#444444`, `#777777`, `#b0b0b0` |
| Accent (Lime)    | `#CCFF66`, `#99CC33` |
| Danger Actions   | `red-400`, `red-700` |

---

## 💻 Installation

### ✅ Prerequisites
- Node.js (LTS recommended)
- npm or Yarn

### 📦 Setup Steps

1. **Clone the repo:**
   ```bash
   git clone [YOUR_REPOSITORY_URL_HERE]
   cd zenbu-ecommerce-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**  
   Create a `.env` file in the root:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```
   Replace with your actual API endpoint.

4. **Run the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

Visit **http://localhost:3000** to view the app.

---

## 💡 Usage Guide

### 🔍 Explore Products
- Navigate using the **navbar links** or the **“Shop All Products”** button

### 🛍️ Cart Management
- Click **Cart** in the navbar to:
  - Update quantities
  - Remove individual items
  - Clear the cart

### 👤 User Account
- Use **Login** / **Sign Up** in the navbar
- Authenticated users see a **personalized welcome message**

### 🛠️ Admin Panel
- Admin users will see an **“Add Product”** button in the navbar  
- Navigate to **Add Product** page to create new listings

---

## 📁 Project Structure

```
zenbu-ecommerce-store/
├── public/                # Public assets (index.html, favicon, etc.)
├── src/
│   ├── assets/            # Icons, product images, etc.
│   ├── components/        # Reusable UI components (Navbar, Footer, etc.)
│   ├── context/           # Context API for Auth & Cart
│   ├── pages/             # Page-level views (Home, Cart, AddProduct, etc.)
│   ├── App.js             # Routes + App Layout
│   ├── index.js           # Entry Point
│   └── index.css          # Tailwind styles + custom CSS
├── .env.example           # Sample environment variables
├── .gitignore             # Ignored files
├── package.json           # Dependencies & Scripts
├── tailwind.config.js     # Custom Tailwind theme
└── README.md              # This file
```

---

## 🤝 Contributing

We’d love your help improving Zenbu!  
To contribute:

```bash
# Fork & clone the repo
git checkout -b feature/your-feature
# Make your changes
git commit -m "feat: Your awesome feature"
git push origin feature/your-feature
# Then open a Pull Request!
```

---

## 📜 License

Licensed under the **MIT License**.  
See [`LICENSE`](./LICENSE) for more details.
