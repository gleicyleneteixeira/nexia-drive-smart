UPDATE public.question_overrides
SET data =
  data || jsonb_build_object(
    'statement', 'O que significa o princípio ''o maior cuida do menor'' no trânsito?'::text,
    'options', jsonb_build_array(
      'Quem conduz veículo maior deve proteger os usuários mais vulneráveis, como pedestres e ciclistas.'::text,
      'Pedestres e ciclistas devem sempre ceder passagem aos veículos motorizados.'::text,
      'A regra vale apenas para veículos de emergência em serviço.'::text,
      'Veículos maiores têm preferência em cruzamentos, independentemente da sinalização.'::text
    ),
    'correctIndex', 0,
    'explanation', 'Correta letra A: quem conduz um veículo maior deve priorizar a segurança dos usuários mais vulneráveis, como pedestres e ciclistas.'::text,
    'detailedExplanation', 'O princípio ''o maior cuida do menor'' orienta condutores de veículos mais pesados ou rápidos a agir com maior responsabilidade, considerando que pedestres, ciclistas e ocupantes de veículos menores sofrem maiores consequências em um sinistro.'::text,
    'tip', 'Maior responsabilidade sobre quem está mais vulnerável no trânsito.'::text,
    'commonMistake', 'Confundir responsabilidade proporcional ao risco com preferência automática nos cruzamentos.'::text,
    'category', 'direcao-defensiva'::text,
    'incidence', 'media'::text,
    'difficulty', 2,
    'origin', 'real'::text,
    'source', 'override'::text,
    'trap', false,
    'ok', 'Quem conduz veículo maior deve proteger os usuários mais vulneráveis, como pedestres e ciclistas.'::text
  )
WHERE id = 'custom-aeo-2792';
