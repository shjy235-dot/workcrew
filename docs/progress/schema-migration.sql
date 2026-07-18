-- 날짜/현장 기반 UI + 멀티 프로젝트 전환 기능을 위한 스키마 변경
-- Supabase SQL Editor에서 실행하세요.

-- 1. days 테이블에 현장(site) 컬럼 추가
ALTER TABLE days ADD COLUMN IF NOT EXISTS site text DEFAULT '';

-- 2. project_info를 여러 프로젝트를 담을 수 있도록 변경
ALTER TABLE project_info ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE project_info ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE project_info ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 3. days가 어느 프로젝트 소속인지 연결
ALTER TABLE days ADD COLUMN IF NOT EXISTS project_id text;
UPDATE days SET project_id = '1' WHERE project_id IS NULL;
