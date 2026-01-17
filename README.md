# My Music Player 🎶

自作曲をアップロードし、自分だけのプレイリストを作成・試聴できるWebアプリケーションです。

## 概要
このプロジェクトは、アーティストが自分の楽曲（MP3/WAV）とカバー画像を自由に管理し、ブラウザ上で試聴できるように設計されています。Google Firebaseを活用したサーバーレス構成で、高速なアップロードとリアルタイムなデータ更新を実現しています。

## アップデート内容　2026/1/17
- Firestoreを利用したデータの永続化（保存機能）を実装しました。
- アプリをリロードしても、入力した歌詞やプロンプトが保持されます。

## 💡 重要な注意点
- データベースの制限により、画像・音楽ファイルは1MB以下に圧縮して使用してください。
- 1MBを超えると保存エラーが発生します。
- 起動には別途Firebaseの設定が必要です。詳細はREADMEをご覧ください。

## 主な機能
- **楽曲アップロード**: MP3/WAV形式のファイルに対応。
- **カスタムアートワーク**: 楽曲ごとに任意の画像（JPG/PNG）をカバーとして設定可能。
- **オーディオプレイヤー**: 再生、一時停止、シーク、音量調整。
- **楽曲管理**: アップロード済み楽曲の一覧表示および削除機能。
- **レスポンシブデザイン**: PC、スマホ両方のブラウザに対応。

## 使用技術 (Tech Stack)
- **Frontend**: React (TypeScript), Vite
- **Backend/BaaS**: Google Firebase
  - **Authentication**: 匿名認証
  - **Firestore**: 楽曲メタデータ管理
  - **Storage**: 音源および画像ファイルの保存
- **Styling**: CSS Modules (または Tailwind CSS)

#### 1. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. プロジェクトの設定からAPIキーを取得
3. `src/firebase.ts`にFirebaseの設定を記述

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

#### 2. ローカル開発サーバーの起動

```bash
npm run dev
```

#### 3. ビルドとデプロイ

```bash
npm run build
firebase deploy
```




<img width="1920" height="878" alt="My-Music-Player-Google-AI-Studio-01-15-2026_08_43_AM" src="https://github.com/user-attachments/assets/758fb317-8455-4a10-bbbd-6ae067171dc3" />


