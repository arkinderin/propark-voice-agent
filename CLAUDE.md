@AGENTS.md

# Deploy Kuralı

Kullanıcı "yayına al" dediğinde hiç soru sormadan şu adımları otomatik uygula:

1. `git add` — değişen tüm tracked dosyaları stage et (untracked dosyaları da ekle)
2. `git commit` — yapılan değişiklikleri özetleyen kısa bir Türkçe mesajla commit at
3. `git push origin main` — GitHub'a push et (Vercel otomatik deploy başlatır)

Onay isteme, soru sorma — direkt çalıştır ve sonucu bildir.
