# 🌳 TREEdu - Học Tập Thông Minh

TREEdu là ứng dụng di động hỗ trợ học tập tích hợp Quiz, Flashcard và luyện phát âm. Dự án được xây dựng trên nền tảng Expo với cấu trúc tối ưu cho việc mở rộng và bảo trì.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)
* **Framework:** [Expo](https://expo.dev) (Managed Workflow)
* **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **Ngôn ngữ:** TypeScript
* **Styling:** NativeWind (Tailwind CSS cho React Native)
* **State Management:** React Context API (Auth, User Data)
* **Data Fetching:** Axios + Custom Hooks

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
├── app/                    # Routing layer (Màn hình chính)
│   ├── (auth)/             # Luồng đăng nhập/đăng ký
│   ├── tabs/               # Main Navigation (Home, Quiz, Flashcard, Profile)
│   ├── quiz/               # Module Quiz (Lịch sử, Làm bài, Chi tiết)
│   └── _layout.tsx         # Root layout & Navigation Provider
├── src/                    # Core logic layer
│   ├── components/         # UI Components tái sử dụng (Common, UI, User)
│   ├── constants/          # Biến tĩnh, API endpoints, Config
│   ├── context/            # Global State (AuthContext, ThemeContext)
│   ├── hooks/              # Logic gọi API và xử lý dữ liệu (useQuiz, useAuth)
│   ├── types/              # Định nghĩa TypeScript interfaces
│   └── utils/              # Helper functions (Format date, Adapter)
└── assets/                 # Hình ảnh, Fonts, Media
