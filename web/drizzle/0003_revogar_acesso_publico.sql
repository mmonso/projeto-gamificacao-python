-- Defesa em profundidade para E04.6: além do RLS sem políticas (0001), as funções usadas pela
-- API de dados do Supabase (anon e authenticated) não têm privilégio algum nas tabelas do esquema
-- public, inclusive nas criadas depois. Só a conexão do servidor lê e grava dados.
-- Em bancos sem essas funções (PGlite nos testes), nada é feito.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
  END IF;
END
$$;
