# Toy Race

Yukarıdan bakışlı (top-down) bir araba yarışı oyunu: 30 araba, garaj ve yükseltmeler, 4 pist
(Oval, Drag, Gece Grand Prix, Redoun toprak) ve 4 mod (Normal, Rastgele Araç, Hayalet, Drift).
React + Vite + Canvas 2D ile yazıldı; Android'e Capacitor ile paketlenmek üzere hazırlandı.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ klasörüne yayın derlemesi
npm run lint     # TypeScript kontrolü
```

## Proje yapısı

- `src/store.ts`: oyun durumu (para, arabalar, yükseltmeler, görevler) ve cihaza kayıt (`localStorage`).
  Kayıtta sadece ilerleme tutulur; araba değerleri `INITIAL_CARS` + yükseltme seviyesinden yeniden hesaplanır.
- `src/game/Game.tsx`: yarış döngüsü (intro, geri sayım, yarış, sonuç), duraklatma, ödüller.
- `src/game/Physics2D.ts`, `PhysicsAI.ts`: fizik, tur sayımı, rakip yapay zekâsı.
- `src/game/Renderer2D.ts`, `RenderCar*.ts`: çizim. Arabalar bir kez çizilip önbelleğe alınır (sprite).
- `src/game/Audio*.ts`: ses (Web Audio).
- `src/game/ghosts.ts`: hayalet modu kayıtları (pist + tur sayısı başına).
- `src/platform.ts`: Android geri tuşu (Capacitor `@capacitor/app`).
- `src/assets/`: oyunun kullandığı görseller (WebP) ve sesler (OGG).

## Notlar

- Orijinal sıkıştırılmamış görsel/ses dosyaları `_originals/` klasöründedir (git'e dahil değil).
- Yeni bir araba eklerken: `INITIAL_CARS`'a ekle; özel yükseltme kuralı varsa `applyCarStatUpgrade`,
  özel fiyatı varsa `getUpgradeCost` içine yaz. Garaj ve yarış bu iki fonksiyonu kullanır.
