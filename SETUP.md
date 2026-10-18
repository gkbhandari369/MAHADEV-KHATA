# Firebase मा के-के गर्ने (क्रम मिलाएर)

## ख्याल गर्नुहोस् (यो मोडेल)
- **मालिक (Merchant):** Firebase मा एउटै खाता। यसले सबै Admin का खाता देख्छ, नयाँ Admin बनाउँछ, Admin को ID/Password बदल्छ, Admin लाई बन्द गर्छ।
- **Admin:** मालिकले बनाउँछ। आफ्नै अलग, खाली (सबै ०) एप पाउँछ। आफ्नो दोकानको नाम/लोगो बदल्छ र **Staff मात्र** थप्न सक्छ (अर्को Admin बनाउन सक्दैन)।
- **Staff:** आफ्नो Admin को दोकानमा entry गर्छ। Admin र उसका Staff ले हालेको डेटा मात्र तिनीहरू देख्छन्।
- हरेक Admin को डेटा अलग (`shops/{id}/`) — अर्को Admin ले देख्दैन, मालिकले पनि हिसाबको डेटा देख्दैन (खाता मात्र देख्छ)।

## १. Authentication
1. **Authentication → Settings → User actions →** "Enable create (sign-up)" **चालु (ON)** राख्नुहोस्। (एपले नयाँ Admin/Staff खाता यही बाटो बनाउँछ। खाता मात्र बनेर staff document नभए केही पढ्न/लेख्न पाइँदैन, त्यसैले सुरक्षित छ।)
2. **Authentication → Users** मा मालिकको खाताको **User UID** कपी गर्नुहोस्।

## २. Firestore → staff → मालिकको document (Document ID = त्यही UID)
fields यस्ता हुनुपर्छ (नभए थप्नुहोस्):
- `name` = तपाईंको नाम
- `role` = `admin`
- `shop` = `main`
- `owner` = `true`  (boolean)  ← एपमा "नयाँ दोकान + नयाँ Admin" बटन देखाउन मात्र; असली सुरक्षा Rules मा UID बाट हुन्छ
- `active` = `true`

## ३. Rules (यो चरण Rules Publish गर्नु अगाडिको २ पछि मात्र)
3. `firestore.rules` खोल्नुहोस् र `PASTE_OWNER_UID_HERE` को ठाउँमा मालिकको UID राख्नुहोस् (quotes भित्र)।
4. **Firestore → Rules** मा सबै paste गरेर **Publish**।

## ४. फाइलहरू
5. `index.html` र `sw.js` hosting मा replace गर्नुहोस् (`style.css` जस्ताको तस्तै)।
6. हरेक फोनमा इन्टरनेटमा एप खोलेर फेरि login गर्नुहोस्। मालिकले **👥 कर्मचारी** ट्याब एक पटक खोल्नुहोस् (पुराना staff मा `shop = main` आफैं थपिन्छ)।

## ५. प्रयोग
- **नयाँ Admin:** मालिक login → 👥 कर्मचारी → **🏬 नयाँ दोकान + नयाँ Admin बनाउनुहोस्** → दोकानको नाम, Admin नाम, username, password।
- **Admin को ID/Password बदल्न:** त्यही सूचीमा Admin मा **🔑 ID / Password बदल्ने** → नयाँ username र password। पुरानो ID बन्द हुन्छ; डेटा र कर्मचारी उही दोकानमै रहन्छन्। (Firebase को सीमाले एउटै username राखेर अर्को व्यक्तिको password एपबाट बदल्न मिल्दैन, त्यसैले नयाँ username चाहिन्छ। पुरानो ID सूचीमा "⛔ बन्द" देखिइरहन्छ।)
- **Admin ले Staff को ID/Password:** त्यसैगरी आफ्नो सूचीबाट।
- **आफ्नै Password:** ड्यासबोर्ड → सुरक्षा → **🔑 मेरो Password बदल्नुहोस्** (सबैका लागि)।
- **कसैलाई रोक्न:** सूचीमा **🗑 हटाउने** (बन्द हुन्छ; फेरि चालु गर्न पनि मिल्छ)।

## सीमा
- एउटै फोनमा फरक दोकानका खाताले login गर्दा फोनको डेटा आफैं अलग-अलग राखिन्छ।
- मेट्ने अधिकार Rules ले पनि Admin मात्रलाई दिन्छ (रिसाइकल बिनको आफैं सफाइ बाहेक)।
- `khata` collection नमेट्नुहोस्। PWA install नाम (`manifest.webmanifest`) पुरानै रहन्छ।
