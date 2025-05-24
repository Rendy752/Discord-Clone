# Discord Clone :speech_balloon:

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg?logo=next.js)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-blue.svg?logo=tailwindcss)](https://tailwindcss.com/)

---

## Overview

Welcome to **Discord Clone**, a feature-rich replication of the popular Discord chat application built with **[Next.js](https://nextjs.org/)**. This project delivers a modern, real-time communication platform where users can create servers, manage channels, send messages, and engage in video/audio calls. Styled with **[Tailwind CSS](https://tailwindcss.com/)** and powered by a robust tech stack, it offers a seamless and responsive user experience.

---

## Features

- **User Authentication**: Secure login and profile management using [Clerk](https://clerk.com/).
- **Server Management**:
  - Create, edit, and leave or delete servers as needed.
    <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/b84eb461-56a6-47dd-8a48-ece626025c1d" width="300" alt="Create Server">
          </td>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/e7750072-9e97-46bf-96b0-9eb9db7b20d2" width="300" alt="Edit Server">
          </td>
           <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/1ea37b4b-56ea-431c-a63b-f60463de1091" width="300" alt="Delete Server">
          </td>
        </tr>
      </table>
  - Generate unique invite codes to add members.
    <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/77c88e05-beeb-4ca2-8b50-17df68b44aa8" width="700" alt="Invite Codes">
          </td>
        </tr>
      </table>
- **Channel Management**:
  - Create, edit, and delete channels (text, audio, video).
    <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/3363d1e1-4f6b-4df4-8fc2-c8e42d84b1a0" width="300" alt="Create Channel">
          </td>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/520dd447-9c07-4190-a91b-99c270d1ef87" width="300" alt="Edit Channel">
          </td>
           <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/28e22a97-e29a-4572-926f-3c1c84cb74f0" width="300" alt="Delete Channel">
          </td>
        </tr>
      </table>
  - Organize channels by type for efficient navigation.
- **Real-Time Messaging**:
  - Send, edit, and delete messages in channels or direct messages.
    <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/7b3240b6-1ab6-4520-86fd-80e344e5e4a2" width="300" alt="Send Message">
          </td>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/6cc0f8b5-8d3f-4f29-80bb-50006ade85a0" width="300" alt="Edit Message">
          </td>
           <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/5c757086-1fc8-4dde-a033-a51d1327817e" width="300" alt="Delete Message">
          </td>
        </tr>
      </table>
  - Real-time updates with [Socket.IO](https://socket.io/).
  - Typing indicators to show active users.
- **Media Sharing**:
  - Upload and share images and PDFs via [UploadThing](https://uploadthing.com/).
     <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/042ca727-5b05-4307-a6f3-f9d766b333ad" width="300" alt="Media Sharing">
          </td>
        </tr>
      </table>
  - Preview media directly in chats.
- **Video and Audio Rooms**:
  - Real-time audio and video communication powered by [LiveKit](https://livekit.io/).
    <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/7111dbdd-0d2f-48d0-8df7-354ba704e2e1" width="700" alt="Video and Audio Rooms">
          </td>
        </tr>
      </table>
- **Member Management**:
  <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/5536f9d7-19db-473e-aa14-0cad5216cf17" width="700" alt="Member Management">
          </td>
        </tr>
      </table>
  - Assign roles (Admin, Moderator, Guest).
  - Kick members from servers.
- **Direct Messaging**:
  <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/7ec24279-80e5-410d-973e-45400eea89d6" width="700" alt="Direct Messaging">
          </td>
        </tr>
      </table>
  - One-on-one chats with real-time messaging support.
- **UI Enhancements**:
  <table>
        <tr>
          <td style="text-align: center">
            <img src="https://github.com/user-attachments/assets/398ec564-5632-41c2-9470-3ca344841eac" width="700" alt="Group Messaging">
          </td>
        </tr>
      </table>
  - Dark/light mode toggle with [Next Themes](https://github.com/pacocoursey/next-themes).
  - Emoji picker for expressive messaging.
  - Fully responsive design with Tailwind CSS.
- **State Management**:
  - Efficient data fetching with [Tanstack Query](https://tanstack.com/query).
  - Client-side state management with [Zustand](https://github.com/pmndrs/zustand).

<details>
<summary>Click to see feature details</summary>

- **Authentication Flow**: Users sign in with Clerk, creating a profile linked to a unique `userId`.
- **Real-Time Sync**: Socket.IO ensures messages and typing indicators are updated instantly across all connected clients.
- **Media Handling**: UploadThing supports file uploads up to 8MB for images and 4MB for PDFs, with automatic deletion on message removal.
- **Video Rooms**: LiveKit provides low-latency audio/video streams with customizable permissions.

</details>

---

## Tech Stack

| **Category**         | **Technology**                              | **Version/Notes**                  |
|-----------------------|---------------------------------------------|------------------------------------|
| **Framework**         | Next.js                                    | 14.1.0 (SSR/SSG)                  |
| **Language**          | TypeScript                                 | 5.x (type-safe)                    |
| **Styling**           | Tailwind CSS                               | 3.3.0 (with custom animations)     |
| **Authentication**    | Clerk                                      | Latest (secure auth/profiles)      |
| **Database**          | CockroachDB with Prisma                    | Latest (ORM)                       |
| **Real-Time**         | Socket.IO                                  | 4.7.5 (messaging/events)           |
| **Video/Audio**       | LiveKit                                    | Latest (real-time comms)           |
| **File Uploads**      | UploadThing                                | 6.3.3 (image/PDF uploads)          |
| **State Management**  | Tanstack Query, Zustand                    | Query: 5.29.2, Zustand: 4.5.2      |
| **UI Components**     | Radix UI, Lucide React, Framer Motion      | Latest (accessible/animated)       |
| **Form Handling**     | React Hook Form with Zod                   | Hook Form: 7.50.1, Zod: 3.22.4     |
| **Emoji Support**     | Emoji Mart                                 | 5.5.2 (emoji picker)               |
| **Notifications**     | Browser Notification API                   | Native browser support             |
| **Utilities**         | Axios, Class Variance Authority, etc.      | Axios: 1.6.8, etc. (various)       |

---

## Project Structure

The project is modularly organized for scalability and maintainability. Below is a detailed breakdown:

- **`app/`**:
  - Root directory for Next.js pages and layouts.
  - Subdirectories:
    - `(auth)/`: Authentication routes (e.g., login flows).
    - `(routes)/`: Route-specific files (e.g., `invite/[inviteCode]/page.tsx`).
    - `(main)/(routes)/servers/[serverId]/`: Server-specific routes and layouts.
    - `layout.tsx`: Global layout component.
    - `page.tsx`: Default homepage.

- **`components/`**:
  - Reusable UI components.
  - Subdirectories:
    - `chat/`: Chat-related components (e.g., `chat-header.tsx`, `chat-input.tsx`, `chat-messages.tsx`).
    - Other files: `chat-video-button.tsx`, `chat-welcome.tsx`, etc.

- **`modals/`**:
  - Modal components for actions like server/channel management.
  - Examples: `create-channel-modal.tsx`, `delete-message-modal.tsx`, `invite-modal.tsx`.

- **`server/`**:
  - Server-side logic and API routes.
  - Files: `server-channel.tsx`, `server-header.tsx`, `server-member.tsx`, etc.
  - Subdirectory: `ui/` (e.g., `emoji-picker.tsx`, `file-upload.tsx`).

- **`ui/`**:
  - Shared UI utilities and components.
  - Examples: `action-tooltip.tsx`, `theme-toggle.tsx`, `user-avatar.tsx`.

- **`hooks/`**:
  - Custom React hooks for functionality (e.g., chat, state management).

- **`lib/`**:
  - Utility functions and configurations.
  - Files: `current-profile.ts`, `db.ts`, `use-origin.ts`.

- **`prisma/`**:
  - Prisma schema and database configurations.
  - File: `schema.prisma` (defines models like `Profile`, `Server`, `Channel`).

- **`public/`**:
  - Static assets (e.g., images, fonts).

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- CockroachDB instance
- Clerk, LiveKit, and UploadThing API keys

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/discord-clone.git
   cd discord-clone
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```
   DATABASE_URL="your-cockroachdb-connection-string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   LIVEKIT_API_KEY="your-livekit-api-key"
   LIVEKIT_API_SECRET="your-livekit-secret-key"
   NEXT_PUBLIC_LIVEKIT_URL="your-livekit-url"
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature-name"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

Ensure code adheres to the existing style and include tests for new features.

---

## License

This project is licensed under the **[MIT License](LICENSE)**. See the `LICENSE` file for details.

---

*Last updated: 03:54 PM WIB, Saturday, May 24, 2025*
