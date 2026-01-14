# My Music Player 🎶

自作曲をアップロードし、自分だけのプレイリストを作成・試聴できるWebアプリケーションです。

## 概要
このプロジェクトは、アーティストが自分の楽曲（MP3/WAV）とカバー画像を自由に管理し、ブラウザ上で試聴できるように設計されています。Google Firebaseを活用したサーバーレス構成で、高速なアップロードとリアルタイムなデータ更新を実現しています。

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

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone [https://github.com/あなたのユーザー名/my-music-player.git](https://github.com/あなたのユーザー名/my-music-player.git)
cd my-music-player



<img width="1920" height="878" alt="My-Music-Player-Google-AI-Studio-01-15-2026_08_43_AM" src="https://github.com/user-attachments/assets/758fb317-8455-4a10-bbbd-6ae067171dc3" />


