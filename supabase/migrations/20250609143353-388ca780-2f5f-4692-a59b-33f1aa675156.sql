
-- Add the Data View menu item for multipliers (check if it doesn't exist first)
INSERT INTO public.menu_items (
  id,
  name,
  href,
  icon_name,
  description,
  is_active,
  sort_order
) 
SELECT 
  gen_random_uuid(),
  'Vista de Datos',
  '/lots/data-view',
  'Database',
  'Vista de datos completa con filtros avanzados',
  true,
  15
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_items WHERE href = '/lots/data-view'
);

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
  AND NOT EXISTS (
    SELECT 1 FROM public.role_menu_permissions rmp 
    WHERE rmp.menu_item_id = mi.id AND rmp.role = 'multiplier'
  );

-- Add permissions for admin role too
INSERT INTO public.role_menu_permissions (
  id,
  role,
  menu_item_id,
  is_visible
)
SELECT 
  gen_random_uuid(),
  'admin',
  mi.id,
  true
FROM public.menu_items mi
WHERE mi.href = '/lots/data-view'
  AND NOT EXISTS (
    SELECT 1 FROM public.role_menu_permissions rmp 
    WHERE rmp.menu_item_id = mi.id AND rmp.role = 'admin'
  );
