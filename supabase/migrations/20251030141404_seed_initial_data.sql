/*
  # Seed Initial Data for Mezmur Application

  ## Overview
  Populates the database with sample categories and mezmurs for testing and demonstration purposes.

  ## Categories Added
  - Saint (Songs dedicated to saints)
  - Holy Days (Songs for religious holidays)
  - Praise (Songs of praise and worship)
  - Morning Prayer (Songs for morning devotions)
  - Evening Prayer (Songs for evening devotions)

  ## Sample Mezmurs
  Each category receives sample mezmur entries with placeholder data including:
  - Titles in Amharic and English
  - Sample audio URLs (using public domain audio for demonstration)
  - Sample images from Pexels
  - Placeholder lyrics/poems

  ## Important Notes
  - Audio URLs use sample public domain music files
  - Replace with actual Ethiopian Orthodox Mezmur recordings
  - Images use stock photos from Pexels
  - Poems/lyrics are placeholders and should be replaced with actual content
*/

-- Insert categories
INSERT INTO categories (name, description, icon) VALUES
('Saint', 'Songs dedicated to saints and holy figures', 'star'),
('Holy Days', 'Songs for religious holidays and celebrations', 'calendar'),
('Praise', 'Songs of praise and worship', 'heart'),
('Morning Prayer', 'Songs for morning devotions', 'sunrise'),
('Evening Prayer', 'Songs for evening prayers', 'moon')
ON CONFLICT DO NOTHING;

-- Insert sample mezmurs
INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'እግዚአብሔር መልካም ነው (God is Good)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Praise' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'እግዚአብሔር መልካም ነው፣ እና ምህረቱ ለዘለዓለም ነው። ሁሉም ፍጥረት እርሱን ያመሰግነው፣ እና ስሙ ከፍተኛ ነው።',
  240000,
  'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'እግዚአብሔር መልካም ነው (God is Good)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'ቅዱስ ቅዱስ ቅዱስ (Holy Holy Holy)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Praise' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'ቅዱስ፣ ቅዱስ፣ ቅዱስ፣ ጌታ አምላክ ሁሉን ቻዩ፣ ምድር በእርሱ ክብር ሙልታለች።',
  180000,
  'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'ቅዱስ ቅዱስ ቅዱስ (Holy Holy Holy)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'የጸሎት ሰዓት (Prayer Time)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Morning Prayer' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'በማለዳ ጌታን እናመሰግናለን፣ እና ስሙን እንከብራለን። በጸሎት ይእዛዝ፣ እና ምህረቱን ይስጠን።',
  200000,
  'https://images.pexels.com/photos/1089306/pexels-photo-1089306.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'የጸሎት ሰዓት (Prayer Time)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'ቅድስት ማርያም (Saint Mary)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Saint' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'ቅድስት ማርያም፣ የእግዚአብሔር እናት፣ ለእኛ ጸልዪ፣ አሁን እና በሞት ጊዜያችን።',
  220000,
  'https://images.pexels.com/photos/161154/pexels-photo-161154.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'ቅድስት ማርያም (Saint Mary)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'ፋሲካ በዓል (Easter Celebration)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Holy Days' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'ክርስቶስ ከሙታን ተነሳ፣ እና ለሁላችን ህይወት ሰጠ። ፋሲካን እንደበር፣ በደስታ እና በማመስገን።',
  260000,
  'https://images.pexels.com/photos/208326/pexels-photo-208326.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'ፋሲካ በዓል (Easter Celebration)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'ማታ ጸሎት (Evening Prayer)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Evening Prayer' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'በማታ ጌታን እናመሰግናለን፣ ለዛሬው ስጦታዎች። ሰላም እና እረፍት ይስጠን፣ እና ነገ እንድንነቃ።',
  190000,
  'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'ማታ ጸሎት (Evening Prayer)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'የእምነት መዝሙር (Hymn of Faith)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Praise' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'እምነታችን በክርስቶስ ላይ ነው፣ ዋጋችን እና ድንቅ። በእርሱ ላይ እንመረኮዛለን፣ አሁን እና ለዘለዓለም።',
  210000,
  'https://images.pexels.com/photos/235994/pexels-photo-235994.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'የእምነት መዝሙር (Hymn of Faith)');

INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url) 
SELECT 
  'ቅዱስ ጊዮርጊስ (Saint George)',
  'የቤተክርስቲያን መዘምራን',
  (SELECT id FROM categories WHERE name = 'Saint' LIMIT 1),
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'ቅዱስ ጊዮርጊስ፣ ጀግና እና ሰማዕት፣ ለእኛ ጸልዪ፣ እና እኛን በትግልችን ይርዱን።',
  230000,
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM mezmurs WHERE title = 'ቅዱስ ጊዮርጊስ (Saint George)');