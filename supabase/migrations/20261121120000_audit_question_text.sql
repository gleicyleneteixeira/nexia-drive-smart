UPDATE public.question_overrides
SET data = jsonb_set(
  data,
  '{statement}',
  to_jsonb(regexp_replace(data->>'statement', '^\s*Pergunta\s*:\s*', '', 'i')),
  true
)
WHERE data->>'statement' ~* '^\s*Pergunta\s*:';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Quem responde pela infração decorrente de uma conduta praticada durante a direção do veículo?'::text), true)
WHERE id = 'custom-aeo-1059' AND data->>'statement' LIKE '%infrações cometidas à direção%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,0}', to_jsonb('Proprietário do veículo.'::text), true)
WHERE id = 'custom-aeo-1059' AND data #>> '{options,0}' LIKE '%Proprietário do veiculo%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,1}', to_jsonb('Pai do condutor.'::text), true)
WHERE id = 'custom-aeo-1059' AND data #>> '{options,1}' = 'Pai do condutor;';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,2}', to_jsonb('Condutor.'::text), true)
WHERE id = 'custom-aeo-1059' AND data #>> '{options,2}' = 'Condutor;';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,3}', to_jsonb('Responsável pelo veículo.'::text), true)
WHERE id = 'custom-aeo-1059' AND data #>> '{options,3}' LIKE '%Responsável pelo veiculo%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb(replace(data->>'statement', 'Qual e a avaliacao', 'Qual é a avaliação')), true)
WHERE id = 'custom-aeo-2684' AND data->>'statement' LIKE '%Qual e a avaliacao%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,1}', to_jsonb(replace(data #>> '{options,1}', 'esta acompanhando', 'está acompanhando')), true)
WHERE id = 'custom-aeo-2684' AND data #>> '{options,1}' LIKE '%esta acompanhando%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,3}', to_jsonb(replace(data #>> '{options,3}', 'passage da ambulância', 'passagem da ambulância')), true)
WHERE id = 'custom-aeo-2684' AND data #>> '{options,3}' LIKE '%passage da ambulância%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb(replace(data->>'statement', 'veiculo', 'veículo')), true)
WHERE id = 'custom-aeo-1799' AND data->>'statement' LIKE '%veiculo%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb(replace(data->>'statement', 'seguranca', 'segurança')), true)
WHERE id = 'custom-aeo-2691' AND data->>'statement' LIKE '%seguranca%';

UPDATE public.question_overrides
SET data = jsonb_set(
  data,
  '{options,3}',
  to_jsonb(replace(replace(data #>> '{options,3}', 'centrímetros', 'centímetros'), 'veiculo', 'veículo')),
  true
)
WHERE id = 'custom-aeo-3069' AND data #>> '{options,3}' LIKE '%centrímetros%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb(replace(data->>'statement', 'Qual e o melhor', 'Qual é o melhor')), true)
WHERE id = 'custom-aeo-344' AND data->>'statement' LIKE '%Qual e o melhor%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,0}', to_jsonb('Verificar o pulso da vítima.'::text), true)
WHERE id = 'custom-aeo-974' AND data #>> '{options,0}' LIKE '%vitima%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,2}', to_jsonb('Verificar se as vítimas estão conscientes.'::text), true)
WHERE id = 'custom-aeo-974' AND data #>> '{options,2}' LIKE '%vitimas%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,3}', to_jsonb('As alternativas A e C estão corretas.'::text), true)
WHERE id = 'custom-aeo-974' AND data #>> '{options,3}' LIKE '%alternativas 1 e 3%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb(replace(data->>'statement', 'que influência na distância', 'que influencia na distância')), true)
WHERE id = 'custom-aeo-3122' AND data->>'statement' LIKE '%que influência na distância%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,0}', to_jsonb(replace(data #>> '{options,0}', 'Conservaçao', 'Conservação')), true)
WHERE id = 'custom-aeo-3122' AND data #>> '{options,0}' LIKE '%Conservaçao%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,2}', to_jsonb('Não deve ser audível pelo lado externo do veículo.'::text), true)
WHERE id = 'custom-aeo-1207' AND data #>> '{options,2}' LIKE '%nao audível%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra C: o som não deve ser audível pelo lado externo do veículo.'::text), true)
WHERE id = 'custom-aeo-1207' AND data->>'explanation' LIKE '%nao audível%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,0}', to_jsonb(replace(data #>> '{options,0}', 'nao apresente', 'não apresente')), true)
WHERE id = 'custom-aeo-2683' AND data #>> '{options,0}' LIKE '%nao apresente%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,1}', to_jsonb(replace(data #>> '{options,1}', 'à uma oficina', 'a uma oficina')), true)
WHERE id = 'custom-aeo-2683' AND data #>> '{options,1}' LIKE '%à uma oficina%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,2}', to_jsonb(replace(data #>> '{options,2}', 'substituido', 'substituído')), true)
WHERE id = 'custom-aeo-2683' AND data #>> '{options,2}' LIKE '%substituido%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb(replace(data->>'explanation', 'substituido', 'substituído')), true)
WHERE id = 'custom-aeo-2683' AND data->>'explanation' LIKE '%substituido%';

UPDATE public.question_overrides
SET data = jsonb_set(
  data,
  '{statement}',
  to_jsonb('Em um cruzamento sem qualquer sinalização de preferência, dois veículos chegam exatamente ao mesmo tempo ao ponto de encontro das vias. A qual veículo pertence a preferência?'::text),
  true
)
WHERE id = 'prova_geral_14' AND data->>'statement' LIKE '%figura%';

UPDATE public.question_overrides
SET data = jsonb_set(
  data,
  '{statement}',
  to_jsonb('Pedro dirige com o filho de 12 anos no banco de trás sem o cinto de segurança, mesmo em um trajeto curto. De acordo com o CTB e a Direção Defensiva, qual é a penalidade legal e o principal risco dessa conduta?'::text),
  true
)
WHERE id = 'custom-aeo-2360' AND data->>'statement' LIKE '%principal risco de segurança dessa atitude%';
