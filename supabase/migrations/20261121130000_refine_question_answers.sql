UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('A sinalização horizontal é aplicada diretamente sobre o pavimento da via, em faixas, símbolos e palavras que orientam o fluxo de veículos e pedestres. Essa sinalização se apresenta nas seguintes cores:'::text), true)
WHERE id = 'prova_geral_10' AND data->>'statement' LIKE '%sinalização horizontal%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,0}', to_jsonb('Amarela, vermelha, branca, azul, verde e preta.'::text), true)
WHERE id = 'prova_geral_10' AND data #>> '{options,0}' = 'Amarela, vermelha, branca, azul e preta.';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra A: a sinalização horizontal utiliza as cores amarela, vermelha, branca, azul, verde e preta. A cor verde delimita áreas de circulação do VLT.'::text), true)
WHERE id = 'prova_geral_10' AND data->>'explanation' LIKE '%marcas viárias usam amarelo%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{legalBase}', to_jsonb('Manual Brasileiro de Sinalização de Trânsito, Volume IV (Sinalização Horizontal)'::text), true)
WHERE id = 'prova_geral_10' AND data->>'legalBase' = 'Anexo II do CTB';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{options,1}', to_jsonb('Reincidir, no prazo de 12 meses, em entregar ou permitir a direção a pessoa sem habilitação, com direito suspenso ou de categoria incompatível, ou em dirigir sob influência de álcool.'::text), true)
WHERE id = 'l04_157' AND data #>> '{options,1}' LIKE '%arts. 163, 164 e 165%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra D: atingir o limite de pontos pode levar à suspensão, mas não é hipótese de cassação. A cassação pode ocorrer se o condutor dirigir durante a suspensão, reincidir em 12 meses em condutas como entregar ou permitir a direção a pessoa sem habilitação, com direito suspenso ou de categoria incompatível, ou dirigir sob influência de álcool, ou for condenado por delito de trânsito.'::text), true)
WHERE id = 'l04_157' AND data->>'explanation' LIKE '%Cassação só em três casos%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Em via urbana limitada a 40 km/h, radar registra condutor a 55 km/h, ou seja, 37,5% acima do limite. Que natureza de infração esse excesso de velocidade configura?'::text), true)
WHERE id = 'qe18' AND data->>'statement' LIKE '%radar registra condutor a 55 km/h%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra B: 37,5% acima do limite fica na faixa superior a 20% e até 50%, portanto configura infração grave (art. 218, II, do CTB).'::text), true)
WHERE id = 'qe18' AND data->>'explanation' LIKE '%representa um excesso de 37,5%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{detailedExplanation}', to_jsonb('O art. 218 do CTB estabelece três faixas: até 20% acima do limite = média; mais de 20% até 50% = grave; acima de 50% = gravíssima, com multa multiplicada por três e suspensão do direito de dirigir. Neste caso, 37,5% acima do limite configura infração grave.'::text), true)
WHERE id = 'qe18' AND data->>'detailedExplanation' LIKE '%dois patamares%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Em rodovia limitada a 110 km/h, condutor trafega a 170 km/h, aproximadamente 54,5% acima do limite. Que natureza de infração esse excesso de velocidade configura?'::text), true)
WHERE id = 'qe19' AND data->>'statement' LIKE '%condutor trafega a 170 km/h%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra A: exceder a velocidade máxima em mais de 50% configura infração gravíssima, com multa multiplicada por três e suspensão do direito de dirigir (art. 218, III, do CTB).'::text), true)
WHERE id = 'qe19' AND data->>'explanation' LIKE '%superior a 20% da máxima%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{detailedExplanation}', to_jsonb('Mais de 50% acima do limite enquadra a conduta no art. 218, III: infração gravíssima, com multa multiplicada por três e suspensão do direito de dirigir.'::text), true)
WHERE id = 'qe19' AND data->>'detailedExplanation' LIKE '%110 + 55%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{legalBase}', to_jsonb('Art. 218, III do CTB'::text), true)
WHERE id = 'qe19' AND data->>'legalBase' = 'Art. 218, I, b do CTB';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Em via arterial de 60 km/h, um condutor trafega a 80 km/h, ou seja, 33,3% acima do limite. A infração é:'::text), true)
WHERE id = 'ia_normas_138' AND data->>'statement' LIKE '%trafega a 80 km/h%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra A: 33,3% acima do limite fica na faixa superior a 20% e até 50%, portanto configura infração grave (art. 218, II, do CTB).'::text), true)
WHERE id = 'ia_normas_138' AND data->>'explanation' LIKE '%faz a conta%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{tip}', to_jsonb('Mais de 20% até 50% = infração grave.'::text), true)
WHERE id = 'ia_normas_138' AND data->>'tip' LIKE '%Conta:%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Em via coletora de 40 km/h, um condutor trafega a 61 km/h, ou seja, 52,5% acima do limite. A infração é:'::text), true)
WHERE id = 'ia_normas_139' AND data->>'statement' LIKE '%trafega a 61 km/h%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra C: 52,5% acima do limite ultrapassa a faixa de 50% e configura infração gravíssima, com multa multiplicada por três e suspensão do direito de dirigir (art. 218, III, do CTB).'::text), true)
WHERE id = 'ia_normas_139' AND data->>'explanation' LIKE '%61 em via de 40%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{commonMistake}', to_jsonb('Confundir a faixa acima de 50% com a infração grave.'::text), true)
WHERE id = 'ia_normas_139' AND data->>'commonMistake' LIKE '%Errar o percentual na pressa%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{tip}', to_jsonb('Acima de 50% = gravíssima, com multa multiplicada por três e suspensão.'::text), true)
WHERE id = 'ia_normas_139' AND data->>'tip' LIKE '%Aqui deu 52,5%:%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{explanation}', to_jsonb('Correta letra C: exceder a velocidade máxima em mais de 50% configura infração gravíssima, com multa multiplicada por três e suspensão do direito de dirigir (art. 218, III, do CTB).'::text), true)
WHERE id = 'q52' AND data->>'explanation' LIKE '%art. 218, II, b%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{detailedExplanation}', to_jsonb('O art. 218 do CTB estabelece três faixas: até 20% acima do limite = média; mais de 20% até 50% = grave; acima de 50% = gravíssima, com multa multiplicada por três e suspensão do direito de dirigir. Neste caso, o enunciado informa que o excesso supera 50%.'::text), true)
WHERE id = 'q52' AND data->>'detailedExplanation' LIKE '%Nas vias urbanas, até 50% acima do limite%';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{legalBase}', to_jsonb('Art. 218, III do CTB'::text), true)
WHERE id = 'q52' AND data->>'legalBase' = 'Art. 218, II, b do CTB';

UPDATE public.question_overrides
SET data = jsonb_set(data, '{statement}', to_jsonb('Em rodovia com máxima de 100 km/h, o radar registra 120 km/h, exatamente 20% acima do limite. Como fica classificada essa infração por excesso de velocidade?'::text), true)
WHERE id = 'td_30' AND data->>'statement' LIKE '%radar registra 120 km/h%';
