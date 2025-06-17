
-- Add the Data View menu item for multipliers
INSERT INTO public.menu_items (
  id,
  name,
  href,
  icon_name,
  description,
  is_active,
  sort_order
) VALUES (
  gen_random_uuid(),
  'Vista de Datos',
  '/lots/data-view',
  'Database',
  'Vista de datos completa con filtros avanzados',
  true,
  15
) ON CONFLICT (href) DO NOTHING;

-- Add permissions for multiplier role
INSERT INTO public.role_menu_permissions (
  id,
  role,
  menu_item_id,
  is_visible
)
SELECT 
  gen_random_uuid(),
  'multiplier',
  mi.id,
  true
FROM public.menu_items mi
WHERE mi.href = '/lots/data-view'
ON CONFLICT DO NOTHING;
