兩棲大亂鬥｜線上雙人對戰原型（修正版）

最簡單的公開部署方式：Render（需要帳號；免費服務可能休眠）
1. 將本資料夾內容上傳到你自己的 GitHub repository。
2. 登入 Render，選 New + → Blueprint，連結該 repository。
3. Render 會讀取 render.yaml，建立 Node 網頁服務；等狀態變成 Live。
4. 打開 Render 提供的 https://....onrender.com 網址，兩位玩家都開同一網址。
5. 兩台裝置輸入相同房間代碼，按「線上對戰」。
6. WebSocket 位址填：wss://你的服務名稱.onrender.com/ws（把網域換成 Render 提供的網域）。

本機測試：
1. 安裝 Node.js 18 或更新版本。
2. 在此資料夾開啟終端機／命令提示字元。
3. 執行 npm install，再執行 npm start。
4. 開啟 http://localhost:8080。
5. 本機 WebSocket 位址使用 ws://localhost:8080/ws。其他裝置不能把 localhost 當成主機位址。

玩法：
- P1：A/D 移動、W 跳躍、F 攻擊、G 閃避。
- P2：方向鍵移動、↑ 跳躍、Enter 攻擊、Shift 閃避。
- 手機／平板可使用畫面上的觸控按鈕。
- 兩位玩家必須使用相同房間代碼，且各自輸入相同伺服器的 WSS 位址。

限制：
這是可連線的原型，伺服器只中繼按鍵，角色位置、碰撞與血量仍在各裝置本地計算，因此可能不同步。此專案尚未替你部署到公開網路；公開對戰需完成上述託管步驟。
