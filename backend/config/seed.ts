import { pool } from './db';

export const seedDB = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    // 1. Seed Users if not present
    const userCount = await client.query('SELECT count(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding initial users...');
      await client.query(`
        INSERT INTO users (id, name, email, phone, password, role, status, profile_image, address, bio, emergency_contact)
        VALUES 
        (
          'usr_member_1', 
          'Shakib Hossain', 
          'shakib@gymflow.bd', 
          '+880 1711-223344', 
          '123456', 
          'USER', 
          'ACTIVE', 
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBVGl8qM5oils_El7PD239TLmYsw9ePhapZlNOjGvFyqtVBGmWA5tLFft7yhav9jn14zXpB1jaqRSi5Od4yVej32dldB7-D86J83Wv--JF83p7wCAF8NDdosOZG5qckibUDmkpZm0tFlBPzcP4OnZre2_UcxQt6Osu8Yj4fY_Ic44Gt5MudwQgshBU3-Qm_kpHsl1rHRZJn_aSo6YoGxbRAsTooatLsEz2nY27EtpmxMLf_fs3f_fYnPA',
          'House 24, Road 11, Banani, Dhaka-1213',
          'Corporate Tech Lead & morning fitness enthusiast. Training for competitive half-marathon.',
          '+880 1711-998877'
        ),
        (
          'usr_admin_1', 
          'GymFlow Director (Admin)', 
          'admin@gymflow.bd', 
          '+880 1711-000000', 
          '123456', 
          'ADMIN', 
          'ACTIVE', 
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          'Plot 42, Road 11, Block D, Banani, Dhaka',
          'Chief Operations & Performance Director, GymFlow BD.',
          '+880 1711-000000'
        ),
        (
          'usr_member_2', 
          'Rashed Al-Mamun', 
          'rashed.power@gmail.com', 
          '+880 1822-445566', 
          '123456', 
          'USER', 
          'ACTIVE', 
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          'Gulshan 2, Dhaka',
          'Competitive Powerlifter • Pro Tier Member',
          '+880 1822-445566'
        ),
        (
          'usr_member_3', 
          'Nadia Chowdhury', 
          'nadia.c@outlook.com', 
          '+880 1911-332211', 
          '123456', 
          'USER', 
          'ACTIVE', 
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          'Dhanmondi, Dhaka',
          'Pilates and HIIT enthusiast.',
          '+880 1911-332211'
        )
        ON CONFLICT (email) DO UPDATE SET 
          address = EXCLUDED.address,
          bio = EXCLUDED.bio,
          emergency_contact = EXCLUDED.emergency_contact,
          profile_image = EXCLUDED.profile_image;
      `);
    } else {
      // Ensure admin and member profiles have full fields
      await client.query(`
        UPDATE users SET 
          address = COALESCE(address, 'House 24, Road 11, Banani, Dhaka-1213'),
          bio = COALESCE(bio, 'Banani athlete training with GymFlow BD.'),
          emergency_contact = COALESCE(emergency_contact, '+880 1711-998877'),
          profile_image = COALESCE(profile_image, avatar, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVGl8qM5oils_El7PD239TLmYsw9ePhapZlNOjGvFyqtVBGmWA5tLFft7yhav9jn14zXpB1jaqRSi5Od4yVej32dldB7-D86J83Wv--JF83p7wCAF8NDdosOZG5qckibUDmkpZm0tFlBPzcP4OnZre2_UcxQt6Osu8Yj4fY_Ic44Gt5MudwQgshBU3-Qm_kpHsl1rHRZJn_aSo6YoGxbRAsTooatLsEz2nY27EtpmxMLf_fs3f_fYnPA')
        WHERE email = 'shakib@gymflow.bd';

        UPDATE users SET 
          role = 'ADMIN',
          address = COALESCE(address, 'Plot 42, Road 11, Block D, Banani, Dhaka'),
          bio = COALESCE(bio, 'Chief Operations & Performance Director, GymFlow BD.'),
          emergency_contact = COALESCE(emergency_contact, '+880 1711-000000'),
          profile_image = COALESCE(profile_image, avatar, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
        WHERE email = 'admin@gymflow.bd';
      `);
    }

    // 2. Seed Plans if not present
    const planCount = await client.query('SELECT count(*) FROM membership_plans');
    if (parseInt(planCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding membership plans...');
      await client.query(`
        INSERT INTO membership_plans (id, name, description, duration_days, duration_months, price, interval_label, badge, is_popular, features, unavailable_features, is_active)
        VALUES 
        (
          'plan_starter',
          'Monthly Starter',
          'Ideal for dedicated local fitness enthusiasts testing their athletic limits.',
          30,
          1,
          3500.00,
          '/ month',
          'Standard',
          FALSE,
          ARRAY['Full gym floor and cardio access', 'Standard day locker and shower suites', 'Mobile QR check-in credentials'],
          ARRAY['Nordic Steam room & sauna access', 'Free personal trainer induction'],
          TRUE
        ),
        (
          'plan_pro',
          '3-Month Pro',
          'Comprehensive strength transformation with specialized coach guidance.',
          90,
          3,
          9500.00,
          '/ quarter',
          'Most Popular',
          TRUE,
          ARRAY['All Standard inclusions', 'Nordic Steam room & Finnish sauna access', 'Free 1-on-1 CSCS coach induction session', 'Personalized macronutrient guide', 'Priority shower locker access'],
          ARRAY['Free GymFlow branded performance wear'],
          TRUE
        ),
        (
          'plan_elite',
          'Annual Elite',
          'The ultimate championship experience with full VIP perks and priority access.',
          365,
          12,
          32000.00,
          '/ year',
          'VIP Privilege',
          FALSE,
          ARRAY['All Pro inclusions', 'Dedicated permanent VIP day locker', 'Complimentary GymFlow athlete duffel & tee', 'Quarterly DEXA body-composition analysis', '30-day membership pause option', '1 guest pass per month'],
          ARRAY[]::TEXT[],
          TRUE
        )
        ON CONFLICT (id) DO NOTHING;
      `);
    } else {
      // Ensure existing plans have duration_days and descriptions filled
      await client.query(`
        UPDATE membership_plans SET 
          description = COALESCE(description, 'Comprehensive strength and conditioning pass at Banani flagship.'),
          duration_days = COALESCE(duration_days, duration_months * 30, 30),
          interval_label = COALESCE(interval_label, '/ month'),
          is_active = TRUE;
      `);
    }

    // 3. Seed Memberships if not present
    const memCount = await client.query('SELECT count(*) FROM memberships');
    if (parseInt(memCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding sample memberships...');
      const shakib = await client.query("SELECT id FROM users WHERE email = 'shakib@gymflow.bd' LIMIT 1");
      const shakibId = shakib.rows[0]?.id || 'usr_member_1';

      await client.query(`
        INSERT INTO memberships (id, user_id, plan_id, plan_name, status, start_date, end_date, auto_renew, price, days_remaining, benefits)
        VALUES (
          'mem_shakib_active',
          $1,
          'plan_pro',
          '3-Month Pro',
          'ACTIVE',
          NOW() - INTERVAL '25 days',
          NOW() + INTERVAL '65 days',
          TRUE,
          9500.00,
          65,
          ARRAY['Full gym floor and cardio access', 'Nordic Steam room & Finnish sauna', '1-on-1 CSCS coach induction', 'Personalized macronutrient guide']
        );
      `, [shakibId]);
    }

    // 4. Seed Payments if not present
    const payCount = await client.query('SELECT count(*) FROM payments');
    if (parseInt(payCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding sample payments...');
      const shakib = await client.query("SELECT id FROM users WHERE email = 'shakib@gymflow.bd' LIMIT 1");
      const shakibId = shakib.rows[0]?.id || 'usr_member_1';

      await client.query(`
        INSERT INTO payments (id, user_id, user_name, user_email, membership_id, plan_id, plan_name, transaction_id, amount, currency, payment_method, status, gateway_response, created_at, verified_at)
        VALUES 
        (
          'pay_001',
          $1,
          'Shakib Hossain',
          'shakib@gymflow.bd',
          'mem_shakib_active',
          'plan_pro',
          '3-Month Pro',
          'SSL-TXN-984210952',
          9500.00,
          'BDT',
          'bKash',
          'SUCCESS',
          'SSLCOMMERZ VALIDATED: BANK_TRAN_ID: BKSH_89230198_SUCCESS',
          NOW() - INTERVAL '25 days',
          NOW() - INTERVAL '25 days'
        )
        ON CONFLICT (transaction_id) DO NOTHING;
      `, [shakibId]);
    }

    // 5. Seed Trainers if not present
    const trainerCount = await client.query('SELECT count(*) FROM trainers');
    if (parseInt(trainerCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding trainers...');
      await client.query(`
        INSERT INTO trainers (id, name, image, specialization, badge, experience, certifications, bio, athletes_mentored, is_active, rating, schedule)
        VALUES 
        (
          'tr_1',
          'Tanvir Ahmed',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA6SNopc0FpSGHhiXJvfz1CWZCxCXrt0X9CNd-AZwz4ZkOO8Y9yxKUHMTaf4CB6dpkLrABi30RIEYNA6O7jxY_s4vVr5EXLP_pwHdLCAk8uIXeTEySCn3ygu9qpcxf8ElVD76lSijt3BQmTKk9KkR8-9M6pGPV9CKfbB36Ksx6PmtdyAu7xS0K6iTRyTTPcd1INIiOdm6Latc2VOntVDJ0AprFt8WwxRu5ZEpnEZNAJD2vmZV9TwB4qMw',
          'Competitive powerlifting prep, compound mechanics, and neuromuscular speed adaptations.',
          'CSCS Strength Coach',
          '8+ Yrs Exp',
          ARRAY['NSCA Certified CSCS', 'Eleiko Level 2 Coach', 'Bangalore Barbell Biomechanics'],
          'Head Strength Director at GymFlow BD. Mentored multiple national medalists in powerlifting and athletic performance conditioning.',
          140,
          TRUE,
          4.90,
          ARRAY['Mon, Wed, Fri (6:00 AM - 1:00 PM)', 'Tue, Thu (3:00 PM - 9:00 PM)']
        ),
        (
          'tr_2',
          'Nusrat Jahan',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB2RMrgv1Bz2v7vivvgf-xJnCXwp5Z0yGgP5Rrs2cGQAQOAqK4F333gaLnPv8zwkxlYYdJFx8riJXhMxBZl46ufm8vLA4KAFGEhtBp_pgOfVzZz2OWM99Q2wyCDspFyFZbquBlXCddNFJyVRnZT-MvKrUqm3Y141VtT41tVciMa0_EwkE76PRwi2ThOshhTB-RYUqkEx_Prau8XF2_YV1gcTJoJ669mvJqJmBy1em3ctiu_zLs0ZGLeVQ',
          'Female kinetic biomechanics, pre/post-natal fitness conditioning, and metabolic interval programming.',
          'Functional & HIIT Specialist',
          '6+ Yrs Exp',
          ARRAY['ACE Certified Personal Trainer', 'Precision Nutrition Level 1', 'CrossFit Level 1 Coach'],
          'Pioneering functional kinetic conditioning for Dhaka executive women and athletes, balancing hypertrophy with cardiovascular longevity.',
          95,
          TRUE,
          4.95,
          ARRAY['Daily Morning Slots (7:00 AM - 11:30 AM)', 'Evening HIIT (5:00 PM - 8:30 PM)']
        ),
        (
          'tr_3',
          'Farhan Kabir',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4eURrSr0sBtVF0K_zbJ_CaN6JgGwok2nMNR8uKoT_Bb_QRmslIyDI2zAflblHsSH3U-0u8zHiSGXW0VBlhe_6Lbs1VXg-SfJf5fviklGPbuhYawFrbizVF2ogrcQX9xqZG9BtQicnx07CgodKcg-9fkdZJmjh5Wmg8y1PJrLgIZM96as5kF0s39tksbQtMvnoQVyxLBRj5RhXuLLipQaxmGniB6n3_D68rJAutE9USNpVvIFHCchbQQ',
          'National physique titleholder concentrating on hyper-specific muscle isolation, stage posing, and peak macros.',
          'Bodybuilding Champion',
          '10+ Yrs Exp',
          ARRAY['IFBB Pro Prep Specialist', 'ISSA Master Trainer', 'Sports Nutrient Timing Protocol'],
          '2-time National Bodybuilding Champion. Master of progressive tension overload and muscle symmetry modeling for competitive athletes.',
          200,
          TRUE,
          4.88,
          ARRAY['Mon to Sat (4:00 PM - 10:30 PM)']
        )
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    // 6. Seed Facilities if not present
    const facCount = await client.query('SELECT count(*) FROM facilities');
    if (parseInt(facCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding facilities...');
      await client.query(`
        INSERT INTO facilities (id, name, zone_code, tag, floor, category, description, image, features, equipment_list, is_active)
        VALUES 
        (
          'fac_1',
          'Strength & Powerlifting Zone',
          'ZONE 01 • HEAVY IRON',
          'Floor 1',
          1,
          'iron',
          '5 dedicated competition-grade platforms, calibrated Rogue and Eleiko plates, monolifts, and specialized power bars for high-performance lifters.',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCikR6E09fGLcTdu1kyMEVs9al1JGGb0hGcJUyHGih4GhQZy3lYD-NBOXXNaX1rOHOAMXHfUzHMrNv8YBO98tBLo7NCz2Yoo5y6YygxhghOF9VTVeNIqj-BNbQgugzHTO9RHZTQhT3ybztcvLAcyLerTXMu1tFKBHcHy5C7zphF5yuam1ekRfYtE41ujg_l5kFiobn86v8V3UVStxJamOfdqyf6atYziG3Y1M4WZGqMpytJ1pkn1QDfGQ',
          ARRAY['5 Competition Olympic Lifting Platforms', 'Calibrated Steel Eleiko & Rogue Plates', 'Texas Power Bars & Deadlift Bars', 'Chalk stations & Heavy Monolift'],
          ARRAY['Eleiko IPF Certified Bars', 'Rogue Calibrated KG Plates', 'Custom Rig System', 'Belt Squat Machine'],
          TRUE
        ),
        (
          'fac_2',
          'Olympic Free Weights',
          'ZONE 02',
          'Floor 1',
          1,
          'weights',
          'Dumbbells scaling to 60kg, incline benches, and ergonomic cable towers.',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDSj0zOa_4z3GmS7ecJ7j1Wf98U8ctFyg2zNu3WVNf_0VAFWB9svz-X6mMBrha-vFKVHMu-49bGeM6WQLo-X8h9ZoTRCSD7BBdCdUCrC69cvazbGPiswMM6um2ooaPGoBGfsGgXvSNXVz8xnArC-x9O8gsm6Pre5ZiMyu9BLLUeIZaZKMWXi-45UCJ_-onunD4r-rdumI-1uC3xBxmjrZo5xcWhx2uw9C-9ikpqqzWH-cYxKR74BepYNw',
          ARRAY['Urethane Dumbbells from 2kg up to 60kg', '8 Adjustable Precision Incline/Decline Benches', 'Multi-stack 8-station Cable Crossover', 'Dual Lat Pulldown & Seated Row Towers'],
          ARRAY['ZIVA Premium Urethane Hex Dumbbells', 'Technogym Biostrength Dual Pulleys', 'Preacher Curl Benches'],
          TRUE
        ),
        (
          'fac_3',
          'Cardio & HIIT Theater',
          'ZONE 03',
          'Floor 2',
          2,
          'cardio',
          'Curved manual sprinters, Concept2 Rowers, and real-time heart metrics telemetry.',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gUhFUOsryN_NRnWhUpSe4H5IQhGaYUwi6tyeFQiTzTankDgHwTChC-JwCrbmM4U8yj__u-fAMxfxtpNhSSWTbX4g_2zR-PvfZjIiY2clDb8k4JZU6-uXedIc-y6sDJHxwUWfOfSNirIG42F6-S7loGDktS4fMn7cLS4VewNUjQO9Zy-RnApJHcp6WyB-KhlbsDg64kMJ7eWPux2mlGK_rZX38at5YBuc7yFsgEyVXxG7C9jnLbASGw',
          ARRAY['Technogym Skillmill Curved Non-Motorized Sprinters', 'Concept2 SkiErg & RowErg Fleet', 'Assault AirBike Pro Units', 'Interactive Large Screen Pulse Telemetry'],
          ARRAY['Skillrun Treadmills with Sled Push mode', 'Concept2 PM5 Ergometers', 'Wattbike AtomX Trainers'],
          TRUE
        ),
        (
          'fac_4',
          'Luxury Steam & Locker Suites',
          'ZONE 04 • RECOVERY',
          'Floor 3',
          3,
          'recovery',
          'Finnish dry saunas, cold plunge baths, and digital biometric RFID personal lockers.',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsOQtd3y7SbrwDkVL10-xYKBYlWqQBuiP_iNVlCYBVjNhvA0jrGAecM_pY4R5XUmZDnzdFPNyAtNvICpxCFd0JWG5cnYLIAN1FD74BUv10GCifnzmJ-KS4Ag2BfCiw0mPqSn3357z7xc34XXMgZzdWvF08HSfiWl-ManwcHICIEJYxu2aIMDBt2xVl8utZf44GErbPRT18LsW74OStXdCB97Z4JlwktWlgsw4ZvFNqHeQUGmK39A_Pg',
          ARRAY['Nordic Cedarwood 85°C Dry Sauna', 'Eucalyptus Infused Aromatherapy Steam Room', '50°F Chilled Cold Plunge Basin', 'RFID Keyless Waterproof Wristband Lockers'],
          ARRAY['Harvia Sauna Heaters', 'Rain Dance Hydrotherapy Showers', 'Dyson Supersonic Locker Stations'],
          TRUE
        ),
        (
          'fac_5',
          'Juice & Nutrition Hub',
          'ZONE 05',
          'Floor 3',
          3,
          'nutrition',
          'Fresh cold-pressed juices, isolate protein smoothies, and sports electrolyte bars.',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZifffRw_-JYPoYAdZj8ZgMCC-ms-9Pk_HBs_eACnrSH-gPvF_IYB2wSMO3ay4kMxc58k12VKzfjQsWEF1uA7HWwg5uh20pW3wZwn-XuGQekVwVLeJeM5CF3nWdWfYx4Cnxh5EjAgtEytj522yB2j8OaxPoB_Nz41o6c4q9U6p5Kvc7X5YF5x-IFMzdVHNQlRcrPSwHHMBw5ALgNRO3FsISO7t3B9riYP0Xb99eFb3QVryR1m8mAuHlA',
          ARRAY['Fresh Cold-Pressed Raw Juices', 'Optimum Nutrition Gold Standard Whey Shakes', 'Electrolyte & BCAA Draft Taps', 'Dietitian Customized Meal Prep Pickup'],
          ARRAY['Commercial Cold-Press Extractor', 'Blendtec Commercial Blenders', 'Temperature Controlled Grab-N-Go'],
          TRUE
        )
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    // 7. Seed FAQs if not present
    const faqCount = await client.query('SELECT count(*) FROM faqs');
    if (parseInt(faqCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding FAQs...');
      await client.query(`
        INSERT INTO faqs (id, question, answer, category)
        VALUES 
        (
          'faq_1',
          'How do I access the gym after online payment?',
          'Upon successful SSLCOMMERZ verification, your GymFlow digital membership is instantly enabled inside your Member Dashboard. Simply give your name or phone number at our Banani reception desk for seamless entry.',
          'membership'
        ),
        (
          'faq_2',
          'What payment methods are supported in Bangladesh?',
          'We accept all local MFS solutions including bKash, Nagad, and Rocket, along with local and international VISA, MasterCard, and American Express cards via SSLCOMMERZ gateway.',
          'payment'
        ),
        (
          'faq_3',
          'Can I pause my subscription if I am traveling?',
          'Yes, Annual Elite members can pause their membership for up to 30 days per year directly from the Member Dashboard. 3-Month Pro members can request up to 14 days freeze.',
          'membership'
        ),
        (
          'faq_4',
          'Are dedicated personal lockers and saunas free?',
          'Standard day-use lockers and showers are free for all members. Unlimited Swedish dry sauna and steam suites are fully complimentary for 3-Month Pro and Annual Elite packages.',
          'facilities'
        ),
        (
          'faq_5',
          'What are the operating hours for the Banani club?',
          'GymFlow BD is open every single day from 6:00 AM to 11:00 PM, including government holidays. Trainer availability spans across morning, afternoon, and evening slots.',
          'rules'
        ),
        (
          'faq_6',
          'Can I book a 1-on-1 personal trainer induction?',
          'Yes! Both 3-Month Pro and Annual Elite packages include a free private coaching induction with one of our certified mentors (CSCS, ACE, IFBB). You can schedule directly from the Trainers section.',
          'facilities'
        )
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    console.log('[Seed] Database baseline seeding complete.');
  } catch (error: any) {
    console.error('[Seed Error]:', error.message);
  } finally {
    client.release();
  }
};
