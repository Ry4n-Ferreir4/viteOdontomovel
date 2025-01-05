/*
  # Adicionar campo de status nas atividades

  1. Alterações:
    - Adicionar campo status com valores predefinidos
    - Definir valor padrão como 'aguardando_atendimento'
*/

-- Criar tipo enum para status
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status') THEN
    CREATE TYPE activity_status AS ENUM (
      'reservado',
      'confirmado',
      'atendimento_realizado',
      'aguardando_atendimento',
      'cancelado'
    );
  END IF;
END $$;

-- Adicionar coluna status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'status'
  ) THEN
    ALTER TABLE activities ADD COLUMN status activity_status NOT NULL DEFAULT 'aguardando_atendimento';
  END IF;
END $$;