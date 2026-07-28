
WITH c AS (
  INSERT INTO public.couples (slug, bride_first_name_en, bride_first_name_ar, bride_last_name_en,
    groom_first_name_en, groom_first_name_ar, groom_last_name_en, hashtag, main_event_at, contact_email, contact_phone,
    bride_bio_en, bride_bio_ar, groom_bio_en, groom_bio_ar)
  VALUES ('abdelrhman-and-salma','Salma','سلمى','Hassan','Abdelrhman','عبدالرحمن','Fathy','#AbdelrhmanAndSalma',
    '2026-08-08T19:00:00+02:00','hello@abdelrhmanandsalma.com','+20 100 123 4567',
    'Architect, lover of old Cairo balconies.','مهندسة معمارية تعشق شرفات القاهرة القديمة.',
    'Software engineer, incurable romantic.','مهندس برمجيات ورومانسي حتى النخاع.')
  RETURNING id
), v AS (
  INSERT INTO public.venues (couple_id, name_en, name_ar, address_en, address_ar, city, country, maps_query, latitude, longitude, phone)
  SELECT c.id, x.name_en, x.name_ar, x.addr_en, x.addr_ar, 'Cairo','Egypt', x.q, x.lat, x.lng, x.phone FROM c, (VALUES
    ('The Grand Ballroom','القاعة الكبرى','Nile Ritz-Carlton, 1113 Corniche El Nil, Cairo','ريتز كارلتون النيل، ١١١٣ كورنيش النيل، القاهرة','Nile Ritz-Carlton Cairo',30.045300,31.233300,'+20 2 2577 8899'),
    ('Villa Zamalek Garden','حديقة فيلا الزمالك','12 Brazil St, Zamalek, Cairo','١٢ شارع البرازيل، الزمالك، القاهرة','Zamalek Cairo garden villa',30.061200,31.219400,'+20 2 2735 1122')
  ) AS x(name_en,name_ar,addr_en,addr_ar,q,lat,lng,phone)
  RETURNING id, name_en
), e AS (
  INSERT INTO public.events (couple_id, venue_id, event_type, title_en, title_ar, description_en, description_ar, starts_at, ends_at, dress_code_en, dress_code_ar, capacity, display_order)
  SELECT c.id,
    (SELECT id FROM v WHERE v.name_en = x.venue),
    x.etype::public.event_type, x.t_en, x.t_ar, x.d_en, x.d_ar, x.s::timestamptz, x.e::timestamptz, x.dc_en, x.dc_ar, x.cap, x.ord
  FROM c, (VALUES
    ('Villa Zamalek Garden','henna','Henna Night','ليلة الحنة','An intimate evening of music, henna and family.','أمسية حميمة من الموسيقى والحنة والعائلة.','2026-08-06T20:00:00+02:00','2026-08-07T00:00:00+02:00','Festive traditional','زي تقليدي احتفالي',80,1),
    ('The Grand Ballroom','engagement','The Engagement Ceremony','حفل الخطوبة','The moment we say yes, surrounded by everyone we love.','اللحظة التي نقول فيها نعم، وسط كل من نحب.','2026-08-08T19:00:00+02:00','2026-08-08T21:00:00+02:00','Black tie','بدلة رسمية',220,2),
    ('The Grand Ballroom','reception','Dinner & Reception','العشاء والاستقبال','Dinner, dancing and a very long playlist.','عشاء ورقص وقائمة أغاني طويلة جدًا.','2026-08-08T21:00:00+02:00','2026-08-09T02:00:00+02:00','Black tie','بدلة رسمية',220,3)
  ) AS x(venue,etype,t_en,t_ar,d_en,d_ar,s,e,dc_en,dc_ar,cap,ord)
  RETURNING id, event_type
), sch AS (
  INSERT INTO public.schedule_items (event_id, title_en, title_ar, starts_at, duration_minutes, icon, display_order)
  SELECT (SELECT id FROM e WHERE e.event_type = 'engagement'), x.t_en, x.t_ar, x.s::timestamptz, x.m, x.icon, x.ord FROM (VALUES
    ('Guest arrival & welcome drinks','وصول الضيوف ومشروبات الترحيب','2026-08-08T19:00:00+02:00',45,'glass',1),
    ('Ring exchange','تبادل الخواتم','2026-08-08T19:45:00+02:00',20,'rings',2),
    ('Family photographs','صور العائلة','2026-08-08T20:05:00+02:00',40,'camera',3),
    ('First dance','الرقصة الأولى','2026-08-08T21:15:00+02:00',10,'music',4),
    ('Cake & dessert table','الكيك وطاولة الحلويات','2026-08-08T22:00:00+02:00',30,'cake',5)
  ) AS x(t_en,t_ar,s,m,icon,ord)
  RETURNING id
), gg AS (
  INSERT INTO public.guest_groups (couple_id, name, side, max_guests, notes)
  SELECT c.id, x.name, x.side::public.guest_side, x.mx, x.notes FROM c, (VALUES
    ('The Hassan Family','bride',5,'Bride parents and siblings'),
    ('The Fathy Family','groom',4,'Groom parents and sister'),
    ('University Friends','both',6,'Loud table, seat far from speakers'),
    ('Work Colleagues','groom',4,NULL)
  ) AS x(name,side,mx,notes)
  RETURNING id, name
), g AS (
  INSERT INTO public.guests (couple_id, group_id, full_name, full_name_ar, email, phone, side, relationship, language_preference, is_child, dietary_notes)
  SELECT c.id, (SELECT id FROM gg WHERE gg.name = x.grp), x.nm, x.nm_ar, x.em, x.ph, x.side::public.guest_side, x.rel, x.lang, x.child, x.diet
  FROM c, (VALUES
    ('The Hassan Family','Mona Hassan','منى حسن','mona.hassan@example.com','+20 100 222 1111','bride','Mother of the bride','ar',false,NULL),
    ('The Hassan Family','Tarek Hassan','طارق حسن','tarek.hassan@example.com','+20 100 222 2222','bride','Father of the bride','ar',false,'No shellfish'),
    ('The Hassan Family','Nour Hassan','نور حسن','nour.hassan@example.com','+20 100 222 3333','bride','Sister of the bride','en',false,'Vegetarian'),
    ('The Fathy Family','Amira Fathy','أميرة فتحي','amira.fathy@example.com','+20 101 333 1111','groom','Mother of the groom','ar',false,NULL),
    ('The Fathy Family','Hossam Fathy','حسام فتحي','hossam.fathy@example.com','+20 101 333 2222','groom','Father of the groom','ar',false,NULL),
    ('University Friends','Youssef Adel','يوسف عادل','youssef.adel@example.com','+20 102 444 1111','both','Best friend','en',false,NULL),
    ('University Friends','Laila Mostafa','ليلى مصطفى','laila.mostafa@example.com','+20 102 444 2222','both','Maid of honour','en',false,'Gluten free'),
    ('Work Colleagues','Karim Sabry','كريم صبري','karim.sabry@example.com','+20 103 555 1111','groom','Colleague','en',false,NULL),
    ('Work Colleagues','Dina Ramy','دينا رامي','dina.ramy@example.com','+20 103 555 2222','groom','Colleague','en',false,NULL),
    ('The Hassan Family','Malak Hassan','ملك حسن',NULL,NULL,'bride','Niece','ar',true,NULL)
  ) AS x(grp,nm,nm_ar,em,ph,side,rel,lang,child,diet)
  RETURNING id, full_name, group_id
), inv AS (
  INSERT INTO public.invitations (couple_id, group_id, code, status, channel, allowed_guests, personal_message_en, sent_at, first_opened_at, opened_count, responded_at)
  SELECT c.id, (SELECT id FROM gg WHERE gg.name = x.grp), x.code, x.st::public.invitation_status, x.ch, x.allowed, x.msg, x.sent::timestamptz, x.opened::timestamptz, x.cnt, x.resp::timestamptz
  FROM c, (VALUES
    ('The Hassan Family','HASSAN-8F2A','responded','whatsapp',5,'We could not imagine this night without you.','2026-06-01T10:00:00+02:00','2026-06-01T12:14:00+02:00',7,'2026-06-02T09:30:00+02:00'),
    ('The Fathy Family','FATHY-3C71','responded','whatsapp',4,'With all our love.','2026-06-01T10:00:00+02:00','2026-06-01T11:02:00+02:00',5,'2026-06-01T18:45:00+02:00'),
    ('University Friends','UNI-9K44','opened','link',6,'Bring your dancing shoes.','2026-06-03T10:00:00+02:00','2026-06-04T20:11:00+02:00',3,NULL),
    ('Work Colleagues','WORK-5D18','sent','email',4,NULL,'2026-06-05T10:00:00+02:00',NULL,0,NULL)
  ) AS x(grp,code,st,ch,allowed,msg,sent,opened,cnt,resp)
  RETURNING id, code
), r AS (
  INSERT INTO public.rsvp_responses (couple_id, event_id, invitation_id, guest_id, display_name, email, phone, status, party_size, meal_preference, dietary_notes, song_request, message, language, source, responded_at)
  SELECT c.id,
    (SELECT id FROM e WHERE e.event_type = 'engagement'),
    (SELECT id FROM inv WHERE inv.code = x.code),
    (SELECT id FROM g WHERE g.full_name = x.nm),
    x.nm, x.em, x.ph, x.st::public.rsvp_status, x.sz, x.meal, x.diet, x.song, x.msg, x.lang, 'website', x.ts::timestamptz
  FROM c, (VALUES
    ('HASSAN-8F2A','Mona Hassan','mona.hassan@example.com','+20 100 222 1111','attending',3,'chicken',NULL,'Amr Diab - Tamally Maak','Counting the days, ya habibty.','ar','2026-06-02T09:30:00+02:00'),
    ('HASSAN-8F2A','Nour Hassan','nour.hassan@example.com','+20 100 222 3333','attending',1,'vegetarian','Vegetarian','Fairuz - Habbeytak Bel Sayf','So proud of you both.','en','2026-06-02T10:12:00+02:00'),
    ('FATHY-3C71','Amira Fathy','amira.fathy@example.com','+20 101 333 1111','attending',4,'beef',NULL,NULL,'Alf mabrouk!','ar','2026-06-01T18:45:00+02:00'),
    ('UNI-9K44','Youssef Adel','youssef.adel@example.com','+20 102 444 1111','tentative',2,'chicken',NULL,'Cairokee - Telk Qadeya','Will confirm once flights are booked.','en','2026-06-06T14:20:00+02:00'),
    ('UNI-9K44','Laila Mostafa','laila.mostafa@example.com','+20 102 444 2222','attending',1,'fish','Gluten free','Massar Egbari - Ahwak','Wouldn''t miss it for anything.','en','2026-06-06T15:02:00+02:00'),
    ('WORK-5D18','Karim Sabry','karim.sabry@example.com','+20 103 555 1111','declined',0,NULL,NULL,NULL,'Travelling that week, congratulations!','en','2026-06-08T08:00:00+02:00')
  ) AS x(code,nm,em,ph,st,sz,meal,diet,song,msg,lang,ts)
  RETURNING id
), st AS (
  INSERT INTO public.story_milestones (couple_id, title_en, title_ar, body_en, body_ar, happened_on, label, display_order)
  SELECT c.id, x.t_en, x.t_ar, x.b_en, x.b_ar, x.d::date, x.lb, x.ord FROM c, (VALUES
    ('The First Look','النظرة الأولى','A crowded lecture hall in Cairo, one empty seat, and a conversation that never really ended.','قاعة محاضرات مزدحمة في القاهرة، مقعد فارغ واحد، وحديث لم ينتهِ أبدًا.','2019-10-14','2019',1),
    ('The First Trip','أول رحلة','Dahab, a rented motorbike, and the realisation that home is a person.','دهب، دراجة مستأجرة، وإدراك أن الوطن شخص.','2021-05-02','2021',2),
    ('The Long Distance Year','عام المسافات','Two cities, three time zones, and one very reliable 11pm phone call.','مدينتان، ثلاث مناطق زمنية، ومكالمة واحدة في الحادية عشرة مساءً.','2023-01-20','2023',3),
    ('The Question','السؤال','On a balcony overlooking the Nile, with shaking hands and a small velvet box.','على شرفة تطل على النيل، بيدين ترتجفان وعلبة مخملية صغيرة.','2025-12-24','2025',4),
    ('The Beginning','البداية','And now, the part where we invite everyone we love.','والآن، الجزء الذي ندعو فيه كل من نحب.','2026-08-08','2026',5)
  ) AS x(t_en,t_ar,b_en,b_ar,d,lb,ord)
  RETURNING id
), al AS (
  INSERT INTO public.gallery_albums (couple_id, slug, title_en, title_ar, allows_guest_uploads, display_order)
  SELECT c.id, x.slug, x.t_en, x.t_ar, x.up, x.ord FROM c, (VALUES
    ('engagement-shoot','Engagement Shoot','جلسة تصوير الخطوبة',false,1),
    ('through-the-years','Through The Years','عبر السنين',false,2),
    ('guest-uploads','Guest Uploads','صور الضيوف',true,3)
  ) AS x(slug,t_en,t_ar,up,ord)
  RETURNING id, slug
), gm AS (
  INSERT INTO public.gallery_media (couple_id, album_id, media_type, url, caption_en, caption_ar, alt_text, width, height, moderation, is_featured, uploaded_by_guest_name, uploaded_via_qr, display_order)
  SELECT c.id, (SELECT id FROM al WHERE al.slug = x.alb), x.mt::public.media_type, x.url, x.cap_en, x.cap_ar, x.alt, x.w, x.h, x.mod::public.moderation_status, x.feat, x.by, x.qr, x.ord
  FROM c, (VALUES
    ('engagement-shoot','image','https://images.example.com/eng-01.jpg','Golden hour on the Nile','ساعة ذهبية على النيل','Couple standing by the Nile at sunset',1600,2000,'approved',true,NULL,false,1),
    ('engagement-shoot','image','https://images.example.com/eng-02.jpg','The ring','الخاتم','Close up of the engagement ring',1600,1600,'approved',false,NULL,false,2),
    ('engagement-shoot','image','https://images.example.com/eng-03.jpg','Laughing between takes','ضحك بين اللقطات','Couple laughing together',1600,2400,'approved',false,NULL,false,3),
    ('through-the-years','image','https://images.example.com/years-01.jpg','Dahab, 2021','دهب، ٢٠٢١','Two people on a beach',1600,1200,'approved',false,NULL,false,1),
    ('through-the-years','image','https://images.example.com/years-02.jpg','Graduation day','يوم التخرج','Graduation photo',1600,1200,'approved',false,NULL,false,2),
    ('guest-uploads','image','https://images.example.com/guest-01.jpg','From the henna night','من ليلة الحنة','Guests dancing',1200,1600,'pending',false,'Laila Mostafa',true,1),
    ('guest-uploads','video','https://videos.example.com/guest-02.mp4','First dance clip','مقطع الرقصة الأولى','Video of the first dance',1080,1920,'pending',false,'Youssef Adel',true,2)
  ) AS x(alb,mt,url,cap_en,cap_ar,alt,w,h,mod,feat,by,qr,ord)
  RETURNING id
), ri AS (
  INSERT INTO public.registry_items (couple_id, title_en, title_ar, description_en, description_ar, store_name, external_url, price, currency, quantity_wanted, quantity_claimed, allows_cash_contribution, display_order)
  SELECT c.id, x.t_en, x.t_ar, x.d_en, x.d_ar, x.store, x.url, x.price, 'EGP', x.want, x.claimed, x.cash, x.ord FROM c, (VALUES
    ('Espresso Machine','ماكينة إسبريسو','Because mornings matter.','لأن الصباح مهم.','Home Cairo','https://store.example.com/espresso',18500.00,1,0,false,1),
    ('Handmade Ceramic Dinner Set','طقم عشاء سيراميك يدوي','Twelve pieces, made in Fayoum.','اثنتا عشرة قطعة، صناعة الفيوم.','Fayoum Pottery','https://store.example.com/ceramics',7200.00,1,1,false,2),
    ('Weekend in Siwa','عطلة في سيوة','Contribute to our first trip as fiancés.','ساهم في أول رحلة لنا كخطيبين.',NULL,NULL,NULL,1,0,true,3),
    ('Linen Bedding Set','طقم مفروشات كتان','King size, ivory.','مقاس كينج، لون عاجي.','Beit Textiles','https://store.example.com/linen',4300.00,2,1,false,4)
  ) AS x(t_en,t_ar,d_en,d_ar,store,url,price,want,claimed,cash,ord)
  RETURNING id, title_en
), rc AS (
  INSERT INTO public.registry_contributions (registry_item_id, guest_id, contributor_name, contributor_email, quantity, amount, currency, note, is_anonymous, status)
  SELECT (SELECT id FROM ri WHERE ri.title_en = x.item), (SELECT id FROM g WHERE g.full_name = x.nm), x.nm, x.em, x.q, x.amt, 'EGP', x.note, x.anon, x.st
  FROM (VALUES
    ('Handmade Ceramic Dinner Set','Laila Mostafa','laila.mostafa@example.com',1,7200.00,'Every dinner party starts here.',false,'paid'),
    ('Linen Bedding Set','Karim Sabry','karim.sabry@example.com',1,4300.00,NULL,false,'pledged'),
    ('Weekend in Siwa','Youssef Adel','youssef.adel@example.com',1,3000.00,'Send postcards.',true,'pledged')
  ) AS x(item,nm,em,q,amt,note,anon,st)
  RETURNING id
), stb AS (
  INSERT INTO public.seating_tables (event_id, name, shape, seats, position_x, position_y, notes)
  SELECT (SELECT id FROM e WHERE e.event_type = 'reception'), x.nm, x.shape, x.seats, x.px, x.py, x.notes FROM (VALUES
    ('Head Table','head',6,50.00,10.00,'Couple and parents'),
    ('Table 1','round',8,20.00,40.00,NULL),
    ('Table 2','round',8,50.00,40.00,NULL),
    ('Table 3','round',8,80.00,40.00,'Far from the speakers')
  ) AS x(nm,shape,seats,px,py,notes)
  RETURNING id, name
), sa AS (
  INSERT INTO public.seat_assignments (table_id, guest_id, seat_number)
  SELECT (SELECT id FROM stb WHERE stb.name = x.tb), (SELECT id FROM g WHERE g.full_name = x.nm), x.seat FROM (VALUES
    ('Head Table','Mona Hassan',1),
    ('Head Table','Tarek Hassan',2),
    ('Head Table','Amira Fathy',3),
    ('Head Table','Hossam Fathy',4),
    ('Table 1','Nour Hassan',1),
    ('Table 1','Malak Hassan',2),
    ('Table 3','Youssef Adel',1),
    ('Table 3','Laila Mostafa',2),
    ('Table 2','Dina Ramy',1)
  ) AS x(tb,nm,seat)
  RETURNING id
), pt AS (
  INSERT INTO public.playlist_tracks (couple_id, title, artist, provider, external_url, duration_seconds, is_couple_pick, requested_by_name, moderation, display_order)
  SELECT c.id, x.t, x.a, x.p, x.u, x.d, x.pick, x.by, x.mod::public.moderation_status, x.ord FROM c, (VALUES
    ('Tamally Maak','Amr Diab','spotify','https://open.spotify.com/track/example1',292,true,NULL,'approved',1),
    ('Habbeytak Bel Sayf','Fairuz','spotify','https://open.spotify.com/track/example2',248,true,NULL,'approved',2),
    ('Ahwak','Massar Egbari','youtube','https://youtube.com/watch?v=example3',274,false,'Laila Mostafa','approved',3),
    ('Telk Qadeya','Cairokee','spotify','https://open.spotify.com/track/example4',311,false,'Youssef Adel','pending',4),
    ('Nour El Ein','Amr Diab','spotify','https://open.spotify.com/track/example5',265,false,'Dina Ramy','pending',5)
  ) AS x(t,a,p,u,d,pick,by,mod,ord)
  RETURNING id, title
), pv AS (
  INSERT INTO public.playlist_votes (track_id, voter_fingerprint, guest_id)
  SELECT (SELECT id FROM pt WHERE pt.title = x.tr), x.fp, (SELECT id FROM g WHERE g.full_name = x.nm) FROM (VALUES
    ('Tamally Maak','fp-9f21ac77b0','Mona Hassan'),
    ('Tamally Maak','fp-3b81de44c2','Nour Hassan'),
    ('Ahwak','fp-77aa10bb93','Laila Mostafa'),
    ('Ahwak','fp-2c40ee18a5','Youssef Adel'),
    ('Habbeytak Bel Sayf','fp-58cd90ff31','Amira Fathy')
  ) AS x(tr,fp,nm)
  RETURNING id
), msg AS (
  INSERT INTO public.guest_messages (couple_id, guest_id, author_name, body, color, language, moderation, is_pinned)
  SELECT c.id, (SELECT id FROM g WHERE g.full_name = x.nm), x.nm, x.body, x.color, x.lang, x.mod::public.moderation_status, x.pin FROM c, (VALUES
    ('Mona Hassan','ربنا يتمم لكم على خير ويسعدكم دايمًا.','#D4AF37','ar','approved',true),
    ('Youssef Adel','Ten years of friendship and I still get to be at the best table. Congratulations.','#E8C874','en','approved',false),
    ('Laila Mostafa','From lecture halls to this. So happy for you both.','#C9A227','en','approved',false),
    ('Dina Ramy','Wishing you a lifetime of quiet mornings and loud celebrations.','#F0DFA8','en','pending',false),
    ('Amira Fathy','ألف مبروك يا حبايبي، عقبال الفرح.','#D4AF37','ar','approved',false)
  ) AS x(nm,body,color,lang,mod,pin)
  RETURNING id
), dr AS (
  INSERT INTO public.guest_drawings (couple_id, guest_id, author_name, image_url, stroke_count, moderation)
  SELECT c.id, (SELECT id FROM g WHERE g.full_name = x.nm), x.nm, x.url, x.strokes, x.mod::public.moderation_status FROM c, (VALUES
    ('Nour Hassan','https://images.example.com/sketch-01.png',142,'approved'),
    ('Malak Hassan','https://images.example.com/sketch-02.png',88,'approved'),
    ('Karim Sabry','https://images.example.com/sketch-03.png',51,'pending')
  ) AS x(nm,url,strokes,mod)
  RETURNING id
), vn AS (
  INSERT INTO public.voice_notes (couple_id, guest_id, author_name, audio_url, duration_seconds, transcript, language, moderation)
  SELECT c.id, (SELECT id FROM g WHERE g.full_name = x.nm), x.nm, x.url, x.dur, x.tr, x.lang, x.mod::public.moderation_status FROM c, (VALUES
    ('Tarek Hassan','https://audio.example.com/voice-01.webm',34,'صوت الأب وهو يدعو لهما بالسعادة.','ar','approved'),
    ('Laila Mostafa','https://audio.example.com/voice-02.webm',22,'A short toast from the maid of honour.','en','approved'),
    ('Hossam Fathy','https://audio.example.com/voice-03.webm',47,NULL,'ar','pending')
  ) AS x(nm,url,dur,tr,lang,mod)
  RETURNING id
), cm AS (
  INSERT INTO public.contact_messages (couple_id, name, email, phone, subject, body)
  SELECT c.id, x.nm, x.em, x.ph, x.subj, x.body FROM c, (VALUES
    ('Rania Adel','rania.adel@example.com','+20 106 777 8888','Plus one question','Can I bring my husband? He is travelling with me from Alexandria.'),
    ('Bloom & Co Florist','orders@bloomco.example.com',NULL,'Delivery access','We need the loading bay contact for the ballroom on the 8th.')
  ) AS x(nm,em,ph,subj,body)
  RETURNING id
), nt AS (
  INSERT INTO public.notifications (couple_id, guest_id, channel, template_key, payload, scheduled_for, sent_at, status)
  SELECT c.id, (SELECT id FROM g WHERE g.full_name = x.nm), x.ch, x.tmpl, x.payload::jsonb, x.sched::timestamptz, x.sent::timestamptz, x.st FROM c, (VALUES
    ('Mona Hassan','whatsapp','invitation_sent','{"code":"HASSAN-8F2A"}','2026-06-01T10:00:00+02:00','2026-06-01T10:00:12+02:00','sent'),
    ('Youssef Adel','email','rsvp_reminder','{"days_left":14}','2026-07-25T09:00:00+02:00',NULL,'queued'),
    ('Dina Ramy','email','rsvp_reminder','{"days_left":14}','2026-07-25T09:00:00+02:00',NULL,'queued'),
    ('Laila Mostafa','sms','event_day_details','{"event":"engagement"}','2026-08-08T09:00:00+02:00',NULL,'queued')
  ) AS x(nm,ch,tmpl,payload,sched,sent,st)
  RETURNING id
), ss AS (
  INSERT INTO public.site_settings (couple_id, key, value, is_public, description)
  SELECT c.id, x.k, x.v::jsonb, x.pub, x.d FROM c, (VALUES
    ('default_language','"en"',true,'Language used on first visit'),
    ('rsvp_deadline','"2026-07-25"',true,'Last day to respond'),
    ('features','{"guest_wall":true,"drawings":true,"voice_notes":true,"registry":true,"qr_upload":true,"music_requests":true}',true,'Toggles for interactive sections'),
    ('moderation','{"auto_approve_messages":false,"auto_approve_uploads":false}',false,'Moderation behaviour'),
    ('theme','{"palette":"onyx-gold","intro_animation":true,"floating_hearts":true}',true,'Visual configuration'),
    ('notification_sender','{"from_name":"Abdelrhman & Salma","reply_to":"hello@abdelrhmanandsalma.com"}',false,'Outgoing message identity')
  ) AS x(k,v,pub,d)
  RETURNING id
)
INSERT INTO public.activity_logs (couple_id, actor_label, action, entity_table, metadata)
SELECT c.id, x.actor, x.action, x.tbl, x.meta::jsonb FROM c, (VALUES
  ('system','invitations.bulk_sent','invitations','{"count":4,"channel":"mixed"}'),
  ('guest','rsvp.submitted','rsvp_responses','{"count":6}'),
  ('admin','gallery.album_created','gallery_albums','{"slug":"guest-uploads"}'),
  ('admin','settings.updated','site_settings','{"key":"rsvp_deadline"}')
) AS x(actor,action,tbl,meta);
