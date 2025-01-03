/*
  # Adiciona campos de visibilidade e descrição

  1. Novos Campos
    - `visibility` (text) - Tipo de visibilidade da atividade (public/private)
    - `description` (text) - Descrição detalhada da atividade

  2. Segurança
    - Atualiza políticas para permitir visualização de atividades públicas
    - Mantém restrições de edição/exclusão apenas para proprietários
*/

-- Adiciona novos campos
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private',
ADD COLUMN IF NOT EXISTS description text;

-- Atualiza políticas
DROP POLICY IF EXISTS "Users can view their own activities" ON activities;

CREATE POLICY "Users can view activities"
  ON activities
  FOR SELECT
  USING (
    auth.uid() = user_id -- Próprias atividades
    OR
    visibility = 'public' -- Atividades públicas
  );

-- Garante que apenas proprietários podem editar/excluir
CREATE POLICY "Only owners can modify activities"
  ON activities
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);