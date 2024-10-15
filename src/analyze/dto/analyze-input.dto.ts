import zod from 'zod';

export const analyizeInputDto = zod.object({
  keyword: zod.string(),
  labels: zod.array(zod.string())
});

export type analyzeInputDtoType = zod.infer<typeof analyizeInputDto>;