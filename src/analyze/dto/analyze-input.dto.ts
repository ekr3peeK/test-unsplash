import zod from 'zod';

export const analyizeInputDtoZod = zod.object({
  keyword: zod.string(),
  labels: zod.array(zod.string()).min(1)
});

export type AnalyzeInputDto = zod.infer<typeof analyizeInputDtoZod>;