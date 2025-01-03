/*
  # Adicionar visibilidade e descrição às atividades

  1. Alterações
    - Adiciona campo `visibility` (public/private)
    - Adiciona campo `description` para descrições detalhadas
  
  2. Segurança
    - Atualiza políticas para considerar visibilidade
    - Adiciona políticas específicas para atividades públicas
*/

-- Adiciona novos campos
ALTER TABLE activities ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description text;

-- Atualiza políticas existentes
DROP POLICY IF EXISTS "Users can view their own activities" ON activities;

-- Política para visualização
CREATE POLICY "Users can view activities"
  ON activities
  FOR SELECT
  USING (
    auth.uid() = user_id -- Próprias atividades
    OR
    visibility = 'public' -- Atividades públicas
  );

-- Política para edição/exclusão (apenas proprietário)
CREATE POLICY "Only owners can update activities"
  ON activities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only owners can delete activities"
  ON activities
  FOR DELETE
  USING (auth.uid() = user_id);