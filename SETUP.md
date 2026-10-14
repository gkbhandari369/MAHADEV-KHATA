# नयाँ अपडेट लगाउने तरिका (क्रम मिलाएर)

## १. हरेक staff को आफ्नै login (Firebase Console)
1. **Authentication → Users → Add user**: email = `ram@mahadev.app`, password राख्नुहोस्. (app मा username = `ram` मात्र लेखे पुग्छ.)
2. हरेक user को **User UID** कपी गर्नुहोस्.
3. **Firestore Database → Start collection → `staff`** → Document ID = त्यो UID → fields:
   - `name` (string) = `Ram`   ← यही नाम "कसले हाल्यो" मा देखिन्छ
   - `active` (boolean) = `true`   ← कसैलाई रोक्नु परे `false`
   मालिकको पनि एउटा बनाउनुहोस्.
4. **Authentication → Settings → User actions →** "Enable create (sign-up)" बन्द गर्नुहोस्.

## २. Rules र नयाँ फाइल (छिटो-छिटो, सबै फोन बन्द हुँदा)
5. **Firestore → Rules** मा `firestore.rules` को सबै paste गरेर **Publish**.
6. तुरुन्तै `index.html`, `style.css`, `sw.js` आफ्नो hosting मा replace गर्नुहोस्.
7. हरेक फोनमा इन्टरनेट खोलेर app खोल्नुहोस् र **आफ्नै username/password** ले login गर्नुहोस्. पहिलो फोनले पुरानो डेटा आफैं नयाँ प्रणालीमा सार्छ ("डेटा नयाँ सिंक प्रणालीमा सारियो").

## ३. पछि
8. पुरानो साझा login (जस्तै `admin@mahadev.app`) Authentication बाट delete गर्नुहोस्.
9. `khata` collection **नमेट्नुहोस्** — पुरानो डेटाको सुरक्षित कपी हो.

## थाहा हुनुपर्ने कुरा
- अपडेट नगरेको पुरानो app मा सेभ हुँदैन (khata मा लेख्न बन्द) — त्यसले चेतावनी देखाउँछ; इन्टरनेटमा app खोलेर अपडेट गर्नुहोस्.
- पहिलो खोल्दा फोनमा रहेको डेटाको एक कपी फोनमै (`mahadev_pre_v3`) राखिन्छ; क्लाउडको डेटा नै मानिन्छ.
- "कसले के गर्यो": Dashboard → सुरक्षा → गतिविधि सूची. अपडेटअघिका रेकर्डमा नाम हुँदैन.
- रकम: कुनै पनि रकम-खानामा `10000+5000` लेखे 15000 हुन्छ; `＋` `−` बटन पनि छन्.
