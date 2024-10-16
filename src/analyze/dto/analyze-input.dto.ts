import zod from 'zod';

export const analyizeInputDtoZod = zod.object({
  keyword: zod.string(),
  labels: zod.array(zod.string()).min(1),
  max: zod.number().optional(),
});

export type AnalyzeInputDto = zod.infer<typeof analyizeInputDtoZod>;