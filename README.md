# Vucud Takip

Bu proje, günlük diyet planı ve vücut ölçümlerini takip etmek için basit bir Next.js bileşeni içerir. Kullanıcı gün içerisindeki öğünleri işaretleyebilir, makro değerlerini görebilir ve günlük gelişim verilerini MongoDB veritabanına kaydedebilir.

## Özellikler

- Haftanın her günü için kontrol listesi
- Günlük alınması önerilen makroların görüntülenmesi
- Rastgele alternatiflerden oluşturulan günlük diyet planı
- Kilo, yağ oranı ve kas kütlesi takibi
- Progress verilerini MongoDB üzerinden kaydetme ve yükleme

## Geliştirme

1. `MONGODB_URI` ortam değişkenini belirleyin.
2. Next.js projesinde `DailyTracker.jsx` bileşenini uygun bir sayfaya dahil edin.
3. `/api/progress` endpointi `progress.js` dosyasında tanımlıdır ve hem POST hem GET isteklerini destekler.

Uygulama örnek amaçlıdır ve gerçek bir beslenme uzmanına danışılmadan kullanılmamalıdır.
