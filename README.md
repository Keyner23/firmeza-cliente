# 🏪 Firmeza Cliente 

Firmeza Cliente is a web application designed to provide a seamless and efficient user experience for managing products, sales, and orders. Built with modern web technologies, this project is tailored for businesses looking to streamline their operations.

## Features 

- **Authentication**: Secure login system to protect user data.
- **Product Management**: View and manage a catalog of products.
- **Cart System**: Add products to a cart and proceed to checkout.
- **Order Tracking**: Keep track of orders and their statuses.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## 💻 Technologies Used 

- **Frontend Framework**: Vue.js
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios

## 📁 Project Structure

The project is organized as follows:

```
src/
  App.vue          # Root component
  main.js          # Application entry point
  api/             # API services (authentication, products, sales)
  router/          # Application routes
  stores/          # State management (auth, cart)
  views/           # Page components (CartView, LoginView, etc.)
  index.css        # Global styles
```

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js
- npm 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Keyner23/firmeza-cliente.git
   ```
2. Navigate to the project directory:
   ```bash
   cd firmeza-cliente
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```

The build files will be generated in the `dist/` directory.

---
## Contributors

<a href="https://github.com/migueweb/boa/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Keyner23/firmeza-cliente" alt="Contributors" />
</a>