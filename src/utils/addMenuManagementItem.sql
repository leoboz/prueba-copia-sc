
-- Insert the new Menu Management item
INSERT INTO public.menu_items (name, href, icon_name, description, sort_order) 
VALUES ('Gestión de Menús', '/admin/menu', 'Settings', 'Menu and permissions management', 9);

-- Add permissions for admin role only
INSERT INTO public.role_menu_permissions (menu_item_id, role, is_visible) 
SELECT id, 'admin', true 
FROM public.menu_items 
WHERE name = 'Gestión de Menús';

-- Add disabled permissions for other roles
INSERT INTO public.role_menu_permissions (menu_item_id, role, is_visible) 
SELECT mi.id, role_name, false
FROM public.menu_items mi
CROSS JOIN (VALUES ('lab'), ('geneticsCompany'), ('farmer'), ('multiplier')) AS roles(role_name)
WHERE mi.name = 'Gestión de Menús';
