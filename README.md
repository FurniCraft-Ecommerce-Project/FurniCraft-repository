# FurniCraft: Modern Furniture E-commerce Platform

## Overview

FurniCraft is a comprehensive e-commerce application focused on high-quality furniture and home accessories. Built with Next.js, the platform offers a seamless shopping experience with features like 3D product visualization, personalized recommendations, and secure payment processing.

### Video Demo
https://drive.google.com/file/d/14VRmBOXGOLA-ryqfRkWO0BwQEc11F51c/view?usp=sharing

## Features

### For Customers
- **Intuitive Product Browsing**: Easy navigation through various furniture categories
- **3D Product Visualization**: View select products in 3D before purchasing
- **User Accounts**: Register, login, and manage personal profiles
- **Wishlist**: Save favorite items for later
- **Shopping Cart**: Add products and manage quantities
- **Secure Checkout**: Multiple payment options with encrypted transactions
- **Order History**: Track past and current orders

### For Administrators
- **Product Management**: Add, edit, and remove products
- **Inventory Control**: Track stock levels and manage availability
- **Order Processing**: View and update order statuses
- **User Management**: Manage customer accounts and access permissions
- **Analytics Dashboard**: Monitor sales performance and customer trends (coming soon)

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API routes
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary for product images
- **3D Visualization**: Three.js
- **Payment Processing**: Integration with secure payment gateways
- **AI Technologies**:
  - **Text Embeddings**: OpenAI embeddings for product search and recommendations
  - **Vector Similarity**: Cosine similarity algorithms for content-based filtering
  - **3D Model Generation**: AI-powered 3D model creation from product images with Meshy AI
  - **Image Processing**: Computer vision for product image analysis and enhancement

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FurniCraft-repository.git
cd FurniCraft-repository/furnicraft-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Meshy AI
MESHY_API_KEY=your_meshy_api_key

# Open AI
OPENAI_API_KEY=your_openai_api_key

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_public_midtrans_client_key

# Jwt Secret
JWT_SECRET=your_jwt_secret

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
furnicraft-app/
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js 13+ App directory
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── api/              # API routes
│   │   ├── products/         # Product pages
│   │   └── ...               # Other app routes
│   ├── components/           # Reusable React components
│   ├── db/                   # Database models and config
│   ├── helpers/              # Helper functions
│   ├── lib/                  # Library configurations
│   └── types/                # TypeScript type definitions
├── .env.example              # Example environment variables
├── next.config.ts            # Next.js configuration
└── package.json              # Project dependencies
```

## Key Features in Detail

### Product Management
The platform includes a comprehensive product management system with support for:
- Detailed product information
- Multiple product images
- 3D model integration
- Inventory tracking
- Category organization

### 3D Product Visualization
Select products feature 3D models that customers can interact with:
- Rotate and zoom functionality
- View products from all angles
- Understand dimensions and proportions before purchase

### Responsive Design
The application is fully responsive, ensuring a seamless experience across:
- Desktop computers
- Tablets
- Mobile devices

## Contributing

We welcome contributions to FurniCraft! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact one of the email addresses listed below:  
- tech.fuad99@gmail.com
- faishaldarmaputra@gmail.com
- fikri.algabel99@gmail.com

---

*FurniCraft - Crafting beautiful spaces, one piece at a time.*
