has both admin and worker panels
/Admin/login  User/Pass 123 123
/worker/login User/Pass worker worker123



# Notion Clone

A modern, responsive Notion clone built with Next.js 13, TypeScript, and Tailwind CSS. This project replicates Notion's clean and intuitive interface while adding some unique features.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 13 and TypeScript
- 🔥 Server-side rendering for optimal performance
- 📱 Mobile-first design
- 🎯 Interactive components with smooth animations
- 📧 Email subscription system
- 💬 Dynamic quote system
- 🔐 User authentication system
- 📊 Admin dashboard

## Tech Stack

- **Framework:** Next.js 13
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons
- **Database:** MongoDB (for user data and subscriptions)
- **Authentication:** NextAuth.js
- **Deployment:** Vercel (recommended)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/notion-clone.git
   cd notion-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                 # Next.js 13 app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin dashboard
│   └── (routes)/       # Page routes
├── components/         # React components
│   ├── layout/        # Layout components
│   └── sections/      # Page sections
├── models/            # Database models
├── public/            # Static assets
└── types/            # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by Notion
- Icons from [Lucide Icons](https://lucide.dev)
- Built with [Next.js](https://nextjs.org) 
