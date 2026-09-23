
CREATE POLICY "Public read library files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'library');
CREATE POLICY "Admins upload library files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update library files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete library files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'library' AND public.has_role(auth.uid(), 'admin'));
