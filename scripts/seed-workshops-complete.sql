-- Script to populate workshop_types table with the 9 workshops
-- Run this in Supabase SQL Editor

INSERT INTO workshop_types (name, slug, description, places_min, places_ideal, places_max, price, status) VALUES
('Ikigai - Trouver ton pourquoi', 'ikigai-pourquoi', 'Découvre ton Ikigai (passion + skills + valeurs + marché). L''atelier fondateur pour construire une base solide. Durée: 2h', 5, 15, 25, 49, 'active'),
('ICP - Identifier ton client idéal', 'icp-client-ideal', 'Crée ton Ideal Customer Profile détaillé. Comprendre à qui tu vends pour vendre mieux. Durée: 2h', 5, 15, 25, 49, 'active'),
('Rule of 1 - La spécialisation', 'rule-of-1-specialisation', 'Maîtrise la stratégie Rule of 1 (1 client, 1 service, 1 prix, 1 canal). La simplicité avant tout. Durée: 1.5h', 5, 15, 25, 39, 'active'),
('Messaging House - Construis ton message', 'messaging-house-message', 'Structure ton message avec la Messaging House. Les fondations de ta communication. Durée: 2.5h', 5, 15, 25, 49, 'active'),
('Brand Design - Crée ton identité', 'brand-design-identite', 'Développe ton identité visuelle et verbale. Design, couleurs, typographie, tone of voice. Durée: 3h', 5, 15, 25, 59, 'active'),
('Positionnement - Occupe ta place', 'positionnement-marche', 'Positionne-toi clairement sur ton marché. Différenciation stratégique. Durée: 2h', 5, 15, 25, 49, 'active'),
('Autorité Personnelle - Deviens expert', 'autorite-personnelle-expert', 'Construis ton autorité personnelle. Stratégie de personal branding et leadership. Durée: 2h', 5, 15, 25, 49, 'active'),
('Business in a Box - Ton modèle complet', 'business-in-a-box-modele', 'Assemble tous les éléments dans ton Business in a Box. Le modèle complet. Durée: 2.5h', 5, 15, 25, 59, 'active'),
('Construis ta marque - Pack complet', 'construis-ta-marque-pack', 'Le pack complet: Ikigai + ICP + Rule of 1 + Messaging House + Brand Design + Positionnement + Autorité Personnelle + Business in a Box. 9 sessions intensives. Durée: 18h. Accès illimité à tous les ateliers.', 5, 20, 30, 299, 'active');

-- Verify the inserts
SELECT id, name, slug, price, places_ideal FROM workshop_types ORDER BY created_at DESC LIMIT 10;
