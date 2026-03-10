-- Seed data para tabela de faixas
-- Inserção das faixas de Jiu-Jitsu com cores e ordem hierárquica

-- Faixas infantis (crianças)
INSERT INTO faixas (nome, categoria, cor_hex, ordem) VALUES
-- Faixas infantis (0-7)
('branca', 'infantil', '#FFFFFF', 1),
('cinza_com_branca', 'infantil', '#808080', 2),  -- Cinza com branco
('cinza', 'infantil', '#808080', 3),
('cinza_com_preta', 'infantil', '#808080', 4),   -- Cinza com preto
('amarela_com_branca', 'infantil', '#FFFF00', 5), -- Amarela com branco
('amarela', 'infantil', '#FFFF00', 6),
('amarela_com_preta', 'infantil', '#FFFF00', 7),  -- Amarela com preto
('laranja_com_branca', 'infantil', '#FFA500', 8), -- Laranja com branco
('laranja', 'infantil', '#FFA500', 9),
('laranja_com_preta', 'infantil', '#FFA500', 10), -- Laranja com preto
('verde_com_branca', 'infantil', '#008000', 11),  -- Verde com branco
('verde', 'infantil', '#008000', 12),
('verde_com_preta', 'infantil', '#008000', 13),   -- Verde com preto

-- Faixas adultas (a partir de 16 anos)
('azul', 'adulto', '#0000FF', 14),
('roxa', 'adulto', '#800080', 15),
('marrom', 'adulto', '#8B4513', 16),
('preta', 'adulto', '#000000', 17)

ON CONFLICT (nome) DO NOTHING;

-- Comentário: Esta migração insere os dados iniciais das faixas de Jiu-Jitsu
-- seguindo o sistema de graduação da IBJJF (International Brazilian Jiu-Jitsu Federation)
-- As faixas infantis vão da branca até a verde com preta
-- As faixas adultas começam na azul e vão até a preta